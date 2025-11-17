
const watchList = new Map()

const beingWatched = (key) => watchList.has(key);

const addWatched = (key,app) => watchList.set(key,{app, violated:false});

const removeWatched = (key) => watchList.delete(key);

const clearWatchList = () => watchList.clear();

const watchRuntime = (userlist) => {
for (const [username, devices] of Object.entries(userlist)) {
  devices.forEach((device) =>{
    const key = username+device['device_name']
    const app = device.app
    if (beingWatched(key)) {
      const watchFile = watchList.get(key)
      if (watchFile.app !== app) {
        //console.log(`${username} changed app from ${watchFile.app} to ${app}`)
        if (watchFile.violated === false) {
          watchFile.violated = true
          console.log(`Notify: ${username} changed app from ${watchFile.app} to ${app}`)
        } 
      }
  }
  })
}
} 

const enabled = () => {
  if (watchList.size > 0) {
    return true
  } else {
    return false
  }
}

const watched = () => {
  const final = []
  watchList.forEach((value,key) =>{
    if (value.violated) {
      final.push([key, 2])
    } else {
      final.push([key, 1])
    }
  })
  return final
}

export default {
  addWatched,
  beingWatched,
  removeWatched,
  clearWatchList,
  watchRuntime,
  enabled,
  watched
}
