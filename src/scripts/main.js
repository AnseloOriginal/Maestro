import render from "./dashboard-elements/render.js"
import manager from "./dashboard-elements/manager.js"
import watcher from "./dashboard-elements/watcher.js"
import { attemptNewLogin } from "../../nodeless/modules/server.js"

const switcher = document.getElementById("switch")
const sidepanel = document.getElementById("sidepanel")
const alert = document.getElementById("alert")
const content = document.getElementById("content2")
const menu_butn_text = document.getElementsByName("menu-butn-text")
const main_notes_butn = document.getElementById("main-butn-notes")
const main_dash_butn = document.getElementById("main-butn-dashboard")
const main_monitor_butn = document.getElementById("main-butn-monitor")
let mode = 0
let pingID = 0
let lastPingResults = false
let hasSession = false
let currentScreen = ""
startUp()

function ping() {
  clearTimeout(pingID)
  manager.serverOnline()
  .then(async (pingResults) => {
    if (pingResults && !hasSession) {
      const nowHasSession = await window.runtime.newSession()
      hasSession = nowHasSession
      if (nowHasSession) {await manager.getUserInfo()}
      console.log("After session",currentScreen)
      changeScreen(currentScreen)
      //console.log(`PingID: ${pingID} Server: ${pingResults}`)
    }
    if (pingResults !== lastPingResults) {
      changeScreen(currentScreen)
    }
    //console.log("Has Session",hasSession)
    refresh_alert()
    lastPingResults = pingResults
    pingID = setTimeout(ping, 2000)
  })
  if (currentScreen==="monitor" && watcher.enabled() && manager.cache.server) {
    window.server.serverMonitorData()
    .then((users) =>{
      render.monitor.generate_monitor(content,users,handle)
      watcher.watchRuntime(users)
      render.monitor.refreshUI(watcher.watched())
    })
  } else if (!hasSession && currentScreen==="monitor") {
    render.monitor.generate_monitor(content,{},handle)
  }
}

const toggle_panel = () => {
  if (mode === 0) {
    mode = 1
    sidepanel.setAttribute("class","sidepanel sidepanel-max")
    menu_butn_text.forEach((value)=>{
      value.style.display = "none"
    })
  } else {
    mode = 0
    sidepanel.setAttribute("class","sidepanel sidepanel-min")
    menu_butn_text.forEach((value)=>{
      value.style.display = "inline"
    })
  }
}

switcher.onclick = () => toggle_panel()

async function changeScreen(screen,...extras) {
  refresh_alert()
  content.innerHTML = ""
  if (screen === "dashboard") {
    if (hasSession) {
      if (manager.get("student")) {
        render.dashboard.generate_main_dashboard(content,"student")
      } else {render.dashboard.generate_main_dashboard(content,"worker")}
    } else {render.dashboard.generate_main_dashboard(content,"offline")}
  } else if(screen === "notes") {
    console.log("Before session",currentScreen)
    const recents = await window.fs.recents()
    recents.forEach((note,i,a) =>{
      a[i] = manager.pretify(note)
    })
    const notes = await manager.getFormatedDownloadedNotes()
    render.notes.generate_notes_pages(content,notes,recents,"main","",[],handle)
  } else if(screen === "notes-online") {
    const notes = await manager.getOnlineNotesAvailable()
    const group = manager.getOnlineNotesGroups()
    render.notes.generate_notes_pages(content,notes,[],"online","",group,handle)
  } else if(screen === "monitor") {
    if (manager.cache.server) {
      const guide = {
        "Uzebu Ansel": [{"device_name":"ABA13","app":"msedge"},{"device_name":"A1A13","app":"electron"}],
        "Esohe Uzebu": [{"device_name":"ABA14","app":"mastro"},{"device_name":"A1C13","app":"cod"}]
      }
      const devices = await window.server.serverMonitorData()
      render.monitor.generate_monitor(content,devices,handle)
    } else {
      render.general.offile(content)
    }
  }
  currentScreen = screen
}

async function startUp() {
  contentProtection()
  hasSession = await window.runtime.newSession() //Starts new session
  if (hasSession) {
    await manager.getUserInfo()
    contentProtection()
  } //Caches info
  changeScreen("dashboard")
  ping()
}

function refresh_alert() {
  if (!(manager.get("server status"))) {
    render.alert.generate_alert(alert,"offline","alert-text")
  } else if (manager.get("failed")) {
    render.alert.generate_alert(alert,"failed","alert-text")
  } else if (manager.get("disabled")) {
    render.alert.generate_alert(alert,"disabled","alert-text")
  } else if (!manager.get("verified")) {
    render.alert.generate_alert(alert,"unverified","alert-text")
  }else{
    render.alert.generate_alert(alert,"none","alert-text")
  }
}

toggle_panel()
main_notes_butn.onclick = () => changeScreen("notes")
main_dash_butn.onclick = () => changeScreen("dashboard")
main_monitor_butn.onclick = () => changeScreen("monitor")

function handle(e,property,caller) {
  if (e === "screen") {
    changeScreen(property)
  } else if (e === "download") {
    const temp = window.fs.download(property)
    .then((queue)=>{
      console.log(queue)
      render.notes.disable_download_buttons(queue)
    })
  } else if (e === "file open") {
    window.fs.open(property)
    window.fs.recents()
    .then((rarray) => {
      rarray.forEach((note,i,a) =>{
        a[i] = manager.pretify(note)
      })
      render.notes.refresh_recents(rarray,handle)
    })
  } else if (e === "monitor-shuffle") {
    const final = [...watcher.watched()]
    if (!watcher.beingWatched(property.id)) {
      watcher.addWatched(property.id,property.app)
      final.push([property.id, 1])
    } else {
      watcher.removeWatched(property.id)
      final.push([property.id, 0])
    }
    render.monitor.refreshUI(final)
  } else {
    console.log("Unknown handle",e)
  }
}

//This hides/shows features that need specific privilegdges
function contentProtection() {
  if (hasSession) {
    if(manager.get("student") || !manager.get("verified")) {
      main_monitor_butn.style.display = "none"
    } else {
      main_monitor_butn.style.display = ""
    }
  } else {
    main_monitor_butn.style.display = "none"
  }
}

window.runtime.onDownloadComplete((details) => {
  if (currentScreen === "notes-online") {
    let download_button = document.getElementById(details.download)
    if (download_button) {
      let icon = download_button.getElementsByTagName("span")
      if (icon[0]) {
        if (details.status == "complete") {
          icon[0].innerText = "check"
        } else {
          icon[0].innerText = "x"
        }
      }
      download_button.disabled = false
    }
  }
})

