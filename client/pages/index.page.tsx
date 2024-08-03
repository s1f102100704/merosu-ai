import { Works } from 'features/works/Works';
import { Layout } from 'layouts/Layout';
import styles from './index.module.css';

const Home = () => {
  return (
    <Layout
      render={() => (
        <div className={styles.container}>
          <div className={styles.title}>Welcome Merosu-AI!</div>
          <Works />
        </div>
      )}
    />
  );
};

export default Home;
