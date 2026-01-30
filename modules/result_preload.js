const { contextBridge } = require('electron')

function getResultData() {
  let fvalue = -1
  process.argv.forEach((value,i) => {
    if (value.includes("result")) {
      fvalue = i
    }
  })
  if (fvalue !==  -1) {
    return process.argv[fvalue]
  } else {
    return false
  }
}

function getTestData() {
  let fvalue = -1
  process.argv.forEach((value,i) => {
    if (value.includes("data")) {
      fvalue = i
    }
  })
  if (fvalue !==  -1) {
    return process.argv[fvalue]
  } else {
    return false
  }
}

 

contextBridge.exposeInMainWorld('test', {
  result: () => getResultData(),
  data: () => getTestData()
})

contextBridge.exposeInMainWorld('runtime', {
  type: () => "node"
})
