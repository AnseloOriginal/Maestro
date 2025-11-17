//Imported from Electron Modules server.js
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

export async function serverIsAvailable() {
  try{
    const result = await fetch(api.getStatusURL())
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
  const status = await serverIsAvailable()
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

export async function getAvailableNotes(classes) {
  const message = {
    class: classes
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
  console.log(simpleGet(api.getMonitorDataURL(),message))
  return simpleGet(api.getMonitorDataURL(),message)
}