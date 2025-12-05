import os from "node:os"
import path from "path"
import * as api from "./api.js"
import {createWriteStream, accessSync} from "node:fs";
import { copyFile, rm, constants, stat, writeFile } from 'node:fs/promises';

let reporter;
const downloadList = new Map()
export const downloadQueue = []
let process = "idle"
const TempPath = path.join(os.homedir(),"Appdata","Roaming","ABA","temp")
const baseNotesPath = path.join(os.homedir(),"Appdata","Roaming","ABA","files","notes")

export function setReporter(method) {
  reporter = method
}

async function downloadFile(filename) {
  const response = await getDownloadResource(filename)
  if (!response.ok) {console.log("Server responded with "+response.status + " for "+filename)}
  const realname = downloadList.get(filename)
  const totalLength = response.headers.get('content-length');
  const fileStream = createWriteStream(path.join(TempPath,realname));
  let received = 0;
  // response.body is a ReadableStream
  for await (const chunk of response.body) {
    received += chunk.length;
    fileStream.write(chunk);
  }
  fileStream.end();
  return {
    ok: response.ok,
    filename,
    totalLength,
    received
  }
}

function convertToServerName(filename) {
  const Map = {
    "jss1": 7,
    "jss2": 8,
    "jss3": 9,
    "sss1": 10,
    "sss2": 11,
    "sss3": 12,
  }
  const csv = filename.split(" ")
  const term = csv[0]
  const subclass = Map[csv[1].toLowerCase()]
  csv.shift()
  csv.shift()
  const rem = csv.join(" ")
  return `notes,${term},${subclass},${rem}.aba`
}

async function getDownloadResource(name) {
  const serverFileName = convertToServerName(name)
  const message = {file: serverFileName}
  const result = await fetch(api.getFilesDownload(), {
    method: "POST",
    body: new URLSearchParams(message)
  })
  console.log(result.status)
  return result
}

export function addDownload(filename) {
  if (!downloadList.has(filename)){
    const tempfile = crypto.randomUUID()
    downloadList.set(filename,tempfile)
    downloadQueue.push(filename)
    downloadRuntime("start")
  }
  return true
}

async function moveDownload(filename) {
  let desfile =  filename + ".aba"
  let tempfile = downloadList.get(filename)
  tempfile = path.join(TempPath,tempfile)
  desfile = path.join(baseNotesPath,desfile)
  try {
    await writeFile(desfile,"Write")
    await copyFile(tempfile, desfile)
    await rm(tempfile)
    console.log(`${tempfile} was moved to ${desfile}`);
    return {ok:true,filename}
  } catch {
    console.error('The file could not be copied');
    return {ok:false,filename}
  }
}

async function trashDownload(filename) {
  let tempfile = downloadList.get(filename) 
  tempfile = path.join(TempPath,tempfile)
  try {
    await rm(tempfile)
    console.log('Temporary file deleted');
    return {ok:true,filename}
  } catch {
    console.error('Temporary file could not be');
    return {ok:false,filename}
  }
}

function downloadRuntime(meth,target) {
  if (process==="idle" && meth === "start" && downloadQueue[0]) {
    process = "working"
    downloadFile(downloadQueue[0])
    .then(response => {
      if (response.ok && (response.received == response.totalLength) && response.received > 0) {
        completeDownload("complete",response.filename)
        return moveDownload(response.filename)
      } else {
        completeDownload("failed",response.filename)
        return trashDownload(response.filename)
      }
    })
    .then(response =>{
      downloadList.delete(response.filename)
      downloadQueue.shift()
      process = "idle"
      if (downloadQueue.length > 0){downloadRuntime("start")}
    }) 
  }
}

function completeDownload(status,download) {
  if (reporter) {
    reporter("note-download-complete",{status,download})
  } else {
    console.warn("[Downloader] Attempt to use reporter before initialization")
  }
}