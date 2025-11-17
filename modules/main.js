import * as deviceID from "./deviceid.js"
import * as Login from "./login.js"
import * as server from "./server.js"
import * as fs from "./filemanager.js"
import * as download from "./downloader.js"

let InitAllowed = true
let sessionID = 0

export async function serverStatus() {
  return await server.serverIsAvailable()
}

export function Initialization(reporter) {
  fs.init()
  server.tests()
  download.setReporter(reporter)
  //deviceID.deleteID()
  if (InitAllowed) {
    //console.log(deviceID.hasID())
    if (deviceID.hasID()) {
      InitAllowed = false
      if (Login.hasLoginDetails()) {
        return 1
      } else {
        return 2
      }
    } else {
      deviceID.newID()
      Login.clearLoginDetails()
      InitAllowed = false
      return 2
    }
  } else {
    return 0
  }
}

export async function freshLogin(username,password) {
  if (await server.serverIsAvailable()) {
    const id = deviceID.getID()
    const response = await server.attemptNewLogin(username,password,id)
    if (response[0] === 0) {
      const loginid = response[1]
      const monitorid = crypto.randomUUID()
      const mapresponse = await server.mapMonitorID(id,monitorid,loginid)
      if (mapresponse[0] === 0) {
        fs.setABAMC(monitorid)
        console.log("Successfully saved")
      } else {
        console.log(mapresponse[1])
      }
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
      return true
    } else {
      console.error("Session ID not gotten",sessionResponse[1],sessionResponse[2])
      if (sessionResponse[1] === 5) {
        sessionID = 0
      }
      return false
    }
  } else {
    return false
  } 
}

export async function getOnlineNotes(classes) {
  if (await server.serverIsAvailable()) {
    const result = await server.getAvailableNotes(classes)
    if (result[0] === 0) {
      return result[1]
    } else {
      console.log(result[1], classes)
      return []
    }
  } else {
    return []
  }
}

export function getOfflineNotes() {
  const notes = fs.getNotes()
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

export async function getMonitorNotes() {
  const response = await server.fetchMonitoredDevices(sessionID)
  if (response[0] === 0) {
    return response[1]
  } else {
    return {}
  }
}

export async function getRecentNotes() {
  const jsonText = await fs.getRecentJson();
  return JSON.parse(jsonText);
}

export async function addRecentNote(name) {
  const recents = await getRecentNotes();
  if (recents.includes(name)) {
    recents.splice(recents.indexOf(name),1);
    recents.unshift(name);
  } else {
    recents.unshift(name);
  }
  while (recents.length > 5) {
    recents.pop()
  }
  if (recents) {
    fs.saveRecentJson(JSON.stringify(recents));
  }
}