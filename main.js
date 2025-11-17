const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const Runtime = require("./modules/main")
const rmSync = require("node:fs").rmSync
const rmDirSync = require("node:fs").rmdirSync
const isDev = require("electron-is-dev");


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
  ipcMain.handle('Server Notes Info', async (event, classes) => Runtime.getOnlineNotes(classes)),
  ipcMain.handle('School Notes', async () => Runtime.getOfflineNotes()),
  ipcMain.handle('Download Files', async (event, file) => Runtime.addDownload(file)),
  ipcMain.handle('Open File', async (event, file) => openFile(file)),
  ipcMain.handle('Server Monitor Data', async () => Runtime.getMonitorNotes()),
  ipcMain.handle('System Recents Note', async () => Runtime.getRecentNotes())
})

