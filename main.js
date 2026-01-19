const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require('node:path')
const Runtime = require("./modules/main")
const rmSync = require("node:fs").rmSync
const rmDirSync = require("node:fs").rmdirSync
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater")
const {dialog} = require('electron');

autoUpdater.on('error', err => {
  console.error('Update error', err)
})

autoUpdater.on('update-downloaded', (info) => {
  const dialogOpts = {
    type: 'info',
    title: 'Application Update',
    detail: 'A new version has been downloaded. It will be installed automatically.'
  };

  dialog.showMessageBox(dialogOpts)
});

autoUpdater.autoInstallOnAppQuit = true


const openFile = async (file) => {
  Runtime.addRecentNote(file)
  let details = await Runtime.tempFile(file)
  if (details) {
    createFileViewer(details.filename,details.meta.name)
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "modules", "preload.js"),
      additionalArguments: [`--fvfilepath=${isDev.default}`],
      devTools: isDev
    }
  })
  win.loadFile('src/index.html')
  return win
}

const createFileViewer = (filepath,filename) => {
  const fv = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "modules", "fvpreload.js"),
      additionalArguments: [`--fvfilepath=${filepath}`,`--fvfilename=${filename}`],
      webSecurity: true,
      devTools: isDev
    }
  })
  fv.loadFile('src/fileviewer.html')
  fv.filepath = filepath
  fv.on("closed",() => {
    const folder = filepath.slice(0,(filepath.length-4))
    rmSync(filepath)
    rmDirSync(folder)
  })
}

let mainApp;
let reporter;
if (!isDev) {
  Menu.setApplicationMenu(null)
}
app.whenReady().then(() => {
  mainApp = createWindow(),
  reporter = (status,report) => mainApp.webContents.send(status,report),
  ipcMain.handle('Runtime Init', () => Runtime.Initialization(reporter)),
  ipcMain.handle('Runtime Login', async (event, username, password) => Runtime.freshLogin(username, password)),
  ipcMain.handle('Runtime Create Account', async (event, message) => Runtime.newAccount(message)),
  ipcMain.handle('Runtime New Session', async () => Runtime.getSession()),
  ipcMain.handle('Runtime Logout', async () => Runtime.logout()),
  ipcMain.handle('Runtime Server Status', async () => Runtime.serverStatus()),
  ipcMain.handle('Server User Info', async () => Runtime.getServerInfo("User Info")),
  ipcMain.handle('Server Notes Info', async (event, classes, term) => Runtime.getOnlineNotes(classes, term)),
  ipcMain.handle('School Notes', async () => Runtime.getOfflineNotes()),
  ipcMain.handle('School Banks', async () => Runtime.getOfflineBanks()),
  ipcMain.handle('Download Files', async (event, file) => Runtime.addDownload(file)),
  ipcMain.handle('Open File', async (event, file) => openFile(file)),
  ipcMain.handle('Server Monitor Data', async () => Runtime.getMonitorNotes()),
  ipcMain.handle('System Recents Note', async () => Runtime.getRecentNotes()),
  ipcMain.handle('System Fullscreen', async (event,bol) => mainApp.setFullScreen(bol)),
  ipcMain.handle('Test Names', async (event,type) => Runtime.getTestNameData(type)),
  ipcMain.handle('Public Server Data Config', async (event,data) => Runtime.getPublicConfigData(data)),
  ipcMain.handle('Test Access', async () => Runtime.getTestAccessData()),
  ipcMain.handle('Test Info', async (event, type,uuid) => Runtime.getTestInfoData(type,uuid)),
  ipcMain.handle('Add Test Question', async (event, uuid,data) => Runtime.addNewTestData(uuid,data)),
  ipcMain.handle('Get Test Questions', async (event, uuid,location) => Runtime.getTestQuestions(uuid,location)),
  ipcMain.handle('Send Test Results', async (event, uuid,section,subsection,question,answer) => Runtime.sendTestResult(uuid,section,subsection,question,answer)),
  ipcMain.handle('Finish Test', async (event, uuid,location) => Runtime.finishTest(uuid,location)),
  ipcMain.handle('Get Test Details', async (event, uuid,location) => Runtime.getTestDetails(uuid,location)),
  ipcMain.handle('Test Variable', async (event, action,uuid,name,content) => Runtime.TestVariable(action,uuid,name,content)),
  ipcMain.handle('System Lock', async (event) => setLock(event.sender)),
  ipcMain.handle('System Unlock', async (event) => removeLock()),
  autoUpdater.checkForUpdates()
})

let isLocked = false
let lockTarget = false

const setLock = (content) => {
  if (isLocked) {return false}
  const window = BrowserWindow.fromWebContents(content)
  isLocked =  true
  lockTarget = content
  window.setAlwaysOnTop(true)
  window.on("blur", () => {
    if (!isLocked || lockTarget !== content) {return false}
    console.log("Refocused")
    window.maximize()
    window.focus()
    
  })
  return true
}

const removeLock = () => {
  if (!isLocked) {return false}
  const window = BrowserWindow.fromWebContents(lockTarget)
  lockTarget = undefined
  isLocked = false
  window.setAlwaysOnTop(false)
  return true
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
