const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('runtime', {
  type: () => "node",
  init: () => ipcRenderer.invoke('Runtime Init'),
  login: (username,password) => ipcRenderer.invoke('Runtime Login',username,password),
  createNewAccount: (message) => ipcRenderer.invoke('Runtime Create Account',message),
  newSession: () => ipcRenderer.invoke('Runtime New Session'),
  logout: () => ipcRenderer.invoke('Runtime Logout'),
  serverOnline: () => ipcRenderer.invoke('Runtime Server Status'),
  onDownloadComplete: (callback) => ipcRenderer.on('note-download-complete', 
    (_event,details) => callback(details))
})

contextBridge.exposeInMainWorld('server', {
  serverUserInfo: () => ipcRenderer.invoke('Server User Info'),
  serverNotesInfo: (classes,term) => ipcRenderer.invoke('Server Notes Info',classes,term),
  serverMonitorData: () => ipcRenderer.invoke("Server Monitor Data")
})

contextBridge.exposeInMainWorld('fs', {
  notes: () => ipcRenderer.invoke('School Notes'),
  download: (file) => ipcRenderer.invoke("Download Files",file),
  open: (file) => ipcRenderer.invoke("Open File",file),
  recents: () => ipcRenderer.invoke("System Recents Note")
})
