import { useState } from 'react';
import styles from './App.module.css';
import XSS from './page/xss/XSS';
import SQLInjection from './page/sql/SQLInjection';
import Navbar from './components/Navigation/Navbar';
import Files from './page/files/Files';

function App() {
  const [activeTab, setActiveTab] = useState('xss');

  const renderContent = () => {
    switch (activeTab) {
      case 'xss':
        return <XSS />;
      case 'sql':
        return <SQLInjection />;
      case 'files':
        return <Files />;
      default:
        return <XSS />;
    }
  };

  return (
    <main className={styles.app}>
      <div className={styles.app__container}>
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.app__content}>
          <div className={styles.app__contentInner}>
            <header className={styles.app__header}>
              <h1 className={styles.app__title}>
                <span className='text-gradient'>Security Labs</span>
              </h1>
              <p className={styles.app__subtitle}>
                Demostraciones interactivas de vulnerabilidades web
              </p>
            </header>

            <div className={styles.app__tabContent}>{renderContent()}</div>

            <footer className={styles.app__footer}>
              <p className={styles.app__footerText}>
                Esta aplicación es para fines educativos. No utilizar para
                actividades maliciosas.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
