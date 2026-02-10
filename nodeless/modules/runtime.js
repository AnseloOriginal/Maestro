import * as deviceID from "./deviceid.js"
import * as Login from "./login.js"
import * as server from "./server.js"
import * as fs from "./filemanager.js"
import * as download from "./downloader.js"

let InitAllowed = true
if (sessionStorage.getItem("InitAllowed") !== null) {
  InitAllowed = sessionStorage.getItem("InitAllowed")
} else (
  sessionStorage.setItem("InitAllowed",InitAllowed)
)
let sessionID = 0
if (sessionStorage.getItem("sessionID") !== null) {
  sessionID = sessionStorage.getItem("sessionID")
} else {
  sessionStorage.setItem("sessionID",sessionID)
}


export async function serverStatus() {
  return await server.serverIsAvailable()
}

 export async function Initialization() {
  await fs.init()
  //return 0
  //deviceID.deleteID()
  if (InitAllowed) {
    if (deviceID.hasID()) {
      InitAllowed = false
      if (Login.hasLoginDetails()) {
        sessionStorage.setItem("Init Results","1")
        return 1
      } else {
        sessionStorage.setItem("Init Results","2 from Login")
        return 2
      }
    } else {
      server.tests()
      deviceID.newID()
      Login.clearLoginDetails()
      InitAllowed = false
      sessionStorage.setItem("initAllowed",false)
      sessionStorage.setItem("Init Results","2 for Device ID")
      return 2
    }
  } else {
    sessionStorage.setItem("Init Results","0")
    return 0
  }
}

export async function freshLogin(username,password) {
  if (await server.serverIsAvailable()) {
    const id = deviceID.getID()
    const response = await server.attemptNewLogin(username,password,id)
    if (response[0] === 0) {
      const loginid = response[1]
      /* Not supported without Node yet
      const monitorid = crypto.randomUUID()
      const mapresponse = await server.mapMonitorID(id,monitorid,loginid)
      if (mapresponse[0] === 0) {
        //fs.setABAMC(monitorid)
        //console.log("Successfully saved")
      } else {
        console.log(mapresponse[1])
      }
        */
      Login.saveLoginDetails(loginid)
      return [0,"Success"]
    } else {
      console.log(response)
      return response
    }
  } else {
    return [1,"Server is unavailable"]
  }
}

export async function newAccount(message) {
  if (await server.serverIsAvailable()) {
    const create_response = await server.createNewAccount(message)
    return create_response
  } else {
    return [1,"Server is unavailable"]
  } 
}

export async function getServerInfo(request) {
  if (await server.serverIsAvailable()) {
    if (sessionID !== 0) {
      await getMonitorNotes()
      let content =  await server.fetchPrivateData(sessionID)
      if (content[0] === 0) {
        const data = JSON.parse(content[1])
        return data 
      } else {
        return {failed: true}
      }
    } else {
      return [1, "No Session"]
    }
  } else {
    return {}
  }
}

export async function getSession() {
  if (await server.serverIsAvailable()) {
    const loginid = Login.getLoginDetails()
    const deviceid = deviceID.getID()
    const sessionResponse = await server.attemptNewSession(loginid,deviceid)
    if (sessionResponse[0] === 0 ){
      sessionID = sessionResponse[1]
      sessionStorage.setItem("sessionID",sessionResponse[1])
      return true
    } else {
      console.error("Session ID not gotten",sessionResponse[1],sessionResponse[2])
      if (sessionResponse[1] === 5) {
        sessionID = 0
        sessionStorage.setItem("sessionID",0)
      }
      return false
    }
  } else {
    return false
  } 
}

export async function getOnlineNotes(classes,term) {
  if (await server.serverIsAvailable()) {
    const result = await server.getAvailableNotes(classes,term)
    if (result[0] === 0) {
      return result[1]
    } else {
      console.log(result[1], classes, term)
      return []
    }
  } else {
    return []
  }
}

export async function getOfflineNotes() {
  const notes = await fs.notes()
  //console.log(notes)
  return notes
}

export function addDownload(request) {
  download.addDownload(request)
  return download.downloadQueue
}

export async function logout() {
  const results = await server.logout(sessionID)
  console.log(results)
  Login.clearLoginDetails()
  return true
}

export async function tempFile(filename) {
  try {
    return await fs.createTempFile(filename)
  } catch (err) {
    console.log(`Failed to open ${filename}`,err)
    return false
  }
}

export async function getMonitorNotes() { //Typpo in function name
  const response = await server.fetchMonitoredDevices(sessionID)
  if (response[0] === 0) {
    return response[1]
  } else {
    return {}
  }
}

export async function openFile(file,redirect) {
  if (redirect) {
    localStorage.setItem("file",file)
    window.document.location.href = "fileviewer.html"
  }
  addRecentNote(file)
}

export async function getFileURL(file) {
  const blob = await fs.getFileContent(file)
  if (blob) {
    return URL.createObjectURL(blob)
  } else {
    return false
  }
}


export async function getRecentNotes() {
  const jsonText = localStorage.getItem("Recents")
  if (jsonText) {
    return JSON.parse(jsonText);
  } else {
    return []
  }
}

export async function addRecentNote(name) {
  const recents = await getRecentNotes();
  if (recents.includes(name)) {
    recents.splice(recents.indexOf(name),1);
    recents.unshift(name);
    console.log("Already Exists")
  } else {
    recents.unshift(name);
  }
  while (recents.length > 5) {
    recents.pop()
  }
  localStorage.setItem("Recents",JSON.stringify(recents))
}

export async function submitServerAction(type,...param) {
  if (type == "fgp") {
    console.log(param)
  }
}

export async function getTestNameData(type) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.testNameData(type,sessionID)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response)
      return []
    }
  } else {
    return []
  }
}

export async function getTestAccessData() {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.testAccessData("private",sessionID)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response[1],response[2])
      return []
    }
  } else {
    return []
  }
}

export async function getTestInfoData(type,uuid) {
  if (await server.serverIsAvailable()) {
    const response = await server.testInfoData(type,uuid)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response[1],response[2])
      return {}
    }
  } else {
    return {}
  }
}

export async function getPublicConfigData(data) {
  if (await server.serverIsAvailable()) {
    const response = await server.publicDataConfig(data)
    if (response[0] === 0) {
      return response[1]
    } else {
      return undefined
    }
  }
}

export async function addNewTestData(uuid,data) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.testEditData("add",uuid,sessionID,"private",data)
    if (response[0] === 0) {
      return true
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}

export async function getChangelog(version) {
  if (await server.serverIsAvailable()) {
    const response = await server.getChangelog(version)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}

export async function requestFullscreen(bol) {
  if (bol) {
    document.documentElement.requestFullscreen()
  } else {
    await document.exitFullscreen()
  }
}

export async function getBankDetails() {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.getBankDetails("public",sessionID)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response[1],response[2])
      return {}
    }
  } else {
    return {}
  } 
}

export async function getTestQuestions(uuid,location) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.getQuestionData(uuid,sessionID,location)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}

export async function sendTestResult(uuid,section,subsection,question,answer) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.sendResultData(uuid,section,subsection,question,answer,sessionID)
    if (response[0] === 0) {
      return true
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }  
}

export async function finishTest(uuid) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.sendFinishSignal(uuid,sessionID)
    if (response[0] === 0) {
      return true
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}


export async function TestVariable(action,uuid,name,content) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.TestVariable(action,uuid,name,content,sessionID)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}

export async function SetTestMode() {
  console.warn("[MODE SYSTEM] Only online mode supported")
}

export async function getFinalTestResult(uuid) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.TestFinalResult(uuid,sessionID)
    if (response[0] === 0) {
      const res = response[1]
      for(const [name,section] of Object.entries(res.test)) {
        section.forEach((data,i) => {
          section[i] = Object.values(data)
        })
      }
      return res
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}

export async function getTestDetails(uuid,location) {
  if (await server.serverIsAvailable()) {
    const response = await server.getTestDetails(uuid,location)
    if (response[0] === 0) {
      return response[1]
    } else {
      console.log(response)
      return false
    }
  } else {
    return false
  }
}