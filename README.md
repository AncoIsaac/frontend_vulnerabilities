# Security Labs 🛡️

**Security Labs** es una plataforma educativa interactiva diseñada para demostrar y enseñar sobre vulnerabilidades web comunes de una manera segura y controlada.

> [!CAUTION] > **AVISO LEGAL:** Esta aplicación ha sido desarrollada estrictamente con fines educativos y de investigación. El uso de la información o el código proporcionado para atacar objetivos sin autorización previa es ilegal y está prohibido. El autor no se hace responsable del mal uso de esta herramienta.

## 🚀 Características

Esta aplicación proporciona un entorno de laboratorio ("sandbox") para experimentar con las siguientes vulnerabilidades:

### 💉 Cross-Site Scripting (XSS)

Explora cómo los scripts maliciosos pueden ser inyectados en sitios web confiables.

- **Demos Interactivas:** Prueba diferentes payloads de XSS.
- **Visualización en Tiempo Real:** Observa cómo el navegador renderiza y ejecuta el código inyectado.

### 🔓 SQL Injection (SQLi)

Aprende cómo las consultas a bases de datos pueden ser manipuladas.

- **Simulación de Login:** Intenta bypassear la autenticación utilizando técnicas de inyección SQL.
- **Feedback Inmediato:** Visualiza cómo tus inputs alteran la lógica de la consulta simulada.

### 📂 Gestión de Archivos (File Vulnerabilities)

(Próximamente) Módulos para entender vulnerabilidades relacionadas con la carga y gestión de archivos insegura.

## 🛠️ Tecnologías

Este proyecto está construido con un stack moderno y eficiente:

- **[React](https://react.dev/)**: Biblioteca para interfaces de usuario.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático para un código más robusto.
- **[Vite](https://vitejs.dev/)**: Entorno de desarrollo ultrarrápido.
- **CSS Modules**: Estilado modular y mantenible.

## 🏁 Comenzando

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 16 o superior recomendada)
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/)

### Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone <tu-repositorio-url>
    cd xxs
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

4.  **Abre tu navegador:**
    Visita la URL que aparece en la terminal (usualmente `http://localhost:5173`).

## 🐳 Docker (Próximamente)

> [!NOTE]
> Estamos trabajando en la contenedorización de la aplicación para facilitar aún más su despliegue y pruebas.

La integración con Docker permitirá ejecutar todo el entorno de laboratorio con un solo comando, asegurando consistencia entre diferentes sistemas operativos y evitando problemas de dependencias.

---

_Happy Hacking (Ético)!_ 🖥️🔍
