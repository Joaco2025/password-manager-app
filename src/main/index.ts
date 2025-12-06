import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// IMPORTAMOS LAS NUEVAS FUNCIONES DE LA BASE DE DATOS
import { 
  initDB, 
  hasMasterAccount, 
  createMasterAccount, 
  getMasterAuthData, 
  addEntry, 
  getAllEntries 
} from './database'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // === LISTENERS DE VENTANA (MINIMIZAR, CERRAR) ===
  
  ipcMain.on('window:minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('window:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    mainWindow.close()
  })

  // === CONFIGURACIÓN STANDARD ===

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// === INICIALIZACIÓN DE LA APP ===

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // A. INICIALIZAR LA BD AL ARRANCAR
  initDB()
  console.log("Base de datos MyVault inicializada")

  // B. CANALES DE AUTENTICACIÓN (LOGIN/REGISTRO)
  ipcMain.handle('auth:check-status', () => hasMasterAccount())
  ipcMain.handle('auth:create-master', (_, { hash, salt }) => createMasterAccount(hash, salt))
  ipcMain.handle('auth:get-login-data', () => getMasterAuthData())

  // C. CANALES DE LA BÓVEDA (ENTRADAS)
  ipcMain.handle('vault:add-entry', (_, data) => addEntry(data))
  ipcMain.handle('vault:get-all', () => getAllEntries())


  // Optimizaciones y atajos
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})