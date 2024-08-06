import { Side } from 'features/side/Side';
import { Works } from 'features/works/Works';
import { Layout } from 'layouts/Layout';
import styles from './index.module.css';

const Home = () => {
  return (
    <Layout
      render={() => (
        <div className={styles.container}>
          <Side />
          <div>
            <div className={styles.title}>Welcome Merosu-AI!</div>

            <Works />
          </div>
        </div>
      )}
    />
  );
};

export default Home;
