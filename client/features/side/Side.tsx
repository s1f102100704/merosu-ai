import { useRouter } from 'next/router';
import { pagesPath } from 'utils/$path';
import styles from './side.module.css';
export const Side = () => {
  const router = useRouter();
  const showHistory = () => {
    router.push(pagesPath.history.$url());
  };
  const showLike = () => {
    router.push(pagesPath.favorite.$url());
  };
  return (
    <main>
      <div className={styles.hisButton} onClick={showHistory}>
        履歴
      </div>
      <div className={styles.hisButton} onClick={showLike}>
        Like
      </div>
    </main>
  );
};
