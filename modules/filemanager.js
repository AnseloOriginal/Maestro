import { mkdir, rmdir } from 'node:fs';
import { readdirSync, writeFileSync } from 'node:fs';
import {writeFile} from "node:fs";
import * as fs from "node:fs"
import os from 'node:os'
import path from 'node:path'
import crypto from "crypto";


const basePath = path.join(os.homedir(),"Appdata","Roaming","ABA")
const baseFilesPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files")
const baseNotesPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files","notes")
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
  mkdir(baseNotesPath, { recursive: true }, (err) => {
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