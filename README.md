# Librería Compartida (`shared`)

Librería transversal de componentes, utilidades, servicios y herramientas de automatización para los proyectos de React en el repositorio.

---

## 📁 Estructura del Proyecto

```text
shared/
├── src/
│   ├── api/
│   │   └── httpClient.js         # Cliente HTTP genérico y desacoplado
│   ├── components/               # Componentes UI reutilizables (Spinner, Header, Footer...)
│   ├── context/                  # Contextos de React compartidos (LoadingContext...)
│   ├── services/                 # Servicios transversales (localStorageService...)
│   ├── utils/                    # Utilidades de uso general (dateUtils...)
│   └── index.js                  # Punto de exportación de la librería
│
├── .agents/                      # Automatizaciones, Skills y Workflows de Agentes de IA
│   ├── skills/
│   │   └── react-cra-to-vite/    # Skill: Migración de CRA a Vite + Vitest + Tailwind v4
│   │       ├── SKILL.md
│   │       ├── scripts/
│   │       └── templates/
│   └── workflows/
│       └── setup-api/            # Workflow Template: Configuración de API y Ambientes
│           ├── WORKFLOW.md
│           └── templates/        # Plantillas de .env.* y env.config.js
│
├── package.json
└── index.js                      # Punto de entrada principal
```

---

## 🛠️ Herramientas de IA y Automatización (`.agents/`)

### 1. Workflow Template: `setup-api`
- **Ubicación:** [`.agents/workflows/setup-api/WORKFLOW.md`](file:///.agents/workflows/setup-api/WORKFLOW.md)
- **Uso:** Procedimiento para parametrizar variables de entorno (local/dev/prd), configurar scripts en `package.json` y conectar un frontend con el cliente HTTP de `shared`.

### 2. Skill: `react-cra-to-vite`
- **Ubicación:** [`.agents/skills/react-cra-to-vite/SKILL.md`](file:///.agents/skills/react-cra-to-vite/SKILL.md)
- **Uso:** Migración estándar de proyectos antiguos creados con `create-react-app` hacia Vite, Vitest y Tailwind CSS v4.
- **Helper automatizado:**
  ```powershell
  fnm use 24.16.0
  node shared/.agents/skills/react-cra-to-vite/scripts/migrate.js <ruta-al-proyecto>
  ```
