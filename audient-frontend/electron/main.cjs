/**
 * Audient Frontend – Electron main process.
 *
 * Workshop: Multi-Stack Debug Mastery (PyConf 2026)
 *
 * This file uses CommonJS syntax (.cjs) because Electron's main process does
 * not yet support ES Modules natively.
 *
 * During development the renderer loads the Vite dev server URL so that Hot
 * Module Replacement (HMR) works.  In production it loads the built index.html.
 *
 * Debug this file using the "Electron: Debug Main Process" launch configuration.
 */

'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

/**
 * Create the main application window.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Keep nodeIntegration disabled for security – the renderer is a
      // standard web page that talks to FastAPI via /api proxied by Vite.
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    // Development: load from Vite dev server so HMR works.
    // ← Set a breakpoint here during the Electron debugging exercise!
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // Production: load the built index.html.
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked and no windows are open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Quit the app on all platforms except macOS.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
