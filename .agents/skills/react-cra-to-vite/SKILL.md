---
name: react-cra-to-vite
description: Use this skill to migrate legacy React projects created with Create React App (react-scripts) to modern Vite, Vitest, and Tailwind CSS v4. Covers environment initialization with FNM, updating package.json, moving index.html, renaming JSX files, and configuring vite.config.js.
---

# Migración de Create React App (CRA) a Vite, Vitest y Tailwind CSS v4

Esta skill define el procedimiento estandarizado para migrar cualquier proyecto de React antiguo basado en `react-scripts` hacia una arquitectura moderna con **Vite**, **Vitest** y **Tailwind CSS v4**.

---

## 1. Requisitos Previos y Entorno (FNM)

Antes de ejecutar cualquier comando de `npm` o `node`, se debe asegurar el uso de la versión de Node.js adecuada mediante **FNM (Fast Node Manager)**.

### PowerShell (Windows):
```powershell
fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression
fnm use 24.16.0
```

### Bash / Zsh (Linux / macOS):
```bash
eval "$(fnm env --use-on-cd)"
fnm use 24.16.0
```

> **Verificación:** Ejecutar `node -v` (debe reportar `v24.16.0` o versión 20+) y `npm -v` (10+).

---

## 2. Versiones Estandarizadas de Dependencias

Para garantizar compatibilidad total entre React 17/18, Vite y Vitest, utilizar las siguientes versiones exactas o compatibles:

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.13",
    "tailwindcss": "^4.1.13",
    "@vitejs/plugin-react": "^6.1.1",
    "vite": "^8.2.2",
    "vitest": "^4.1.11",
    "jsdom": "^29.1.1",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^12.1.5",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

---

## 3. Procedimiento Paso a Paso

### Paso 1: Configurar `package.json`

1. **Habilitar ES Modules:**
   Agregar en el primer nivel del `package.json`:
   ```json
   "type": "module",
   ```

2. **Remover dependencias obsoletas:**
   - Eliminar `"react-scripts"` de `"dependencies"`.
   - Si existe `"eslint-config-react-app"` en dependencias o en `"eslintConfig"`, removerlo o simplificarlo para evitar colisiones con Jest/Vite.

3. **Mover dependencias de testing a `devDependencies`:**
   Mover de `"dependencies"` a `"devDependencies"` y actualizar las versiones:
   - `"@testing-library/jest-dom": "^5.16.5"`
   - `"@testing-library/react": "^12.1.5"`
   - `"@testing-library/user-event": "^14.0.0"`

4. **Incorporar nuevas dependencias de desarrollo (`devDependencies`):**
   - `"vite": "^8.2.2"`
   - `"@vitejs/plugin-react": "^6.1.1"`
   - `"vitest": "^4.1.11"`
   - `"jsdom": "^29.1.1"`
   - `"tailwindcss": "^4.1.13"`
   - `"@tailwindcss/vite": "^4.1.13"`

5. **Actualizar scripts de ejecución:**
   Reemplazar la sección `"scripts"` por:
   ```json
   "scripts": {
     "start": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "test": "vitest"
   }
   ```
   *(Nota: Eliminar el script `"eject"` ya que es específico de CRA).*

---

### Paso 2: Crear `vite.config.js` en la Raíz del Proyecto

Crear el archivo `vite.config.js` con soporte para React, Tailwind CSS v4 y Vitest:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
```

> **Nota:** Si el proyecto no utiliza Tailwind CSS, omitir el plugin `tailwindcss` en imports y en `plugins: [react()]`.

---

### Paso 3: Renombrar Archivos de Componentes (`.js` ➔ `.jsx`)

A diferencia de Create React App, **Vite exige que cualquier archivo con sintaxis JSX tenga la extensión `.jsx`**.

1. Preservar el historial de git usando `git mv`:
   ```powershell
   git mv src/index.js src/index.jsx
   git mv src/App.js src/App.jsx
   ```
2. Renombrar cualquier otro componente dentro de `src/` o subcarpetas que contenga etiquetas JSX:
   ```powershell
   git mv src/components/MiComponente.js src/components/MiComponente.jsx
   ```
3. *(Si el repositorio no tiene Git inicializado, utilizar el comando de renombrado estándar del sistema operativo).*

---

### Paso 4: Reubicar y Adaptar `index.html`

En CRA, `index.html` reside en `public/`. En Vite, `index.html` debe residir en la raíz del proyecto.

1. **Mover el archivo a la raíz:**
   ```powershell
   git mv public/index.html ./index.html
   ```

2. **Eliminar los marcadores `%PUBLIC_URL%`:**
   En Vite los archivos estáticos en `public/` se sirven directamente desde `/`.
   - Reemplazar `%PUBLIC_URL%/favicon.ico` por `/favicon.ico`.
   - Reemplazar `%PUBLIC_URL%/manifest.json` por `/manifest.json`.
   - Reemplazar `%PUBLIC_URL%/logo192.png` por `/logo192.png`.

3. **Actualizar la meta-etiqueta de color:**
   Reemplazar la etiqueta obsoleta `<meta name="theme-color" ... />` por:
   ```html
   <meta name="color-scheme" content="light dark" />
   ```

4. **Incorporar el punto de entrada de la aplicación:**
   Justo antes de la etiqueta de cierre `</body>`, insertar:
   ```html
   <script type="module" src="/src/index.jsx"></script>
   ```

---

### Paso 5: Configurar Tailwind CSS v4

Con la versión 4 de Tailwind CSS:
1. En `src/index.css` (o el archivo CSS global del proyecto), incluir la directiva al inicio:
   ```css
   @import "tailwindcss";
   ```
2. Eliminar archivos antiguos de configuración como `tailwind.config.js` o `postcss.config.js` si existían, ya que `@tailwindcss/vite` compila directamente desde el plugin.

---

### Paso 6: Configurar Entorno de Pruebas (`setupTests.js`)

Verificar que el archivo `src/setupTests.js` contenga la importación de `@testing-library/jest-dom`:

```javascript
import "@testing-library/jest-dom";
```

---

### Paso 7: Migrar Variables de Entorno (si aplica)

Si el proyecto cuenta con archivos `.env` o consume variables de entorno:
1. Renombrar prefijos: `REACT_APP_*` ➔ `VITE_*` (ej. `REACT_APP_API_KEY` ➔ `VITE_API_KEY`).
2. Actualizar el acceso en el código fuente:
   - Antiguo: `process.env.REACT_APP_VARIABLE`
   - Vite: `import.meta.env.VITE_VARIABLE`

---

### Paso 8: Instalación y Validación

Con el entorno de FNM activo:

1. **Instalar dependencias:**
   ```powershell
   npm install
   ```

2. **Validar compilación de producción:**
   ```powershell
   npm run build
   ```
   *(Verificar que genere la carpeta `dist/` sin errores de compilación).*

3. **Validar suite de pruebas (Vitest):**
   ```powershell
   npm test -- --run
   ```

4. **Validar servidor de desarrollo:**
   ```powershell
   npm start
   ```

---

## 4. Helper Automatizado

Esta skill incluye un script de Node.js para automatizar la migración en cualquier subdirectorio o repositorio:

```powershell
fnm use 24.16.0
# Desde la raíz del monorepo:
node shared/.agents/skills/react-cra-to-vite/scripts/migrate.js <ruta-al-proyecto>
# O si te encuentras dentro del proyecto shared:
node .agents/skills/react-cra-to-vite/scripts/migrate.js <ruta-al-proyecto>
```

Parámetros opcionales:
- `--no-tailwind`: No agrega Tailwind CSS v4.
- `--dry-run`: Muestra los cambios a realizar sin modificar archivos.
