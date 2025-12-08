import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
//import icon from '../../resources/icon.png?asset'
import icon from '../../src/renderer/src/assets/logos/MyVault-Logo.png?asset'
import { initDB, addEntry, getAllEntries, deleteEntry, hasMasterAccount, createMasterAccount, getMasterAuthData, getMasterUsername } from './database' // Asegúrate de importar deleteEntry
import { AuthService } from './auth'
import { CryptoService } from './crypto'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    //...(process.platform === 'linux' ? { icon } : {}),
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  ipcMain.on('window:minimize', () => mainWindow.minimize())
  ipcMain.on('window:maximize', () => mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize())
  ipcMain.on('window:close', () => mainWindow.close())

  mainWindow.on('ready-to-show', () => mainWindow.show())

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

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  initDB()
  
  // AUTH
  ipcMain.handle('auth:check-status', () => AuthService.isAppConfigured())
  ipcMain.handle('auth:create-master', (_, { username, password }) => AuthService.register(username, password))
  ipcMain.handle('auth:login', (_, { password }) => AuthService.login(password))

  // VAULT
  ipcMain.handle('vault:add-entry', (_, data) => {
    try {
      const masterKey = AuthService.getSessionKey()
      const cryptoResult = CryptoService.encrypt(data.password, masterKey)
      
      return addEntry({
        service_name: data.service,
        service_id: data.service_id || 'custom',
        email: data.email,
        username: data.username,
        encrypted_password: cryptoResult.content,
        iv: cryptoResult.iv,
        auth_tag: cryptoResult.tag,
        category: data.category || 'all',
        website_url: data.url
      })
    } catch (error) {
      console.error("Error al guardar:", error)
      throw error
    }
  })

  ipcMain.handle('vault:get-all', () => {
    try {
      const masterKey = AuthService.getSessionKey()
      const entries = getAllEntries()
      return entries.map((entry: any) => {
        try {
          const decryptedPass = CryptoService.decrypt(entry.encrypted_password, entry.iv, entry.auth_tag, masterKey)
          return { ...entry, password: decryptedPass }
        } catch (e) {
          return { ...entry, password: "ERROR_DECRYPTION" }
        }
      })
    } catch (error) {
      return []
    }
  })

  // NUEVO CANAL: ELIMINAR
  ipcMain.handle('vault:delete-entry', (_, id) => {
    return deleteEntry(id)
  })

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