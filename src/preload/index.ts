import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  checkHasAccount: () => ipcRenderer.invoke('auth:check-status'),
  createMaster: (data: any) => ipcRenderer.invoke('auth:create-master', data),
  login: (password: string) => ipcRenderer.invoke('auth:login', { password }),

  addEntry: (data: any) => ipcRenderer.invoke('vault:add-entry', data),
  getEntries: () => ipcRenderer.invoke('vault:get-all'),
  
  // NUEVO
  deleteEntry: (id: number) => ipcRenderer.invoke('vault:delete-entry', id)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}