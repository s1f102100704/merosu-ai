import styles from './history.module.css';
export const History = () => {
  const showHistory = () => {};
  return (
    <main>
      <div className={styles.hisButton} onClick={showHistory}>
        履歴
      </div>
    </main>
  );
};
