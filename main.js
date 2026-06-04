const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require('node:path')
const Runtime = require("./modules/main.js")
const rmSync = require("node:fs").rmSync
const rmDirSync = require("node:fs").rmdirSync
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater")
const {dialog} = require('electron');
const console = require('node:console')
const room = require("./modules/room.js")
const log = require('electron-log');
let roomServer;
let roomClient;

autoUpdater.on('error', err => {
  console.error('Update error', err)
})

autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.autoDownload = true;

let updateReady = false;

autoUpdater.on('update-downloaded', (info) => {
  updateReady = true;
  const dialogOpts = {
    type: 'info',
    title: 'Application Update',
    detail: 'A new version has been downloaded. It will be installed automatically.'
  };

  dialog.showMessageBox(dialogOpts)
});


const openFile = async (file) => {
  Runtime.addRecentNote(file)
  let details = await Runtime.tempFile(file)
  if (details) {
    createFileViewer(details.filename,details.meta.name)
  }
}

const createWindow = (startAtDashboard) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "modules", "preload.js"),
      additionalArguments: [`--fvfilepath=${isDev.default}`],
      devTools: isDev
    }
  })
  const url = startAtDashboard ? "src/dashboard.html" : "src/index.html" 
  win.loadFile(url)
  log.info("Created a new windows using url",url)
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
  log.info("Created a new file viewer window")
}

const openResult = async (uuid,location,data) => {
  const finalResult = await Runtime.getFinalTestResult(uuid,location)
   const resultView = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "modules", "result_preload.js"),
      additionalArguments: [`--result=${JSON.stringify(finalResult)}`,`--data=${JSON.stringify(data)}`],
      webSecurity: true,
      devTools: isDev
    }
  })
  log.info("Created a new result viewer window")
  resultView.loadFile('src/result.html') 
}

const closeAllWindows = () => {
  const allWindows = BrowserWindow.getAllWindows()
  allWindows.forEach((window) => {
    window.close() 
  })
}
const createRoom = (name) => {
  closeAllWindows()
  const onClose = () => createWindow(true)
  roomServer = new room.RoomServer(Runtime.sessionID,name,504,onClose)
}
const connectToRoom = (data) => {
  if (!data || !data.addr) {return}
  const clientIps = room.getLocalIPAddresses()
  clientIps.forEach((a,b,c) => c[b] = a.slice(0,a.lastIndexOf(".")))
  let selectedIp = false
  data.addr.forEach(ip => {
    clientIps.forEach(client => {
      if (selectedIp && (ip === "::1" || ip === "127.0.0.1")) {return}
      if (ip.startsWith(client)) { selectedIp = ip }
    })
  })
  if (!selectedIp) {return}
  log.info("Connecting to a room server:",selectedIp)
  closeAllWindows()
  const onClose = () => createWindow(true)
  roomClient = new room.RoomClient(Runtime.sessionID,selectedIp,504,onClose)
}
let mainApp;
let reporter;
if (!isDev) {
  Menu.setApplicationMenu(null)
}
app.whenReady().then(() => {
  log.info("App is Ready")
  mainApp = createWindow()
  setTimeout(() => createWindow(true), 10000)
  reporter = (status,report) => mainApp.webContents.send(status,report),
  ipcMain.handle('Runtime Init', () => Runtime.Initialization(reporter)),
  ipcMain.handle('Runtime Login', async (event, username, password) => Runtime.freshLogin(username, password)),
  ipcMain.handle('Runtime Create Account', async (event, message) => Runtime.newAccount(message)),
  ipcMain.handle('Runtime New Session', async () => Runtime.getSession()),
  ipcMain.handle('Runtime Logout', async () => Runtime.logout()),
  ipcMain.handle('Runtime Server Status', async (event,mode) => Runtime.serverStatus(mode)),
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
  ipcMain.handle('Get Bank Details', async () => Runtime.getBankDetailsData()),
  ipcMain.handle('Test Access', async () => Runtime.getTestAccessData()),
  ipcMain.handle('Test Info', async (event, type,uuid) => Runtime.getTestInfoData(type,uuid)),
  ipcMain.handle('Add Test Question', async (event, uuid,data) => Runtime.addNewTestData(uuid,data)),
  ipcMain.handle('Get Test Questions', async (event, uuid,location) => Runtime.getTestQuestions(uuid,location)),
  ipcMain.handle('Send Test Results', async (event, uuid,section,subsection,question,answer,testlocation) => Runtime.sendTestResult(uuid,section,subsection,question,answer,testlocation)),
  ipcMain.handle('Finish Test', async (event, uuid,location) => Runtime.finishTest(uuid,location)),
  ipcMain.handle('Get Test Details', async (event, uuid,location) => Runtime.getTestDetails(uuid,location)),
  ipcMain.handle('Test Variable', async (event, action,uuid,name,content,location) => Runtime.TestVariable(action,uuid,name,content,location)),
  ipcMain.handle('System Lock', async (event) => setLock(event.sender)),
  ipcMain.handle('System Unlock', async (event) => removeLock()),
  ipcMain.handle('App Version', async (event) => app.getVersion()),
  ipcMain.handle('Get Changelog', async (event) => Runtime.getChangelog(app.getVersion())),
  ipcMain.handle('Test Mode', async (event,newmode) => Runtime.SetTestMode(newmode)),
  ipcMain.handle('Test Generate', async (event,uuid,no,list,type,duration) => Runtime.generateNewTest(uuid,no,list,type,duration)),
  ipcMain.handle('Offline Tests', async () => Runtime.getOfflineTests()),
  ipcMain.handle('Test Final Results', async (event,uuid,location,data) =>  openResult(uuid,location,data)),
  ipcMain.handle('Media Library', async () =>  Runtime.getLibraryData())
  ipcMain.handle('Media Video', async (event,id) =>  Runtime.convertToVideoURL(id))
  ipcMain.handle('Media Image', async (event,id) =>  Runtime.convertToImageURL(id))
  ipcMain.handle('Rooms Available', async () =>  Runtime.getAvailableRoom())
  ipcMain.handle('Runtime Create Room', async (evt,name) =>  createRoom(name))
  ipcMain.handle('Rooms Join', async (evt,data) =>  connectToRoom(data))
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

let isUpdating = false;

app.on('window-all-closed', () => {
  if (updateReady) {
    isUpdating = true;
    // silent: false (show installer UI), isForceRunAfter: true (run app after finish)
    autoUpdater.quitAndInstall(false, true); 
  } else {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
});

app.on('before-quit', (e) => {
  if (updateReady && !isUpdating) {
    // This handles cases where the user selects "Quit" from a menu 
    // instead of just closing the last window.
    isUpdating = true;
    BrowserWindow.getAllWindows().forEach(w => w.destroy());
    autoUpdater.quitAndInstall(false, true);
  }
});

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 1000 * 60 * 60); // Check every hour
