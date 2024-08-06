import { useRouter } from 'next/router';
import { pagesPath } from 'utils/$path';
import styles from './side.module.css';
export const Side = () => {
  const router = useRouter();
  const showHistory = () => {
    router.push(pagesPath.history.$url());
  };
  return (
    <main>
      <a className={styles.hisButton} onClick={showHistory}>
        履歴
      </a>
    </main>
  );
};
