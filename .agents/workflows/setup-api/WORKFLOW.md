---
description: Template workflow creado para adaptar proyectos frontend a backend propio
---

# Workflow Template: Configuración de Comunicación API en Proyectos React

> **Comando de invocación sugerido:** `/setup-api <nombre-proyecto> [ruta-backend]`  
> **Ubicación:** `shared/.agents/workflows/setup-api/WORKFLOW.md`

Este workflow estandariza y automatiza la configuración de comunicación HTTP y ambientes (local, dev, prd, test) en cualquier proyecto frontend React del monorepo, conectándolo a la librería compartida `shared`.

---

## 1. Parámetros de Entrada

| Parámetro | Requerido | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `<nombre-proyecto>` | **Sí** | Carpeta del proyecto frontend dentro de `proyectos-react` | `Cotizador` |
| `[ruta-backend]` | No | Ruta al backend de referencia para inferir endpoints | `cotizador-seguros-backend` |

---

## 2. Recursos y Templates Disponibles

Este workflow utiliza las plantillas ubicadas en:
`shared/.agents/workflows/setup-api/templates/`

- `env.dev.template` -> `.<proyecto>/.env.dev` (o `env.local.template` -> `.env.local` para overrides locales)
- `env.development.template` -> `.<proyecto>/.env.development`
- `env.production.template` -> `.<proyecto>/.env.production`
- `env.test.template` -> `.<proyecto>/.env.test`
- `env.config.js.template` -> `.<proyecto>/src/config/env.config.js`
- Cliente HTTP base en `shared`: `shared/src/api/httpClient.js`

---

## 3. Checklist de Ejecución Paso a Paso

El agente o desarrollador debe ejecutar las siguientes fases en orden estricto:

### Fase 1: Variables de Entorno Multi-Ambiente
1. [ ] Crear en la raíz de `<nombre-proyecto>` los archivos de entorno:
   - `.env.dev` con `VITE_API_BASE_URL=http://localhost:3000/api` y `VITE_APP_ENV=local`. *(Nota: En Vite, el nombre de modo `local` está reservado para sufijos de sobreescritura privada `.env.*.local`, por lo que se utiliza el modo `dev`).*
   - `.env.development` con `VITE_API_BASE_URL=https://dev-api.tudominio.com/api` y `VITE_APP_ENV=development`.
   - `.env.production` con `VITE_API_BASE_URL=https://api.tudominio.com/api` y `VITE_APP_ENV=production`.
   - `.env.test` con `VITE_API_BASE_URL=http://mock-api.local/api` y `VITE_APP_ENV=test`.
2. [ ] Verificar que `<nombre-proyecto>/.gitignore` incluya la regla `*.local` para prevenir la filtración de secretos.

### Fase 2: Configuración de Scripts en `package.json`
1. [ ] En `<nombre-proyecto>/package.json`, agregar o actualizar los scripts para soportar modos de Vite:
   ```json
   "scripts": {
     "start": "vite --mode dev",
     "dev:local": "vite --mode dev",
     "dev:remote": "vite --mode development",
     "build:dev": "vite build --mode development",
     "build:prd": "vite build --mode production",
     "preview": "vite preview",
     "test": "vitest",
     "test:ci": "vitest run --mode test"
   }
   ```

### Fase 3: Capa de Configuración Centralizada
1. [ ] Crear el directorio `<nombre-proyecto>/src/config/` si no existe.
2. [ ] Copiar y adaptar `env.config.js.template` en `<nombre-proyecto>/src/config/env.config.js`.

### Fase 4: Integración con la Librería `shared`
1. [ ] Crear el directorio `<nombre-proyecto>/src/services/api/`.
2. [ ] Crear `<nombre-proyecto>/src/services/api/client.js` instanciando `HttpClient` de `shared`:
   ```javascript
   import { HttpClient } from '../../../../shared/src/index.js'; // O alias configurado
   import { ENV } from '../../config/env.config.js';

   export const apiClient = new HttpClient({
     baseUrl: ENV.API_BASE_URL,
     getHeaders: () => {
       // Headers opcionales o tokens dinámicos
       return {};
     },
     onError: (error, context) => {
       console.error(`[API Error] ${context.endpoint}`, error);
     }
   });
   ```

### Fase 5: Capa de Servicios de Dominio
1. [ ] Si se especificó `[ruta-backend]`, inspeccionar los controladores/rutas correspondientes (ej. `*.controller.ts`).
2. [ ] Crear `<nombre-proyecto>/src/services/<modulo>.service.js` con métodos puros asíncronos que usen `apiClient`.
   *(Ejemplo: `obtenerTodos()`, `obtenerPorCodigo(codigo)`, etc.).*

### Fase 6: Capa de Adaptación en React (Hooks)
1. [ ] Crear el directorio `<nombre-proyecto>/src/hooks/`.
2. [ ] Crear `<nombre-proyecto>/src/hooks/use<Modulo>.js` exponiendo:
   - `data` / entidad
   - `loading` (boolean)
   - `error` (string | null)
   - `refetch` (función)

### Fase 7: Validación de Calidad
1. [ ] Asegurar entorno Node activo con FNM:
   ```powershell
   fnm use 24.16.0
   ```
2. [ ] Validar compilación en modo local y modo producción:
   ```powershell
   npm --prefix <nombre-proyecto> run build
   npm --prefix <nombre-proyecto> run build:prd
   ```
3. [ ] Validar ejecución de tests con el modo test:
   ```powershell
   npm --prefix <nombre-proyecto> run test:ci
   ```

---

## 4. Definición de Hecho (Definition of Done)
- [ ] No existen URLs o credenciales quemadas en el código (`hardcoded`).
- [ ] El build local y de producción (`npm run build:prd`) compila sin errores de Vite.
- [ ] Los tests corren en modo aislado sin llamar a endpoints remotos en producción.
- [ ] La UI queda desacoplada de la capa de transporte HTTP.
