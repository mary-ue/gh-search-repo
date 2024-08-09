import { Footer } from '../../components/Footer/Footer';
import { Header } from '../../components/Header/Header';
import { Main } from '../../components/Main/Main';
import styles from './MainPage.module.scss';

export const MainPage = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <Header />
      <Main />
      <Footer />
    </div>
  );
};