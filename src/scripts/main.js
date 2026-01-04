import render from "./dashboard-elements/render.js"
import manager from "./dashboard-elements/manager.js"
import watcher from "./dashboard-elements/watcher.js"
import api from "./apis/api.js"
import { attemptNewLogin } from "../../nodeless/modules/server.js"
import revaluator from "./dashboard-elements/revaluator.js"
import * as time from "./dashboard-elements/time.js"

const switcher = document.getElementById("switch")
const sidepanel = document.getElementById("sidepanel")
const alert = document.getElementById("alert")
const fullspace = document.getElementById("content")
const content = document.getElementById("content2")
const menu_butn_text = document.getElementsByName("menu-butn-text")
const main_notes_butn = document.getElementById("main-butn-notes")
const main_dash_butn = document.getElementById("main-butn-dashboard")
const main_monitor_butn = document.getElementById("main-butn-monitor")
const main_testmanager_butn = document.getElementById("main-butn-testmanager")
const main_account_butn = document.getElementById("main-butn-account")
const external_content = document.getElementById("external")
const main_test_butn = document.getElementById("main-butn-test")
let mode = 0
let pingID = 0
let lastPingResults = false
let hasSession = false
let currentScreen = ""
let hasFinishedLoading = false
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
    const term = "firstterm" //This is a default value
    const notes = await manager.getFormatedDownloadedNotes() //gets the notefrom
    render.notes.generate_notes_pages(content,notes,recents,"main","",term,[],handle)
  } else if(screen === "notes-online") {
    const notes = await manager.getOnlineNotesAvailable()
    const group = manager.getOnlineNotesGroups()
    const term = "firstterm jss1" //This is a default value
    render.notes.generate_notes_pages(content,notes,[],"online","",term,group,handle)
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
  } else if(screen === "account") {
    render.account.render_main_page(content,handle,manager.cache["userinfo"])
  } else if(screen === "test-mainpage") {
    const scheduled = await window.test.names("scheduled")
    const special = await window.test.names("special")
    const setupButnClick = (evt) => {
      console.log(evt)
    }
    render.testing.generate_test_mainpage(
      content,
      scheduled,
      [["Exam 1","2"],["Exam 2","2"],["Exam 3","2"]],
      special,
      setupButnClick
    )
  } else if(screen === "test-manager") {
    if (!manager.cacheHas("test_manager_bank_info")) {
      render.testmanager.render_mainpage(
        content,
        true
      )
      const percentageBar = document.getElementById("testmanager-body-cicle-focus-textl1")
      const percentageLabel = document.getElementById("testmanager-body-cicle-focus-labell1")
      const accessList = await window.test.access()
      if (accessList) {
        percentageBar.innerText = "5%"
        let percetage = 5
        const finalData = {}
        for(let i=1;i<accessList.length;i++) {
          const uuid = accessList[i]
          const data = await window.test.info("private",uuid)
          percentageBar.innerText = (Math.floor(((i+1) / accessList.length) * 95) +5) + "%"
          finalData[uuid] = data
          if (i === (accessList.length-1)) {
            manager.cacheSet("test_manager_bank_info",finalData)
            changeScreen("test-manager")
          }  
        }
        console.log(finalData)
      } else {
        percentageBar.innerText = "Error"
        percentageBar.style.color = "red";
        percentageLabel.innerText = "No Access"
        percentageLabel.style.color = "red";
      }
    } else {
      const teacher_weekly_quota = await manager.cacheGet("teacher_weekly_quota",5)
      revaluator.set_as("test_manager_bank_info",true)
      const banks = await manager.cacheGet("test_manager_bank_info")
      const isNewWeek = time.isNewWeek()
      const week_quota = {}
      Object.keys(banks).forEach((key) => {
        const name = "week_count_"+key
        let data;
        if (!isNewWeek) {
          data = localStorage.getItem(name) || 0
        } else {
          data = 0
          localStorage.setItem(name,0)
        }
        week_quota[key] = data
      })
      render.testmanager.render_mainpage(
        content,
        false,
        teacher_weekly_quota,
        week_quota,
        banks,
        handle
      )
      handle("uploadnotes")
      window.test.access().then(async list => {
        const finalData = {}
        for(let i=1;i<list.length;i++) {
          const uuid = list[i]
          const data = await window.test.info("private",uuid)
          finalData[uuid] = data
        }
        manager.cacheSet("test_manager_bank_info",finalData)
        console.log("New Bank Info loaded")
      })
    }
  } else if(screen === "test") {
    fullspace.classList.add("content-fullscreen")
    sidepanel.style.display = "none"
    content.setAttribute("class","topbar")
    external_content.style.display = "block"
    external_content.style.position = "absolute"
    external_content.src = "./external/testing.html"
    render.testing.generate_test_topbar(content,manager.cache["userinfo"],1200)
    window.sys.fullscreen(true)
    sessionStorage.setItem("testdata",JSON.stringify({
      targetbank: 0,
      targetquestion: 0,
      banks: [
        {
          name: "Chemisty",
          questions: [
            {
              type: "obj",
              textcontent: "This is a question",
              options: ["Option1","Option2","Option3"]
            }
          ]
        }
      ]
    }))
  }
  currentScreen = screen
}

async function startUp() {
  contentProtection()
  hasSession = await window.runtime.newSession() //Starts new session
  //Cache important info just in case
  manager.cacheSet("teacher_weekly_quota",server.publicConfig,"teacher_weekly_quota")
  if (hasSession) {
    if (manager.cacheHas("userinfo")) {
      revaluator.set_as("userinfo",true) // Use cached info
      manager.cache.userinfo = await manager.cacheGet("userinfo") //Compability with < 1.9 code
      manager.cacheSet("userinfo",manager.getUserInfo) //Get the latest from server
    } else {
      await manager.cacheSet("userinfo",manager.getUserInfo) //wait for info
    }
    contentProtection()
  } else {
    //No sessions
    if (manager.cacheHas("userinfo")) {
      revaluator.set_as("userinfo",true) // Use cached info
      manager.cache.userinfo = await manager.cacheGet("userinfo") //Compability with < 1.9 code
      contentProtection() //Enables admin offline tools
    }
  }
  changeScreen("dashboard")
  ping()
  hasFinishedLoading = true
}

function refresh_alert() {
  if (!(manager.get("server status"))) {
    render.alert.generate_alert(alert,"offline","alert-text")
  } else if (!hasSession) {
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
main_test_butn.onclick = () => changeScreen("test-mainpage")
main_monitor_butn.onclick = () => {if (hasFinishedLoading) {changeScreen("monitor")}}
main_testmanager_butn.onclick = () => {if (hasFinishedLoading) {
  changeScreen("test-manager")
}}
main_account_butn.onclick = () => {if (hasFinishedLoading) {changeScreen("account")}}


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

  } else if (e === "logout") {
    window.runtime.logout()
    window.location.href = "login.html"
    sessionStorage.clear()

  } else if (e === "addquestions") {
    manager.cacheGet("test_manager_bank_info",false).then(bank => {
      if (bank) {
        let store;
        if (localStorage.getItem("teacher_temporary_store")) {
          store = JSON.parse(localStorage.getItem("teacher_temporary_store"))
        } else {
          store = {}
        }
        const info = bank[property]
        if (info) {
          render.testmanager.rerender_create_page(info,store[info.uuid],handle)
        }
      }
    })
  } else if (e === "changescreen") {
    changeScreen(property)
  } else if (e === "uploadnotes") {
    const text = document.getElementById("testmanager-body-topdisplay")
    const storage = localStorage.getItem("teacher_temporary_store")
    let finishedCount=0,draftCount=0;
    if (storage) {
      let boo = true
      const store = JSON.parse(storage)
      for (const [uuid, questions] of Object.entries(store)) {
        questions.forEach(question => {
          if (!question) {return}
          if (boo) {
            //console.log(window.test.add("9b8d90ae-3892-49ca-b493-a422d2c8eeae",questions))
            boo = false
          }
          if (question.finished) {
            finishedCount++
          } else {
            draftCount++
          }
        })
      }
      if (text) {text.innerText = `You have ${finishedCount} questions completed and ${draftCount} still in writing`}

      async function uploadnotes(store,text,total) {
        let uploaded = 0
        const cache = await manager.cacheGet("test_manager_bank_info",{})
        for (const [uuid, questions] of Object.entries(store)) {
          for(let i=1;i<questions.length;i++) {
            const question = questions[i]
            if (question && question.finished) {
              const result = await window.test.add(uuid,question)
              if (result) {
                let week_count = localStorage.getItem("week_count_"+uuid)
                if (week_count) {
                  week_count = parseInt(week_count)
                } else {
                  week_count = 0
                }
                week_count++
                localStorage.setItem("week_count_"+uuid,week_count)
                uploaded++
                questions[i] = undefined
              }
            }
            if (text) {
              text.innerText = `Uploaded ${uploaded} / ${total}`
            }
          }
          const bankinfo = await window.test.info("private",uuid)
          localStorage.setItem("teacher_temporary_store",JSON.stringify(store))
          cache[uuid] = bankinfo
        }
        manager.cacheSet("test_manager_bank_info",cache)
        return uploaded
      }
      if (hasSession) {
        if (finishedCount>0) {
          uploadnotes(store,text,finishedCount).then(count => {
            finishedCount = finishedCount - count
            if (text) {text.innerText = `You have ${finishedCount} questions completed and ${draftCount} still in writing (Uploaded ${count})`}
          })
        }
      } else {
        if (text) {text.innerText = `You have ${finishedCount} questions completed and ${draftCount} still in writing (Try again when in School))`}
      }
    }
  } else {
    console.log("Unknown handle",e)
  }
}

//This hides/shows features that need specific privilegdges
function contentProtection() {
  if (hasSession) {
    if(manager.get("student") || !manager.get("verified")) {
      main_monitor_butn.style.display = "none"
      main_testmanager_butn.style.display = "none"
    } else {
      main_monitor_butn.style.display = ""
      main_testmanager_butn.style.display = ""
    }
  } else {
    main_monitor_butn.style.display = "none"
    main_testmanager_butn.style.display = "none"
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
