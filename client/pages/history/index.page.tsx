import { WS_PATH } from 'api/@constants';
import type { EntityId } from 'api/@types/brandedId';
import type { CompletedWorkEntity, FailedWorkEntity, WorkEntity } from 'api/@types/work';
import DOMPurify from 'dompurify';
import styles from 'pages/history/index.module.css';
import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { SERVER_PORT } from 'utils/envValues';

type ContentDict = Record<EntityId['work'], string | undefined>;
const renderCompleted = (work: WorkEntity, sanitizedContent: string) => (
  <div className={styles.imageFrame}>
    <img src={work.imageUrl ?? undefined} alt={work.title} className={styles.workImage} />
    <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  </div>
);
const MainContent = (props: { work: WorkEntity; contentDict: ContentDict }) => {
  const content = props.contentDict[props.work.id];
  const sanitizedContent = content ? DOMPurify.sanitize(content) : '';
  switch (props.work.status) {
    case 'completed':
      return renderCompleted(props.work, sanitizedContent);

    /* v8 ignore next 2 */
    default:
      throw new Error('Unexpected status');
  }
};
const History = () => {
  const { lastMessage } = useWebSocket(
    process.env.NODE_ENV === 'production'
      ? `wss://${location.host}${WS_PATH}`
      : `ws://localhost:${SERVER_PORT}${WS_PATH}`,
  );
  const [works, setWorks] = useState<WorkEntity[]>();
  const [contentDict, setContentDict] = useState<ContentDict>({});

  const fetchContent = useCallback(async (w: WorkEntity) => {
    const content = await fetch(w.contentUrl).then((b) => b.text());
    setContentDict((dict) => ({ ...dict, [w.id]: content }));
  }, []);

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
  if (!works) return <div>まだ履歴がありません</div>;
  return (
    <div>
      これは履歴のページです
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

export default History;
