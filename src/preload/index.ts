import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // === CONTROLES DE VENTANA ===
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  // === AUTENTICACIÓN (LOGIN) ===
  checkHasAccount: () => ipcRenderer.invoke('auth:check-status'),
  createMaster: (data: {hash: string, salt: string}) => ipcRenderer.invoke('auth:create-master', data),
  getLoginData: () => ipcRenderer.invoke('auth:get-login-data'),

  // === BÓVEDA (DATOS) ===
  addEntry: (data: any) => ipcRenderer.invoke('vault:add-entry', data),
  getEntries: () => ipcRenderer.invoke('vault:get-all')
}

// Exponer APIs al mundo
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}