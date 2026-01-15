import * as api from "./api.js"
import * as fs from './filemanager.js';

const downloadList = new Map()
export const downloadQueue = []
let process = "idle"


async function downloadFile(filename) {
  const response = await getDownloadResource(filename)
  const ok =  response.status === 200
  const realname = downloadList.get(filename)
  const totalLength = parseInt(response.headers['Content-Length']);
  // const blob = await response.blob()
  const base64 = response.data
  const array = fs.base64ToArrayBuffer(base64)
  fs.dump(array)
  const tmpname = await fs.createFile("temp",realname,base64)
  console.log(`Downloader: File dowloaded to ${tmpname}`,array,`File Temporary Name: ${realname}` )
  
  const type = response.headers?.["aba-filetype"] || ""
  
  return {
    ok,
    filename,
    totalLength,
    received: totalLength,
    type
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
  let serverFileName = name.substr(1)
  if (name[0] !== "#") {serverFileName = convertToServerName(name)}
  const message = {file: serverFileName}
  let url = `${api.getFilesDownload()}?file=${serverFileName}`.replaceAll(" ","%20")
  console.log("URL: "+url)
  const options = {
    url,
    responseType: 'arraybuffer' 
  };
  const response = await Capacitor.Plugins.CapacitorHttp.get(options);
  // const result = await fetch(api.getFilesDownload(), {
  //   method: "POST",
  //   body: new URLSearchParams(message)
  // })
  return response
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

async function moveDownload(filename,type) {
  const known = ["note","bank"]
  if (!known.includes(type)) {type = "unknown"}
  const locations = {
    note: "notes",
    bank: "banks",
    unknown: "unknown"
  }
  const desfile =  filename
  const tempfile = downloadList.get(filename)//Gets temp name
  const moved = await fs.moveFile("temp",locations[type],tempfile) //Moves the temp file to notes dest
  console.log("Move process done")
  const renamed = await fs.renameFile(locations[type],tempfile,cleanfilename(desfile)) //Renames to real name
  console.log(`Downloader: Attempted Moving ${tempfile}, Moved:${moved}, Renamed ${renamed}`)
  return {ok:true,filename}
}

async function trashDownload(filename) {
  let tempfile = downloadList.get(filename) 
  fs.deleteFile("temp",tempfile)
  console.log(`Downloader: Attempted Trashing`)
  return {ok:true,filename}
}

function downloadRuntime(meth,target) {
  if (process==="idle" && meth === "start" && downloadQueue[0]) {
    process = "working"
    downloadFile(downloadQueue[0])
    .then(response => {
      console.log("Passed here")
      if (response.ok && (response.received == response.totalLength) && response.received > 0) {
        completeDownload("complete",response.filename)
        return moveDownload(response.filename,response.type)
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
  const event = new CustomEvent("note-download-complete", {
    detail: { status,download }
  });
  const result = document.dispatchEvent(event);
  //console.log("Sent Download Event",result)
}

function cleanfilename(str) {
  const dirt = ["#securebanks,"]
  dirt.forEach(e => {
    if (str.includes(e)) {
      str = str.replaceAll(e, "")
    }
  })
  return str
}