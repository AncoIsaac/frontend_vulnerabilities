import styles from './Navigation.module.css';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const tabs = [
    {
      id: 'xss',
      label: 'XSS Attack',
      description: 'Cross-Site Scripting',
      icon: '🛡️',
    },
    {
      id: 'sql',
      label: 'SQL Injection',
      description: 'Database vulnerability',
      icon: '💾',
    },
    {
      id: 'files',
      label: 'File Upload',
      description: 'File upload vulnerability',
      icon: '📂',
    },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navigation__header}>
        <div className={styles.navigation__logo}>
          <span className={styles.navigation__logoIcon}>🔐</span>
          <h2 className={styles.navigation__logoText}>Security Lab</h2>
        </div>
        <p className={styles.navigation__tagline}>
          Aprende sobre seguridad web
        </p>
      </div>

      <ul className={styles.navigation__list}>
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.navigation__item}>
            <button
              className={`${styles.navigation__button} ${
                activeTab === tab.id ? styles['navigation__button--active'] : ''
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className={styles.navigation__icon}>{tab.icon}</span>
              <div className={styles.navigation__text}>
                <span className={styles.navigation__label}>{tab.label}</span>
                <span className={styles.navigation__description}>
                  {tab.description}
                </span>
              </div>
              <div className={styles.navigation__indicator} />
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.navigation__footer}>
        <div className={styles.navigation__status}>
          <div className={styles.navigation__statusDot} />
          <span className={styles.navigation__statusText}>
            Modo educativo activo
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
