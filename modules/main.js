import * as deviceID from "./deviceid.js"
import * as Login from "./login.js"
import * as server from "./server.js"
import * as fs from "./filemanager.js"
import * as download from "./downloader.js"
import * as api from "./api.js"
import * as log from "electron-log"
// import * as room from "./room.js"

let InitAllowed = true
export let sessionID = 0
let testMode = "online"

export async function serverStatus(mode) {
  if (mode === "test" && testMode === "offline") {
    return true
  } else {
    return await server.serverIsAvailable()
  }
}

export function Initialization(reporter) {
  fs.init()
  server.tests()
  download.setReporter(reporter)
  if (!deviceID.test()) {
    deviceID.deleteID()
    Login.clearLoginDetails()
  }
  //deviceID.deleteID()
  if (InitAllowed) {
    //console.log(deviceID.hasID())
    if (deviceID.hasID()) {
      InitAllowed = false
      if (Login.hasLoginDetails()) {
        return 1
        // log.info("User logged in")
      } else {
        // log.info("User not logged in")
        return 2
      }
    } else {
      // log.info("Brand new device detected")
      deviceID.newID()
      Login.clearLoginDetails()
      InitAllowed = false
      return 2
    }
  } else {
    // log.warn("User attempted to initialize twice")
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
      // log.info("User has gotten session id")
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

export function getOfflineNotes() {
  const notes = fs.getNotes()
  return notes
}

export function getOfflineBanks() {
  const notes = fs.getBanks()
  return notes
}

export function addDownload(request) {
  download.addDownload(request)
  return download.downloadQueue
}

export async function logout() {
  const results = await server.logout(sessionID)
  // log.info("User logging out")
  console.log(results)
  Login.clearLoginDetails()
  return true
}

export async function tempFile(filename) {
  try {
    // log.info("Created a temp file",filename)
    return await fs.createTempFile(filename)
  } catch (err) {
    // log.warn("Failed to create",filename,err)
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

export async function getBankDetailsData() {
  if (testMode === "online") {
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
  } else if (testMode === "offline"){
    const quesString = await fs.getTestQuestion(uuid,location)
    if (quesString) {
      const data = JSON.parse(quesString)
      return data.Details
    } else {
      return {}
    }
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

export async function getTestQuestions(uuid,location,includeAnswers) {
  if (testMode === "online") {
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
  } else if (testMode === "offline") {
    const bank = await fs.loadBankData(uuid)
    const quesString = await fs.getTestQuestion(uuid,location)
    if (bank && quesString) {
      const source = JSON.parse(quesString)?.Data || {}
      const final = {}
      for(const [section,data] of Object.entries(source)) {
        if (!final[section]) {final[section] = []}
        data.forEach((sub,subi) => {
          if (!final[section][subi]) {final[section][subi] = []}
          sub.forEach((ques,i) => {
            const ret = {}
            if (bank[ques]) {
              ret.question = bank[ques].question
              ret.options = bank[ques].options
              if (includeAnswers) {
                ret.answer = bank[ques].answer
              }
              final[section][subi][i] = ret
            }
          }) 
        })
      }
      return final
    } else {
      return false
    }
  }
}

export async function sendTestResult(uuid,section,subsection,question,answer,testlocation) {
  if (testMode === "online") {
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
  } else if (testMode === "offline")  {
    const existingStr = fs.getTestResult(uuid,testlocation) || "{}"
    const existing = JSON.parse(existingStr)
    if (!existing[section]) {existing[section] = []}
    if (!existing[section][subsection]) {existing[section][subsection] = []}
    existing[section][subsection][question] = answer
    return fs.writeTestResult(uuid,testlocation,JSON.stringify(existing))
  }
}

export async function finishTest(uuid,location) {
  if (testMode === "online") {
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
  } else if (testMode === "offline") {
    const timeStamp = Date.now()
    const data = {}
    data.time = timeStamp.toString()
    await markTest(uuid,location)
    return fs.writeTestSubmission(uuid,location,JSON.stringify(data))
  }
}

export async function getTestDetails(uuid,location) {
  if (testMode === "online") {
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
  } else if (testMode === "offline"){
    const quesString = await fs.getTestQuestion(uuid,location)
    if (quesString) {
      const data = JSON.parse(quesString)
      if (data.Details) {
        return data.Details
      } else {
        return {}
      }
    } else {
      return {}
    }
  }
}


export async function TestVariable(action,uuid,name,content,location) {
  if (testMode === "online") {
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
  } else if (testMode === "offline") {
    if (action === "get") {
      return fs.readTestVariable(uuid,location,name)
    } else if (action === "set") {
      fs.writeTestVariable(uuid,location,name,content)
    }
  }

}

export async function SetTestMode(newmode) {
  if (typeof newmode === "string") {
    testMode = newmode
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

function getAvaiableQuestions(strlist,no) {
  const avaiable = []
  const list = strlist.split(",")
  list.forEach(item => {
    if (item.includes("-")) {
      const num1 = parseInt(item.substring(0,item.indexOf("-")))
      const num2 = parseInt(item.substring(item.indexOf("-")+1))
      for(let i=num1;i<=num2;i++) {
        if (i < no && !avaiable.includes(i)) {
          avaiable.push(i)
        }
      }
    } else {
      const num = parseInt(item)
      if (num < no && !avaiable.includes(num)) {
        avaiable.push(num)
      }
    }
  });
  return avaiable
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export async function generateNewTest(uuid,no,queslist,type,duration) {
  no = parseInt(no)
  const bank = await fs.loadBankData(uuid)
  if (bank) {
    let available ;
    if (queslist === "-1") {
      available = []
      for(let i=0;i<bank.length;i++) {
        available.push(i)
      }
    } else {
      available = getAvaiableQuestions(queslist,bank.length);
    }
    if (available.length<1) {
      return
    }
    const test = {}
    test.Data = {}
    const preTest = [];
    while (preTest.length < no && available.length > 0) {
      if (type === "order") {
        preTest.push(available[0])
        available.shift()
      } else if (type === "random") {
        const index = getRandomInt(available.length)-1
        preTest.push(available[index])
        available.splice(index,1)
      }
    }
    test.Data["Main Test"] = []
    test.Data["Main Test"][0] = preTest;
    test.Details = {}
    test.Details.duration = parseInt(duration) * 60 //Save in seconds
    const finalData = JSON.stringify(test)
    const timeStamp = Date.now()
    await fs.writeTestToDisk(uuid,timeStamp,finalData)
    return timeStamp.toString()
  }
}

export async function getOfflineTests() {
  return fs.getAllOfflineTest()
}

export async function markTest(uuid,location)  {
  const generatedTime = Date.now()
  const bank = await fs.loadBankData(uuid)
  const selectionStr = fs.getTestResult(uuid,location) || "{}"
  const selection = JSON.parse(selectionStr)
  const questions = await getTestQuestions(uuid,location,true)

  const finalData = {};
  finalData.scores = {}
  finalData.scores.total = 0;
  finalData.scores.total_score = 0;
  finalData.scores.sections_total = {};
  finalData.scores.sections_scores = {};
  const testData = {}
  for(const [sectionname,section] of Object.entries(questions)) {
    if (!testData[sectionname]) {testData[sectionname] = []}
    section.forEach((sub,subi) => {
      if (!testData[sectionname][subi]) {testData[sectionname][subi] = []}
      sub.forEach((data,i) => {
        finalData.scores.total++
        const userAnswer = selection[sectionname]?.[subi]?.[i] || 0
        const realAnswer = data.answer  
        if (finalData.scores.sections_total[sectionname]) {
              finalData.scores.sections_total[sectionname]++
        }  else {
              finalData.scores.sections_total[sectionname] = 1
        }
        const test = {
          answer: realAnswer,
          question: data.question,
          selection: userAnswer || 0,
          options: data.options
        }
        testData[sectionname][subi][i] = test
        //5 stands for Bonus
        if (userAnswer == realAnswer || realAnswer == 5) {
            finalData.scores.total_score++
            if (finalData.scores.sections_scores[sectionname]) {
              finalData.scores.sections_scores[sectionname]++
            }  else {
              finalData.scores.sections_scores[sectionname] = 1
            }
        }
      })
    })
  }
  const variables = fs.getAllTestVariables(uuid,location)
  finalData.test = testData 
  finalData.variables = variables
  fs.saveFinalTestResult(uuid,location,JSON.stringify(finalData))
  const s = 1
}

export async function getFinalTestResult(uuid,location) {
  if (testMode === "online") {
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
  } else if (testMode === "offline") {
    const data = fs.getFinalTestResult(uuid,location)
    if (data) {
      return JSON.parse(data)
    } else {
      return false
    }
  }
}

export async function getLibraryData() {
  const data = await server.getLibraryData()
  if (data[0] === 0) {
    return data[1]
  } else {
    return {
      "offline": true
    }
  }
}

export async function convertToVideoURL(id) {
  const mainURL = api.getMediaVideoURL()
  return `${mainURL}?id=${id}`
}

export async function convertToImageURL(id) {
  const mainURL = api.getMediaImageURL()
  return `${mainURL}?id=${id}`
}

export async function convertToPDFURL(id) {
  const mainURL = api.getMediaPDFURL()
  return `${mainURL}?id=${id}`
}

export async function getAvailableRoom() {
  const data = await server.getAvailableRoom()
  if (data[0] === 0) {
    return data[1]
  } else {
    return false
  }
}

export async function getBankQuestions(uuid,uuid_location) {
  const data = await server.getBankQuestions(sessionID,uuid,uuid_location)
  if (data[0] === 0) {
    return data[1]
  } else {
    return []
  }
}

export async function removeTestData(uuid,id) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.testEditData("remove",uuid,sessionID,"private",id)
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

export async function replaceTestData(uuid,id,data) {
  if (await server.serverIsAvailable() && sessionID) {
    const response = await server.testEditData("replace",uuid,sessionID,"private",id,data)
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