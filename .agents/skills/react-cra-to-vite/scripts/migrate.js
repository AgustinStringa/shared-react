#!/usr/bin/env node

/**
 * Migration helper script: Create React App (CRA) -> Vite + Vitest + Tailwind CSS v4
 * Part of skill: react-cra-to-vite
 * Cross-platform (Windows, macOS, Linux). Zero external dependencies.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const targetArg = args.find(a => !a.startsWith('--')) || '.';
const targetDir = path.resolve(process.cwd(), targetArg);

const withTailwind = !args.includes('--no-tailwind');
const dryRun = args.includes('--dry-run');

console.log(`\n🚀 [react-cra-to-vite] Iniciando migración a Vite...`);
console.log(`📁 Directorio objetivo: ${targetDir}`);
console.log(`🎨 Tailwind CSS v4: ${withTailwind ? 'Habilitado' : 'Deshabilitado'}`);
if (dryRun) console.log(`🔍 Modo DRY-RUN (no se aplicarán cambios en disco)\n`);

const pkgPath = path.join(targetDir, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error(`❌ Error: No se encontró package.json en ${targetDir}`);
  process.exit(1);
}

const isGitRepo = fs.existsSync(path.join(targetDir, '.git')) || (() => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: targetDir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

function safeMove(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return false;
  if (dryRun) {
    console.log(`  [DRY-RUN] Mover ${path.relative(targetDir, srcPath)} ➔ ${path.relative(targetDir, destPath)}`);
    return true;
  }
  const relSrc = path.relative(targetDir, srcPath);
  const relDest = path.relative(targetDir, destPath);

  if (isGitRepo) {
    try {
      execSync(`git mv "${relSrc}" "${relDest}"`, { cwd: targetDir, stdio: 'ignore' });
      return true;
    } catch {
      // Fallback si no está en seguimiento de git
    }
  }
  fs.renameSync(srcPath, destPath);
  return true;
}

// 1. Actualizar package.json
console.log(`\n📦 1. Actualizando package.json...`);
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.type = 'module';

pkg.scripts = pkg.scripts || {};
pkg.scripts.start = 'vite';
pkg.scripts.build = 'vite build';
pkg.scripts.preview = 'vite preview';
pkg.scripts.test = 'vitest';
delete pkg.scripts.eject;

pkg.dependencies = pkg.dependencies || {};
pkg.devDependencies = pkg.devDependencies || {};

delete pkg.dependencies['react-scripts'];

const testLibs = {
  '@testing-library/jest-dom': '^5.16.5',
  '@testing-library/react': '^12.1.5',
  '@testing-library/user-event': '^14.0.0'
};

for (const [dep, ver] of Object.entries(testLibs)) {
  delete pkg.dependencies[dep];
  pkg.devDependencies[dep] = ver;
}

pkg.devDependencies['vite'] = '^8.2.2';
pkg.devDependencies['@vitejs/plugin-react'] = '^6.1.1';
pkg.devDependencies['vitest'] = '^4.1.11';
pkg.devDependencies['jsdom'] = '^29.1.1';

if (withTailwind) {
  pkg.devDependencies['tailwindcss'] = '^4.1.13';
  pkg.devDependencies['@tailwindcss/vite'] = '^4.1.13';
}

if (pkg.eslintConfig && pkg.eslintConfig.extends) {
  // Limpiar referencias a react-app de eslint
  if (Array.isArray(pkg.eslintConfig.extends)) {
    pkg.eslintConfig.extends = pkg.eslintConfig.extends.filter(e => !e.includes('react-app'));
    if (pkg.eslintConfig.extends.length === 0) delete pkg.eslintConfig;
  }
}

if (!dryRun) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}
console.log(`  ✓ package.json actualizado con type: module, scripts y devDependencies.`);

// 2. Crear vite.config.js
console.log(`\n⚙️  2. Creando vite.config.js...`);
const viteConfigPath = path.join(targetDir, 'vite.config.js');
const viteConfigContent = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";${withTailwind ? '\nimport tailwindcss from "@tailwindcss/vite";' : ''}

export default defineConfig({
  plugins: [react()${withTailwind ? ', tailwindcss()' : ''}],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
`;

if (!dryRun) {
  fs.writeFileSync(viteConfigPath, viteConfigContent);
}
console.log(`  ✓ vite.config.js creado en la raíz.`);

// 3. Mover y modificar index.html
console.log(`\n🌐 3. Adaptando index.html...`);
const publicHtmlPath = path.join(targetDir, 'public', 'index.html');
const rootHtmlPath = path.join(targetDir, 'index.html');

if (fs.existsSync(publicHtmlPath)) {
  safeMove(publicHtmlPath, rootHtmlPath);
}

if (fs.existsSync(rootHtmlPath)) {
  let html = fs.readFileSync(rootHtmlPath, 'utf8');

  // Quitar %PUBLIC_URL%/
  html = html.replace(/%PUBLIC_URL%\/?/g, '/');

  // Reemplazar theme-color por color-scheme si existe
  if (html.includes('theme-color')) {
    html = html.replace(/<meta\s+name=["']theme-color["'][^>]*>/i, '<meta name="color-scheme" content="light dark" />');
  } else if (!html.includes('color-scheme')) {
    html = html.replace(/<meta\s+name=["']viewport["'][^>]*>/i, '$&\n    <meta name="color-scheme" content="light dark" />');
  }

  // Agregar script type="module" si no existe
  if (!html.includes('<script type="module"')) {
    const scriptTag = '    <script type="module" src="/src/index.jsx"></script>\n  </body>';
    html = html.replace(/<\/body>/i, scriptTag);
  }

  if (!dryRun) {
    fs.writeFileSync(rootHtmlPath, html);
  }
  console.log(`  ✓ index.html reubicado a la raíz y adaptado.`);
} else {
  console.warn(`  ⚠️ No se encontró index.html ni en public/ ni en la raíz.`);
}

// 4. Renombrar archivos .js a .jsx en src/
console.log(`\n🔄 4. Renombrando archivos con JSX de .js a .jsx...`);
const srcDir = path.join(targetDir, 'src');

function hasJSX(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Búsqueda simple de JSX tags ej: <Component, <div, </, etc.
    return /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>|<\/([A-Za-z][A-Za-z0-9]*)>/.test(content);
  } catch {
    return false;
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.test.js') && !entry.name.endsWith('.spec.js') && entry.name !== 'setupTests.js') {
      const fileName = entry.name;
      // Index y App siempre se renombran si son componentes
      if (fileName === 'index.js' || fileName === 'App.js' || hasJSX(fullPath)) {
        const destPath = fullPath.replace(/\.js$/, '.jsx');
        console.log(`  ➔ Renombrando: ${path.relative(targetDir, fullPath)} -> ${path.relative(targetDir, destPath)}`);
        safeMove(fullPath, destPath);
      }
    }
  }
}

processDirectory(srcDir);

// 5. Configurar Tailwind CSS v4 si está habilitado
if (withTailwind) {
  console.log(`\n🎨 5. Configurando Tailwind CSS v4...`);
  const indexCssPath = path.join(srcDir, 'index.css');
  if (fs.existsSync(indexCssPath)) {
    let css = fs.readFileSync(indexCssPath, 'utf8');
    if (!css.includes('@import "tailwindcss";')) {
      css = `@import "tailwindcss";\n` + css;
      if (!dryRun) fs.writeFileSync(indexCssPath, css);
      console.log(`  ✓ Directiva @import "tailwindcss"; añadida a src/index.css`);
    }
  }

  // Eliminar configs obsoletos de Tailwind v3
  const legacyConfigs = ['tailwind.config.js', 'postcss.config.js', 'tailwind.config.cjs'];
  for (const cfg of legacyConfigs) {
    const cfgPath = path.join(targetDir, cfg);
    if (fs.existsSync(cfgPath)) {
      if (!dryRun) fs.unlinkSync(cfgPath);
      console.log(`  ✓ Eliminado archivo de configuración obsoleto: ${cfg}`);
    }
  }
}

// 6. Asegurar setupTests.js
console.log(`\n🧪 6. Verificando setupTests.js...`);
const setupTestsPath = path.join(srcDir, 'setupTests.js');
if (fs.existsSync(setupTestsPath)) {
  let content = fs.readFileSync(setupTestsPath, 'utf8');
  if (!content.includes('@testing-library/jest-dom')) {
    content = `import "@testing-library/jest-dom";\n` + content;
    if (!dryRun) fs.writeFileSync(setupTestsPath, content);
  }
  console.log(`  ✓ src/setupTests.js verificado.`);
} else if (!dryRun) {
  fs.writeFileSync(setupTestsPath, `import "@testing-library/jest-dom";\n`);
  console.log(`  ✓ src/setupTests.js creado.`);
}

console.log(`\n✅ ¡Migración de estructura completada con éxito!`);
console.log(`\nPróximos pasos en ${targetDir}:`);
console.log(`  1. fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression`);
console.log(`  2. fnm use 24.16.0`);
console.log(`  3. cd "${targetDir}"`);
console.log(`  4. npm install`);
console.log(`  5. npm run build`);
console.log(`  6. npm test -- --run\n`);
