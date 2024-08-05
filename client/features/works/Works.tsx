import { WS_PATH } from 'api/@constants';
import type { EntityId } from 'api/@types/brandedId';
import type { CompletedWorkEntity, FailedWorkEntity, WorkEntity } from 'api/@types/work';
import { ContentLoading } from 'components/loading/ContentLoading';
import { Loading } from 'components/loading/Loading';
import DOMPurify from 'dompurify';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { apiClient } from 'utils/apiClient';
import { SERVER_PORT } from 'utils/envValues';
import styles from './works.module.css';

type ContentDict = Record<EntityId['work'], string | undefined>;
const renderLoading = () => (
  <div style={{ height: '500px' }}>
    <ContentLoading />
  </div>
);

const renderCompleted = (work: WorkEntity, sanitizedContent: string) => (
  <div className={styles.imageFrame}>
    <img src={work.imageUrl ?? undefined} alt={work.title} className={styles.workImage} />
    <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  </div>
);

const renderFailed = (work: WorkEntity) => <div className={styles.errorMsg}>{work.errorMsg}</div>;

const MainContent = (props: { work: WorkEntity; contentDict: ContentDict }) => {
  const content = props.contentDict[props.work.id];
  const sanitizedContent = content ? DOMPurify.sanitize(content) : '';
  switch (props.work.status) {
    case 'loading':
      return renderLoading();
    case 'completed':
      return renderCompleted(props.work, sanitizedContent);
    case 'failed':
      return renderFailed(props.work);
    /* v8 ignore next 2 */
    default:
      throw new Error('Unexpected status');
  }
};
export const Works = () => {
  const catchApiErr = useCatchApiErr();
  const { lastMessage } = useWebSocket(
    process.env.NODE_ENV === 'production'
      ? `wss://${location.host}${WS_PATH}`
      : `ws://localhost:${SERVER_PORT}${WS_PATH}`,
  );

  const [works, setWorks] = useState<WorkEntity[]>();
  const [contentDict, setContentDict] = useState<ContentDict>({});
  const [novelUrl, setNovelUrl] = useState('');
  const fetchContent = useCallback(async (w: WorkEntity) => {
    const content = await fetch(w.contentUrl).then((b) => b.text());
    setContentDict((dict) => ({ ...dict, [w.id]: content }));
  }, []);

  const createWork = async (e: FormEvent) => {
    e.preventDefault();
    setNovelUrl('');
    const work = await apiClient.private.works.$post({ body: { novelUrl } }).catch(catchApiErr);
    console.log(work);
    if (work !== null && works?.every((w) => w.id !== work.id)) {
      setWorks((prevWorks) => {
        const updatedWorks = [work, ...(prevWorks ?? [])];
        return updatedWorks.length > 3 ? updatedWorks.slice(0, 3) : updatedWorks;
      });
    }
  };

  useEffect(() => {
    //.$getでcontroller.tsのgetが発動
    if (works !== undefined) return;
    apiClient.private.works
      .$get()
      .then((ws) => {
        setWorks(ws);
        return Promise.all(ws.map(fetchContent));
      })
      .catch(catchApiErr);
  }, [catchApiErr, works, contentDict, fetchContent]);

  useEffect(() => {
    if (lastMessage === null) return;
    const loadedWork: CompletedWorkEntity | FailedWorkEntity = JSON.parse(lastMessage.data);
    setWorks((prevWorks) => {
      const updatedWorks = prevWorks?.some((w) => w.id === loadedWork.id)
        ? prevWorks.map((w) => (w.id === loadedWork.id ? loadedWork : w))
        : [loadedWork, ...(prevWorks ?? [])];
      return updatedWorks.length > 3 ? updatedWorks.slice(0, 3) : updatedWorks;
    });

    if (contentDict[loadedWork.id] === undefined) {
      fetchContent(loadedWork);
    }
  }, [lastMessage, contentDict, fetchContent]);

  if (!works) return <Loading visible />;

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <form className={styles.form} onSubmit={createWork}>
          <input
            value={novelUrl}
            className={styles.textInput}
            type="text"
            placeholder="青空文庫の作品ページURL"
            onChange={(e) => setNovelUrl(e.target.value)}
          />
          <div className={styles.controls}>
            <input className={styles.btn} disabled={novelUrl === ''} type="submit" value="CREATE" />
          </div>
        </form>
      </div>
      {works.map((work) => (
        <div key={work.id} className={styles.card}>
          <MainContent work={work} contentDict={contentDict} />
          <div className={styles.form}>
            <div className={styles.controls}>
              <span>
                {work.title}-{work.author}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
