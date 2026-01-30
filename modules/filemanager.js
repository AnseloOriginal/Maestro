import { mkdir, rmdir } from 'node:fs';
import { readdirSync, writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import {writeFile} from "node:fs";
import * as fs from "node:fs"
import os from 'node:os'
import path from 'node:path'
import crypto from "crypto";


const basePath = path.join(os.homedir(),"Appdata","Roaming","ABA")
const baseFilesPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files")
const baseNotesPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files","notes")
const baseUnknownPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files","unknown")
const baseBanksPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files","banks")
const baseOfflineTestsPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files","tests")
const TempPath = path.join(os.homedir(),"Appdata","Roaming","ABA","temp")
const abacFile = path.join(basePath,"abamc.config")
const recentsJSON = path.join(basePath,"recents.json")

export function init() {
  mkdir(basePath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  mkdir(baseFilesPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  mkdir(baseUnknownPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  mkdir(baseNotesPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  mkdir(baseBanksPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  mkdir(baseOfflineTestsPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  //rmdir(TempPath, { recursive: false });
  mkdir(TempPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

export function setABAMC(text) {
   writeFile(abacFile, text, err => {
    if (err) {
      console.log(`Failed to write file: ${err}`)
      return false
    } else {
      console.log("File written.");
      return true
    }
  });

}


export function getNotes() {
  let notes = readdirSync(baseNotesPath)
  notes.forEach( (filename,i,a)=> {
    a[i] = filename.replaceAll(".aba","")
  })
  return notes
}

export function getBanks() {
  let banks = readdirSync(baseBanksPath)
  banks.forEach( (filename,i,a)=> {
    a[i] = filename.replaceAll(".ababank","")
  })
  return banks
}

function decrypt(buffer, password) {
  // buffer is a Node.js Buffer containing the file

  // 1. IV (16 bytes)
  const iv = buffer.subarray(0, 16);

  // 2. Meta length (next 4 bytes, big-endian)
  const metaLength = buffer.readUInt32BE(16);

  // 3. Meta JSON
  const metaStart = 20;
  const metaEnd = metaStart + metaLength;
  const metaJson = buffer.subarray(metaStart, metaEnd).toString("utf8");
  const meta = JSON.parse(metaJson);

  // 4. Encrypted content
  const encrypted = buffer.subarray(metaEnd);

  // 5. Key (SHA256 hash of password)
  const key = crypto.createHash("sha256").update(password).digest();

  // 6. Decrypt
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return { decrypted, meta };
}

function decryptNoMeta(buffer, password) {
  // buffer is a Node.js Buffer containing the file

  // 1. IV (16 bytes)
  const iv = buffer.subarray(0, 16);

  // 2. Encrypted content
  const encrypted = buffer.subarray(16);

  // 3. Key (SHA256 hash of password)
  const key = crypto.createHash("sha256").update(password).digest();

  // 4. Decrypt
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}
export function createTempFile(file) {
  file += ".aba"
  const filename = path.join(baseNotesPath,file)
  let filebuffer = false;
  try { 
    filebuffer = fs.readFileSync(filename)
  } catch {
    filebuffer = null
  }
  let result = {}
  if (filebuffer) {
    result = decrypt(filebuffer,"aba1234")
  } else {
    result = {failed: true}
  }
  if (!result["failed"]) {
    let randomFolder = crypto.randomUUID()
    let randomPath = path.join(TempPath,randomFolder)
    fs.mkdirSync(randomPath)
    let file = path.join(randomPath, "file")
    let writeFile = fs.writeFileSync(file,result["decrypted"])
    return {filename: file, meta: result["meta"]}
  } else {
    return false
  }
}

export async function getRecentJson() {
  try {
    let file = fs.readFileSync(recentsJSON)
    return file.toString()
  } catch {
    return "[]"
  }
}

export async function saveRecentJson(stringJSON) {
  writeFileSync(recentsJSON,stringJSON)
}

export async function loadBankData(uuid) {
  const file = path.join(baseBanksPath,`${uuid}.ababank`)
  try {
    const data = readFileSync(file)
    const decoded = decryptNoMeta(data,"aba123").toString()
    const bank = JSON.parse(decoded)
    return bank
  } catch (e) {
    console.log("Error loading test"+e)
    return false
  }
}

export async function writeTestToDisk(uuid,name,data) {
  try {
    const folderPath = path.join(baseOfflineTestsPath,uuid,name.toString())
    mkdirSync(folderPath, { recursive: true });
    const filePath = path.join(folderPath,"questions.json")
    writeFileSync(filePath,data)
    return true
  } catch (e) {
    console.error("Error while saving test: "+e)
  }
}

export async function getTestQuestion(uuid,name) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,name.toString(),"questions.json")
    return readFileSync(filePath).toString()
  } catch (e) {
    console.error("An Error while getting questions: "+e)
    return false
  }
}

export function readTestVariable(uuid,location,name) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,location,`variable-${name}`)
    return readFileSync(filePath).toString()
  } catch (e) {
    console.error(`An Error while getting stest variable ${name}: ${e}`)
    return ""
  }
}

export function writeTestVariable(uuid,location,name,content) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,location,`variable-${name}`)
    content = content + ""
    return writeFileSync(filePath,content)
  } catch (e) {
    console.error(`An Error while setting test ariable ${name}: ${e}`)
    return ""
  }
}

export function getTestResult(uuid,location) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,location,"results.json")
    return readFileSync(filePath).toString()
  } catch (e) {
    console.error("An Error while getting test results: "+e)
    return false
  }
}

export function writeTestResult(uuid,location,data) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,location,"results.json")
    writeFileSync(filePath,data)
    return true
  } catch (e) {
    console.error("An Error while saving test results: "+e)
    return false
  }
}


export function writeTestSubmission(uuid,location,data) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,location,"submit.json")
    writeFileSync(filePath,data)
    return true
  } catch (e) {
    console.error("An Error while saving test results: "+e)
    return false
  }
}

export function getAllTestVariables(uuid,location) {
  const testPath = path.join(baseOfflineTestsPath,uuid,location)
  const main = readdirSync(testPath)
  const final = {}
  main.forEach(str => {
    if (str.includes("variable-")) {
      const filePath = path.join(testPath,str)
      const content = readFileSync(filePath).toString()
      const filename = str.replace("variable-","")
      final[filename] = content
    }
  })
  return final
}

export function getAllOfflineTest(uuid,location) {
  const final = {}
  const main = readdirSync(baseOfflineTestsPath)
  main.forEach(folder => {
    const folderPath = path.join(baseOfflineTestsPath,folder)
    const sub = readdirSync(folderPath)
    if (sub.length > 0) {
      final[folder] = sub
    }
  })
  return final
}

export function saveFinalTestResult(uuid,location,data) {
  try {
    const filePath = path.join(baseOfflineTestsPath,uuid,location,"final_result.json")
    writeFileSync(filePath,data)
    return true
  } catch  (e) {
    console.error("An Error while saving final test result: "+e)
    return false
  }
}

export function getFinalTestResult(uuid,location) {
  try {
    location = location + ""
    const filePath = path.join(baseOfflineTestsPath,uuid,location,"final_result.json")
    return readFileSync(filePath).toString()
  } catch  (e) {
    console.error("An Error while getting final test result: "+e)
    return false
  }
}