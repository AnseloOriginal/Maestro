const { contextBridge } = require('electron')

function getFilePath() {
  let fvalue = -1
  process.argv.forEach((value,i) => {
    if (value.includes("fvfilepath")) {
      fvalue = i
    }
  })
  if (fvalue !==  -1) {
    return process.argv[fvalue]
  } else {
    return false
  }
}

function getFileName() {
  let fvalue = -1
  process.argv.forEach((value,i) => {
    if (value.includes("fvfilename")) {
      fvalue = i
    }
  })
  if (fvalue !==  -1) {
    return process.argv[fvalue]
  } else {
    return false
  }
}



contextBridge.exposeInMainWorld('fs', {
  file: () => getFilePath(),
  name: () => getFileName()
})

contextBridge.exposeInMainWorld('runtime', {
  type: () => "node"
})
