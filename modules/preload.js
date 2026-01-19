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
  serverMonitorData: () => ipcRenderer.invoke("Server Monitor Data"),
  publicConfig: (data) => ipcRenderer.invoke('Public Server Data Config',data)
})

contextBridge.exposeInMainWorld('fs', {
  notes: () => ipcRenderer.invoke('School Notes'),
  banks: () => ipcRenderer.invoke('School Banks'),
  download: (file) => ipcRenderer.invoke("Download Files",file),
  open: (file) => ipcRenderer.invoke("Open File",file),
  recents: () => ipcRenderer.invoke("System Recents Note")
})

contextBridge.exposeInMainWorld('sys', {
  fullscreen: (bol) => ipcRenderer.invoke("System Fullscreen",bol),
  requestLock: () => ipcRenderer.invoke("System Lock"),
  requestUnlock: () => ipcRenderer.invoke("System Unlock")
})

contextBridge.exposeInMainWorld('test', {
  names: (type) => ipcRenderer.invoke("Test Names",type),
  access: () => ipcRenderer.invoke("Test Access"),
  info: (type,uuid) => ipcRenderer.invoke("Test Info",type,uuid),
  add: (uuid,data) => ipcRenderer.invoke("Add Test Question",uuid,data),
  questions: (uuid,location) => ipcRenderer.invoke("Get Test Questions",uuid,location),
  results: (uuid,section,subsection,question,answer) => 
    ipcRenderer.invoke("Send Test Results",uuid,section,subsection,question,answer),
  submit: (uuid) => ipcRenderer.invoke("Finish Test",uuid),
  details: (uuid,location) => ipcRenderer.invoke("Get Test Details",uuid,location),
  variable: (action,uuid,name,content) => ipcRenderer.invoke("Test Variable",action,uuid,name,content)
})