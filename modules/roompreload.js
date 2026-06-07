const { contextBridge, ipcRenderer } = require('electron')
function getClientInfo() {
  let fvalue = -1
  process.argv.forEach((value,i) => {
    if (value.includes("roomisclient")) {
      fvalue = i
    }
  })
  if (fvalue !==  -1) {
    if (process.argv[fvalue] === "--roomisclient=true") {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

function findArgContent(content) {
  let found = false
  process.argv.forEach(arg => {
    if (arg.includes(content)) {found = true}
  })
  return found
}

function getArgContent(arg,justFind) {
  let fvalue = -1
  process.argv.forEach((value,i) => {
    if (value.includes(arg)) {
      fvalue = i
    }
  })
  if (fvalue ===  -1) {
    return false
  }
  const value = process.argv[fvalue].replace("--"+arg+"=","")
  const returnValue = justFind ? true : value
  return returnValue
}

contextBridge.exposeInMainWorld('main', {
  isClient: () => findArgContent("thisisclient"),
  newWindow: (type,resid)  => ipcRenderer.invoke("room-new-window",type,resid)
})

contextBridge.exposeInMainWorld('res', {
  type: () => getArgContent("restype"),
  id: ()  => getArgContent("resid")
})

contextBridge.exposeInMainWorld('media', {
  library: () => ipcRenderer.invoke("room-media-library"),
  toImageURL: (id) => ipcRenderer.invoke("room-media-image",id),
  toVideoURL: (id) => ipcRenderer.invoke("room-media-video",id),
})