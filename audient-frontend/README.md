# audient-frontend

Vite + Electron frontend for the **Audient** workshop application.

## Requirements

- Node.js ≥ 20  
- npm ≥ 10

## Setup

```bash
npm install
```

## Running the App

### Browser mode (Vite dev server only)

```bash
npm run dev
```

Open <http://localhost:5173>.  
You should see in the terminal:

```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Use the **"Chrome: Debug Frontend"** launch configuration to attach a Chrome
debugger to this URL.

### Electron mode (development)

```bash
npm run electron:dev
```

This starts Electron loading the Vite dev server URL (`http://localhost:5173`).  
Use the **"Electron: Debug Main Process"** launch configuration to debug
`electron/main.cjs`.

### Production build

```bash
npm run build
npm run electron
```

## Project Structure

```
audient-frontend/
├── electron/
│   └── main.cjs       ← Electron main process (Node.js/CommonJS)
├── src/
│   ├── main.js        ← Renderer entry point (browser / Vite)
│   └── style.css
├── index.html
├── vite.config.js
└── package.json
```
