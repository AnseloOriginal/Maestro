import { Server } from "socket.io"
import io from "socket.io-client";
import os from'os';
import { v4 as uuidv4 } from "uuid";
import * as server from "./server.js"
import * as Runtime from "./main.js"
import { app, BrowserWindow, ipcMain, Menu, screen} from 'electron/main'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import * as log from "electron-log"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getLocalIPAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv6") {continue}
      addresses.push(iface.address);
    }
  }
  return addresses;
}

const createControlWindow = (isClient=false) => {
  const win = new BrowserWindow({
    width: 400,
    height: 150,
    maximizable: false,
    minimizable: false,
    resizable: false,
    titleBarStyle: "hiddenInset",
    titleBarOverlay: true,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    title: "Room Control",
    webPreferences: {
      preload: path.join(__dirname,"roompreload.js"),
      additionalArguments: [`--roomisclient=${isClient}`]
    }
})
  
  win.loadFile(`src/room/control.html`)
  return win
}

const createResourecWindow = (resType,resID) => {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    title: "Resource Window",
    webPreferences: {
      preload: path.join(__dirname,"roompreload.js"),
      additionalArguments: [`--resid=${resID}`,`--restype=${resType}`]
    }
})
  
  win.loadFile(`src/room/resource.html`)
  return win
}

export class RoomServer {
  userList = new Map()
  userInfo = new Map()
  actualUsers = new Map()
  allWindows = new Map()

  constructor(sid,name="Default Room",port=2026,onclose) {
    this.name = name;
    this.onclose = onclose
    this.io = new Server(port);
    console.log("Server Started on port "+port)
    this.controlWindow = createControlWindow(true)
    const primaryDisplay = screen.getPrimaryDisplay()
    
    this.screenSize = primaryDisplay.size
    // The constructor ONLY kicks off the listeners
    this.initializeListeners();
    
    // External registration
    const addr = getLocalIPAddresses();
    this.sid = sid
    server.registerRoom(sid, name, addr, port).then(response => {
      console.log(response)
    })
    
    
  }

  initializeListeners() {
    ipcMain.handle('room-new-window', (evt,type,resid) => this.newWindow(type,resid)),
    ipcMain.handle('room-media-video', async (event,id) =>  Runtime.convertToVideoURL(id))
    ipcMain.handle('room-media-image', async (event,id) =>  Runtime.convertToImageURL(id))
    console.log("Server Initialized")
    this.io.on("connection", (socket) => this.handleConnection(socket));
    this.controlWindow.on("closed", () => this.endProcess(true))
    screen.on('display-metrics-changed', () => {
      const primaryDisplay = screen.getPrimaryDisplay();
      this.screenSize = primaryDisplay.size; // Update your variable
    console.log("Sever: Screen resolution updated for LAN sync");
    });
  }

  // Handle the initial handshake
  handleConnection = (socket) => {
    const userUUID = uuidv4();
    this.userList.set(userUUID, socket);
    
    console.log(`Server: Assigned ${userUUID}`);
    socket.emit("assign-id", userUUID);

    // Setup sub-listeners for THIS specific socket
    socket.on("id-info", this.handleIdInfo);
    socket.on("disconnect", () => this.handleDisconnect(userUUID));
  }

  // Actual logic moved to dedicated methods
  handleIdInfo = async (userUUID, userSession) => {
    console.log(`Server: Processing session ${userSession} for user uuid ${userUUID}`);
    const data = await server.fetchPrivateData(userSession);
    if (data) this.userInfo.set(userUUID, data);
  }

  handleDisconnect = (userUUID) => {
    console.log(`Server: Cleanup for ${userUUID}`);
    this.userList.delete(userUUID);
    this.userInfo.delete(userUUID);
  }

  endProcess = (controlClosed) => {
    this.io.close()
    ipcMain.removeHandler("room-new-window")
    ipcMain.removeHandler("room-media-video")
    ipcMain.removeHandler("room-media-image")
    console.log("Server Ended")
    server.removeRegisteredRoom(this.sid,this.name)
    if (!controlClosed) {this.controlWindow.close()}
    if (typeof(this.onclose) === "function") {this.onclose()}
  }

  newWindow = (type,resID) => {
    console.log(`Server: Creating a new window (Type: ${type}, ResID: ${resID})`)
    const window = createResourecWindow(type,resID)
    const id = uuidv4()
    this.allWindows.set(id,window)
    this.io.emit("new-window",id,type,resID)
    window.on("maximize", () => this.io.emit("window-change",id,"maximize"))
    window.on("minimize", () => this.io.emit("window-change",id,"minimize"))
    window.on("move", (evt) => this.io.emit("window-change",id,"newbound",
      window.getBounds(),this.screenSize))
    window.on("resize", () => this.io.emit("window-change",id,"newbound",
      window.getBounds(),this.screenSize))
    window.on("close", () => {
      console.log("Server: Closing a window. ID:",id)
      this.io.emit("window-close",id)
      this.allWindows.delete(id)
    })
  }

}

export class RoomClient {
  userUUID = ""
  allWindows = new Map()
  exited = false

  constructor(sid,url,port=2026,onclose) {
    this.io = io(`http://${url}:${port}`);
    this.controlWindow = createControlWindow(false)
    this.sid = sid
    this.initializeListeners()
  }

  initializeListeners() {
    this.controlWindow.on("close", () => this.handleExit(true))
    this.io.on("assign-id", this.handleUserID)
    this.io.on("new-window",this.handleNewWindow)
    this.io.on("window-change",this.handleWindowChange)
    this.io.on("window-close",this.handleWindowClose)
    try {
      ipcMain.handle('room-new-window', (evt,type,resid) => () => console.log("Client: Creating new windows not allowed")),
      ipcMain.handle('room-media-video', async (event,id) =>  Runtime.convertToVideoURL(id))
      ipcMain.handle('room-media-image', async (event,id) =>  Runtime.convertToImageURL(id))
    } catch {}
  }

  handleUserID = (userUUID) => {
    console.log(`Client: My assigned UUID is ${userUUID}`);
    this.userUUID = userUUID
    this.io.emit("id-info",userUUID,this.sid)
    this.io.io.on("close", () => this.handleExit())
  }

  handleNewWindow = (id,type,resID) => {
    console.log(`Client: Creating a new window (Type: ${type}, ResID: ${resID})`)
    const windows = createResourecWindow(type,resID)
    this.allWindows.set(id,windows)
  }

  handleExit = (controlClosed) => {
    if (this.exited) {return}
    if (!this.io.disconnected) {this.io.disconnect()}
    ipcMain.removeHandler("room-new-window")
    ipcMain.removeHandler("room-media-video")
    ipcMain.removeHandler("room-media-image")
    console.log("Client Exited")
    if (!controlClosed) {
      try{
        this.controlWindow.close()
      } catch {

      }
    }
    if (typeof(this.onclose) === "function") {this.onclose()}
    this.exited = true
  }

  handleWindowClose = (id) => {
    const window = this.allWindows.get(id)
    if (!window) {return}
    console.log("Client: Closing a window. ID:",id)
    window.close()
    this.allWindows.delete(id)
  }

  handleWindowChange = (id,type,extra) => {
    const window = this.allWindows.get(id)
    if (!window) {return}
    if (type === "maximize") {
      // BrowserWindow.prototype.setBounds()
      window.maximize()
    } else if (type === "minimize") {
      window.minimize()
    } else if (type === "newbound") {
      window.setBounds(extra)
    }
  }
}

// 1. Start the Server on port 2026



// 2. Wait a second for the port to bind, then connect a Client to it
// setTimeout(() => {
//   console.log("Testing: Connecting Client...");
//   const myClient = new RoomClient("client-session-456", "127.0.0.1", 2026);
// }, 1000);

// setTimeout(() => {
//   const myServer = new RoomServer("host-session-123", "Gamers Den", 2026);
// }, 1000)