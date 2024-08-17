import type { EntityId } from 'api/@types/brandedId';
import type { HistoryEntity } from 'api/@types/history';
import DOMPurify from 'dompurify';
import { useCatchApiErr } from 'hooks/useCatchApiErr';
import { useWeb } from 'hooks/useWeb';
import styles from 'pages/history/index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';

type ContentDict = Record<EntityId['history'], string | undefined>;
const renderCompleted = (history: HistoryEntity, sanitizedContent: string) => (
  <div className={styles.imageFrame}>
    <img src={history.imageUrl ?? undefined} alt={history.title} className={styles.workImage} />
    <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  </div>
);
const MainContent = (props: { history: HistoryEntity; contentDict: ContentDict }) => {
  const content = props.contentDict[props.history.id];
  const sanitizedContent = content ? DOMPurify.sanitize(content) : '';
  switch (props.history.status) {
    case 'completed':
      return renderCompleted(props.history, sanitizedContent);

      return;

    /* v8 ignore next 2 */
    default:
      throw new Error('Unexpected status');
  }
};
const History = () => {
  const catchApiErr = useCatchApiErr();
  const { lastMessage } = useWeb();
  const [works, setWorks] = useState<HistoryEntity[]>();
  const [contentDict, setContentDict] = useState<ContentDict>({});
  console.log(lastMessage);
  const fetchContent = useCallback(async (w: HistoryEntity) => {
    const content = await fetch(w.contentUrl).then((b) => b.text());
    setContentDict((dict) => ({ ...dict, [w.id]: content }));
  }, []);

  useEffect(() => {
    //.$getでcontroller.tsのgetが発動
    if (works !== undefined) return;
    apiClient.private.history
      .$get()
      .then((ws) => {
        setWorks(ws);
        return Promise.all(ws.map(fetchContent));
      })
      .catch(catchApiErr);
  }, [catchApiErr, works, contentDict, fetchContent]);

  useEffect(() => {
    if (lastMessage === null) return;
    const loadedWork: HistoryEntity = JSON.parse(lastMessage.data);
    console.log(loadedWork);
    setWorks((prevWorks) =>
      prevWorks?.some((w) => w.id === loadedWork.id)
        ? prevWorks.map((w) => (w.id === loadedWork.id ? loadedWork : w))
        : [loadedWork, ...(prevWorks ?? [])],
    );

    if (contentDict[loadedWork.id] === undefined) {
      fetchContent(loadedWork);
    }
  }, [lastMessage, contentDict, fetchContent]);
  if (!works) return <div>まだ履歴がありません</div>;
  return (
    <div className={styles.main}>
      これは履歴のページです
      {works.map((work) => (
        <div key={work.id} className={styles.card}>
          <MainContent history={work} contentDict={contentDict} />
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
