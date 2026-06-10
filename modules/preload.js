const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('runtime', {
  type: () => "node",
  init: () => ipcRenderer.invoke('Runtime Init'),
  login: (username,password) => ipcRenderer.invoke('Runtime Login',username,password),
  createNewAccount: (message) => ipcRenderer.invoke('Runtime Create Account',message),
  newSession: () => ipcRenderer.invoke('Runtime New Session'),
  logout: () => ipcRenderer.invoke('Runtime Logout'),
  serverOnline: (mode) => ipcRenderer.invoke('Runtime Server Status',mode),
  onDownloadComplete: (callback) => ipcRenderer.on('note-download-complete', 
    (_event,details) => callback(details))
})

contextBridge.exposeInMainWorld('server', {
  serverUserInfo: () => ipcRenderer.invoke('Server User Info'),
  serverNotesInfo: (classes,term) => ipcRenderer.invoke('Server Notes Info',classes,term),
  serverMonitorData: () => ipcRenderer.invoke("Server Monitor Data"),
  publicConfig: (data) => ipcRenderer.invoke('Public Server Data Config',data),
  getAppChangelog: () => ipcRenderer.invoke('Get Changelog')
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
  requestUnlock: () => ipcRenderer.invoke("System Unlock"),
  appVersion: () => ipcRenderer.invoke("App Version"),
  engageLockdown: () => ipcRenderer.invoke("Engage Lockdown"),
  unlockLockdown: (pin) => ipcRenderer.invoke("Unlock Lockdown",pin),
  stateOfLockdown: () => ipcRenderer.invoke("State of Lockdown"),
})

contextBridge.exposeInMainWorld('test', {
  names: (type) => ipcRenderer.invoke("Test Names",type),
  access: () => ipcRenderer.invoke("Test Access"),
  bankDetails: () => ipcRenderer.invoke("Get Bank Details"),
  info: (type,uuid) => ipcRenderer.invoke("Test Info",type,uuid),
  add: (uuid,data) => ipcRenderer.invoke("Add Test Question",uuid,data),
  remove: (uuid,id) => ipcRenderer.invoke("Remove Test Question",uuid,id),
  replace: (uuid,no,data) => ipcRenderer.invoke("Replace Test Question",uuid,no,data),
  questions: (uuid,location) => ipcRenderer.invoke("Get Test Questions",uuid,location),
  results: (uuid,section,subsection,question,answer,testlocation) => 
    ipcRenderer.invoke("Send Test Results",uuid,section,subsection,question,answer,testlocation),
  submit: (uuid,location) => ipcRenderer.invoke("Finish Test",uuid,location),
  details: (uuid,location) => ipcRenderer.invoke("Get Test Details",uuid,location),
  variable: (action,uuid,name,content,location) => ipcRenderer.invoke("Test Variable",action,uuid,name,content,location),
  mode: (newmode) => ipcRenderer.invoke("Test Mode",newmode),
  generate: (uuid,no,list,type,duration) => ipcRenderer.invoke("Test Generate",uuid,no,list,type,duration),
  offline: () => ipcRenderer.invoke("Offline Tests"),
  displayResult: (uuid,location,data)  => ipcRenderer.invoke("Test Final Results",uuid,location,data),
  getBankQuestions: (uuid,location)  => ipcRenderer.invoke("Test Bank Questions",uuid,location)
})

contextBridge.exposeInMainWorld('media', {
  library: () => ipcRenderer.invoke("Media Library"),
  toVideoURL: (id) => ipcRenderer.invoke("Media Video",id),
  toImageURL: (id) => ipcRenderer.invoke("Media Image",id),
  toPDFURL: (id) => ipcRenderer.invoke("Media PDF",id)
})

contextBridge.exposeInMainWorld("room", {
  available: () => ipcRenderer.invoke("Rooms Available"),
  createRoom: (name) => ipcRenderer.invoke('Runtime Create Room',name),
  connectToRoom: (data) => ipcRenderer.invoke("Rooms Join",data)
})