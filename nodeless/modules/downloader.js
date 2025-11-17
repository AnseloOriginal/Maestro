import * as api from "./api.js"
import * as WebFS from './web-fs.js';

const downloadList = new Map()
export const downloadQueue = []
let process = "idle"


async function downloadFile(filename) {
  const response = await getDownloadResource(filename)
  
  const realname = downloadList.get(filename)
  const totalLength = response.headers.get('content-length');
  const blob = await response.blob()
  const tmpname = await WebFS.createFile("temp",realname,blob)
  console.log(`Downloader: File dowloaded to ${tmpname}`,blob,`File Temporary Name: ${realname}` )
  
  return {
    ok: response.ok,
    filename,
    totalLength,
    received: totalLength
  }
}

async function getDownloadResource(name) {
  const message = {file: name}
  const result = await fetch(api.getFilesDownload(), {
    method: "POST",
    body: new URLSearchParams(message)
  })
  return result
}

export function addDownload(filename) {
  if (!downloadList.has(filename)){
    const tempfile = crypto.randomUUID()
    downloadList.set(filename,tempfile)
    downloadQueue.push(filename)
    console.log(`Downloader: Queue Added ${filename} for temp ${tempfile}`)
    downloadRuntime("start")
  }
  return true
}

async function moveDownload(filename) {
  let desfile =  filename
  let tempfile = downloadList.get(filename)
  const moved = await WebFS.moveFile("temp","notes",tempfile)
  const renamed = await WebFS.renameFile("notes",tempfile,desfile)
  console.log(`Downloader: Attempted Moving ${tempfile}, Moved:${moved}, Renamed ${renamed}`)
  return {ok:true,filename}
}

async function trashDownload(filename) {
  let tempfile = downloadList.get(filename) 
  WebFS.deleteFile("temp",tempfile)
  console.log(`Downloader: Attempted Trashing`)
  return {ok:true,filename}
}

function downloadRuntime(meth,target) {
  if (process==="idle" && meth === "start" && downloadQueue[0]) {
    process = "working"
    downloadFile(downloadQueue[0])
    .then(response => {
      if (response.ok && (response.received == response.totalLength) && response.received > 0) {
        return moveDownload(response.filename)
      } else {
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
