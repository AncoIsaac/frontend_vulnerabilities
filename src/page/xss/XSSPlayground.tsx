import XSSLogic from './logic/XSSLogic';
import { examplePayloads } from './payloads/examplePayloads';
import styles from './XSS.module.css';

const XSSPlayground = () => {
  const {
    message,
    payloadHistory,
    isSafeMode,
    isLoading,
    setIsSafeMode,
    handleSend,
    setMessage,
    clearHistory,
    setPayloadHistory,
    handleKeyPress,
    handleExampleClick,
    sanitizeHTML,
  } = XSSLogic();

  // Función para evaluar scripts en modo vulnerable
  const evaluateScripts = (html: string) => {
    // Solo en modo vulnerable
    if (!isSafeMode) {
      // Temporizador para ejecutar scripts después del renderizado
      setTimeout(() => {
        const scripts = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
        if (scripts) {
          scripts.forEach((scriptTag) => {
            const scriptContent = scriptTag.replace(/<\/?script>/gi, '');
            try {
              // Usamos Function para evitar problemas de scope
              new Function(scriptContent)();
            } catch (error) {
              console.warn('Error ejecutando script:', error);
            }
          });
        }
      }, 100);
    }
    return html;
  };

  const renderOutput = (): React.ReactNode => {
    if (!message) {
      return (
        <div className={styles.xss__placeholder}>
          <span className={styles.xss__placeholderIcon}>👈</span>
          <p className={styles.xss__placeholderText}>
            {isSafeMode
              ? 'Escribe un payload para ver cómo se sanitiza automáticamente'
              : '¡ADVERTENCIA! Cualquier código que escribas se ejecutará aquí'}
          </p>
        </div>
      );
    }

    const content = isSafeMode
      ? sanitizeHTML(message)
      : evaluateScripts(message);

    return (
      <div
        className={styles.xss__renderedOutput}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className={styles.xss}>
      {/* Header */}
      <header className={styles.xss__header}>
        <h1 className={`${styles.xss__title} text-gradient`}>
          XSS Security Lab
        </h1>
        <p className={styles.xss__subtitle}>
          Laboratorio completo para aprender sobre vulnerabilidades XSS
        </p>
      </header>

      <div className={styles.xss}>
        {/* Mode Selector */}
        <div className={styles.xss__controls}>
          <div className={styles.xss__modeSelector}>
            <h3 className={styles.xss__modeTitle}>Modo de Ejecución:</h3>
            <div className={styles.xss__modeToggle}>
              <button
                className={`${styles.xss__modeButton} ${
                  isSafeMode ? styles['xss__modeButton--active'] : ''
                }`}
                onClick={() => setIsSafeMode(true)}
                aria-pressed={isSafeMode}
              >
                <span className={styles.xss__modeIcon}>🛡️</span>
                <div className={styles.xss__modeText}>
                  <div className={styles.xss__modeLabel}>Modo Seguro</div>
                  <div className={styles.xss__modeDescription}>
                    HTML sanitizado
                  </div>
                </div>
              </button>
              <button
                className={`${styles.xss__modeButton} ${
                  !isSafeMode ? styles['xss__modeButton--active'] : ''
                }`}
                onClick={() => setIsSafeMode(false)}
                aria-pressed={!isSafeMode}
              >
                <span className={styles.xss__modeIcon}>⚡</span>
                <div className={styles.xss__modeText}>
                  <div className={styles.xss__modeLabel}>Modo Vulnerable</div>
                  <div className={styles.xss__modeDescription}>
                    HTML ejecutado
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.xss__main}>
          {/* Input Section */}
          <div className={styles.xss__inputSection}>
            <div className={styles.xss__inputCard}>
              <div className={styles.xss__inputHeader}>
                <h3 className={styles.xss__inputTitle}>
                  Payload XSS
                  <span className={styles.xss__inputSubtitle}>
                    {isSafeMode
                      ? ' (Sanitizado automáticamente)'
                      : ' (Se ejecuta directamente)'}
                  </span>
                </h3>

                <div className={styles.xss__charCount}>
                  {message.length} / 1000 caracteres
                </div>
              </div>

              {/* Examples */}
              <div className={styles.xss__examples}>
                <h4 className={styles.xss__examplesTitle}>
                  Ejemplos de Payload:
                </h4>
                <div className={styles.xss__exampleGrid}>
                  {examplePayloads.map((example, index) => (
                    <button
                      key={index}
                      className={styles.xss__exampleButton}
                      onClick={() => handleExampleClick(example.value)}
                      title={example.description}
                      type='button'
                    >
                      <span className={styles.xss__exampleLabel}>
                        {example.label}
                      </span>
                      {example.description && (
                        <span className={styles.xss__exampleDescription}>
                          {example.description}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className={styles.xss__textareaContainer}>
                <textarea
                  className={styles.xss__textarea}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyPress}
                  placeholder={
                    isSafeMode
                      ? 'Ingresa tu payload HTML aquí... (será sanitizado automáticamente)'
                      : '¡PELIGRO! Cualquier código aquí se ejecutará directamente en el navegador'
                  }
                  rows={8}
                  maxLength={1000}
                  spellCheck='false'
                />
                <div className={styles.xss__textareaFooter}>
                  <span className={styles.xss__hint}>
                    💡 Presiona Ctrl + Enter para ejecutar rápidamente
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.xss__actions}>
                <button
                  className={`${styles.xss__button} ${styles['xss__button--primary']}`}
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  type='button'
                >
                  {isLoading ? (
                    <>
                      <span className={styles.xss__buttonSpinner} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <span className={styles.xss__buttonIcon}>🚀</span>
                      Ejecutar Payload
                    </>
                  )}
                </button>

                <div className={styles.xss__secondaryActions}>
                  <button
                    className={`${styles.xss__button} ${styles['xss__button--secondary']}`}
                    onClick={() => setMessage('')}
                    disabled={!message.trim()}
                    type='button'
                  >
                    <span className={styles.xss__buttonIcon}>✕</span>
                    Limpiar
                  </button>
                  <button
                    className={`${styles.xss__button} ${styles['xss__button--danger']}`}
                    onClick={clearHistory}
                    disabled={payloadHistory.length === 0 && !message.trim()}
                    type='button'
                  >
                    <span className={styles.xss__buttonIcon}>🗑️</span>
                    Limpiar Todo
                  </button>
                </div>
              </div>
            </div>

            {/* History */}
            {payloadHistory.length > 0 && (
              <div className={styles.xss__history}>
                <div className={styles.xss__historyHeader}>
                  <h3 className={styles.xss__historyTitle}>
                    Historial de Payloads
                    <span className={styles.xss__historyCount}>
                      ({payloadHistory.length})
                    </span>
                  </h3>
                  <button
                    className={styles.xss__clearHistory}
                    onClick={() => setPayloadHistory([])}
                    type='button'
                  >
                    Limpiar historial
                  </button>
                </div>

                <div className={styles.xss__historyList}>
                  {payloadHistory.map((item, index) => (
                    <div
                      key={`${item.timestamp}-${index}`}
                      className={`${styles.xss__historyItem} ${
                        item.safeMode
                          ? styles['xss__historyItem--safe']
                          : styles['xss__historyItem--danger']
                      }`}
                    >
                      <div className={styles.xss__historyMeta}>
                        <span className={styles.xss__historyTime}>
                          {item.timestamp}
                        </span>
                        <span
                          className={`${styles.xss__historyBadge} ${
                            item.safeMode
                              ? styles['xss__historyBadge--safe']
                              : styles['xss__historyBadge--danger']
                          }`}
                        >
                          {item.safeMode ? 'Seguro' : 'Vulnerable'}
                        </span>
                      </div>
                      <pre className={styles.xss__historyPayload}>
                        <code>{item.payload}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className={styles.xss__outputSection}>
            <div
              className={`${styles.xss__outputCard} ${
                !isSafeMode ? styles['xss__outputCard--danger'] : ''
              }`}
            >
              <div className={styles.xss__outputHeader}>
                <h3 className={styles.xss__outputTitle}>
                  {isSafeMode ? 'Salida Sanitizada' : 'Salida Vulnerable'}
                </h3>
                <div
                  className={`${styles.xss__outputStatus} ${
                    isSafeMode
                      ? styles['xss__outputStatus--safe']
                      : styles['xss__outputStatus--danger']
                  }`}
                >
                  {isSafeMode ? '🛡️ PROTEGIDO' : '⚠️ VULNERABLE'}
                </div>
              </div>

              <div
                className={`${styles.xss__outputContainer} ${
                  !isSafeMode ? styles['xss__outputContainer--danger'] : ''
                }`}
              >
                {renderOutput()}
              </div>

              <div className={styles.xss__outputStats}>
                <div className={styles.xss__stat}>
                  <span className={styles.xss__statLabel}>Estado:</span>
                  <span
                    className={`${styles.xss__statValue} ${
                      isSafeMode
                        ? styles['xss__statValue--safe']
                        : styles['xss__statValue--danger']
                    }`}
                  >
                    {isSafeMode ? 'Aplicación segura' : 'Aplicación vulnerable'}
                  </span>
                </div>
                <div className={styles.xss__stat}>
                  <span className={styles.xss__statLabel}>Caracteres:</span>
                  <span className={styles.xss__statValue}>
                    {message.length}
                  </span>
                </div>
                <div className={styles.xss__stat}>
                  <span className={styles.xss__statLabel}>Modo:</span>
                  <span className={styles.xss__statValue}>
                    {isSafeMode ? 'Sanitización activa' : 'Sin sanitización'}
                  </span>
                </div>
              </div>

              {!isSafeMode && (
                <div className={styles.xss__dangerWarning}>
                  <div className={styles.xss__dangerHeader}>
                    <span className={styles.xss__dangerIcon}>🚨</span>
                    <strong className={styles.xss__dangerTitle}>
                      ALTA PELIGROSIDAD
                    </strong>
                  </div>
                  <p className={styles.xss__dangerText}>
                    En modo vulnerable, cualquier código JavaScript se ejecutará
                    con los mismos privilegios que la aplicación. Esto puede
                    incluir robos de cookies, redirecciones maliciosas y más.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Tips */}
        <footer className={styles.xss__footer}>
          <div className={styles.xss__tip}>
            <span className={styles.xss__tipIcon}>💡</span>
            <p className={styles.xss__tipText}>
              <strong>Consejo:</strong> En aplicaciones reales, siempre usa
              librerías como
              <code>DOMPurify</code> para sanitizar HTML y nunca confíes en
              entradas del usuario.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default XSSPlayground;
