import { type } from "node:os";
import * as api from "./api.js"

async function simpleGet(url,post,debug){
    try{
    const result = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(post)
    })
    if (!result.ok) {
      return [1,`Server error ${result.status}`]
    }
    if (debug) {console.log(await result.text())}
    const data = await result.json();
    if (data[0] === 0) {
      return [0, data[1]]
    } else {
      return [1,data[1]]
    }
  } catch(error) {
    return [1,"Internal server/app error",error]
  }
}

export async function serverIsAvailable(debug) {
  try{
    const result = await fetch(api.getStatusURL())
    if (debug === "response") { return result}
    if (!result.ok) {
      return false
    }
    const data = await result.json()
    if (!data.code == 1) {
      return false
    }
    return true
  } catch(error) {
    return false
  }
}

export async function attemptNewLogin(username,password,deviceid) {
  const message = {
    method: "login",
    username,
    password,
    deviceid
  }
  try{
    const result = await fetch(api.getLoginURL(), {
      method: "POST",
      body: new URLSearchParams(message)
    })
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    
    const data = await result.json();
    if (data[0] === 0) {
      return [0,data[1]]
    } else {
      return [1,data[1]]
    }
  } catch(error) {
    return [1,"Internal server/app error",error]
  }
}

export async function createNewAccount(message) {
  try{
    const result = await fetch(api.getCreateAccountURL(), {
      method: "POST",
      body: new URLSearchParams(message)
    })
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    
    const data = await result.json();
    if (data[0] === 0) {
      return [0,"Success"]
    } else {
      return [1,data[1]]
    }
  } catch(error) {
    return [1,"Internal server/app error",error]
  }
}

export async function mapMonitorID(deviceid,monitorid,loginid) {
  const message = {
    deviceid,
    monitorid,
    loginid
  }
  try{
    const result = await fetch(api.getNewMonitorPairURL(), {
      method: "POST",
      body: new URLSearchParams(message)
    })
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    const data = await result.json();
    if (data[0] === 0) {
      return [0,"Success"]
    } else {
      return [1,data[1]]
    }
  } catch(error) {
    return [1,"Internal server/app error",error]
  }
}

export async function tests() {
  const status = await serverIsAvailable("response")
}

export async function fetchPrivateData(sesid) {
  const message = {
    "id": sesid,
    "id_type": "s",
    "request": "all"
  }
  return simpleGet(api.getPrivateData(),message)
}

export async function attemptNewSession(loginid,deviceid) {
  const message = {
    method: "logon",
    loginid,
    deviceid
  }
  try{
    const result = await fetch(api.getLoginURL(), {
      method: "POST",
      body: new URLSearchParams(message)
    })
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    //console.log(await result.text())
    const data = await result.json();
    if (data[0] === 0) {
      return [0,data[1]]
    } else {
      return [1,data[1]]
    }
  } catch(error) {
    return [1,"Internal server/app error",error]
  }
}

export async function getAvailableNotes(classes,term) {
  const message = {
    path: `notes,${term},${classes}`,
    type: "aba"
  }
  return await simpleGet(api.getFilesContent(),message)
}

export async function logout(sessid) {
  const message = {
    method: "logout",
    sessionid: sessid
  }
  try{
    const result = await fetch(api.getLoginURL(), {
      method: "POST",
      body: new URLSearchParams(message)
    })
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    
    const data = await result.json();
    if (data[0] === 0) {
      return [0,data[1]]
    } else {
      return [1,data[1]]
    }
  } catch(error) {
    return [1,"Internal server/app error",error]
  }
}

export async function fetchMonitoredDevices(sesid) {
  const message = {
    "sessid": sesid,
  }
  return simpleGet(api.getMonitorDataURL(),message)
}

export async function testNameData(type,sesid) {
  const message = {
    type,
    "sid": sesid
  }
  return simpleGet(api.getTestNameDataURL(),message)
}

export async function publicDataConfig(data) {
  const message = {
    data
  }
  return simpleGet(api.getPublicDataConfigURL(),message)
}

export async function testAccessData(type,sesid) {
  const message = {
    type,
    "sess_id": sesid
  }
  return simpleGet(api.getTestAccessDataURL(),message)
}

export async function getBankDetails(type,sesid) {
  const message = {
    type,
    "sid": sesid
  }
  return simpleGet(api.getBankDetailsDataURL(),message)
}

export async function testInfoData(type,uuid) {
  const message = {
    type,
    uuid
  }
  return simpleGet(api.getTestInfoDataURL(),message)
}

export async function testEditData(method,uuid,sess_id,uuid_location,target,secondTarget) {
  const message = {
    method,
    uuid,
    sess_id,
    uuid_location,
    "target": JSON.stringify(target),
    "target2": JSON.stringify(secondTarget)
  }
  return simpleGet(api.getTestEditDataURL(),message)
}

export async function getQuestionData(uuid,sid,location) {
  const message = {
    uuid,
    sid,
    location
  }
  return simpleGet(api.getTestQuestionURL(),message)
}

export async function sendResultData(uuid,section,subsection,question,answer,sid) {
  const message = {
  uuid,
  section,subsection,question,answer,sid
  }
  console.log(uuid,section,subsection,question,answer,sid)
  return simpleGet(api.getTestResultsURL(),message)
}

export async function sendFinishSignal(
  uuid,sid
) {
  const message = {
    uuid,
    sid
  }
  return simpleGet(api.getTestFinishSignalURL(),message)
}

export async function getTestDetails(uuid,location) {
  const message = {
    uuid,
    location
  }
  return simpleGet(api.getTestDetailsURL(),message)
}

export async function TestVariable(action,uuid,name,content,sessid) {
  const message = {
    action,
    uuid,
    target: name,
    content,
    sessid
  }
  return simpleGet(api.getTestVariableURL(),message)
}

export async function getChangelog(version) {
  const message = {
    version
  }
  return simpleGet(api.getAppChangelogURL(),message)
}

export async function TestFinalResult(uuid,sid) {
  const message = {
    uuid,
    sid
  }
  // console.log(uuid,sid)
  return simpleGet(api.getTestFinalResultURL(),message)
}

export async function getLibraryData() {
  return simpleGet(api.getMediaLibraryURL())
}

export async function registerRoom(sid,name,addr,port) {
  const message = {
    name,
    sid,
    port,
    addr
  }
  const data = JSON.stringify(message)
  return simpleGet(api.getRegisterRoomURL(),{data})
}

export async function removeRegisteredRoom(sid,name) {
  const message = {
    name,
    sid
  }
  return simpleGet(api.getRemoveRoomURL(),message)
}

export async function getAvailableRoom() {
  return simpleGet(api.getAvailableRoomsURL()) 
}

export async function getBankQuestions(sess_id,uuid,uuid_location) {
  const message = {
    sess_id,
    uuid,
    uuid_location
  }
  return simpleGet(api.getBankQuestionsDataURL(),message)
}

export async function announceRoom(sess_id) {
 const message = {
  sess_id
 }
 return simpleGet(api.getAnnounceRoomURL(),message)
}