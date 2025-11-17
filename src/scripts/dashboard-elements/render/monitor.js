export function generate_monitor(page,userlist,hook) {
  page.innerHTML = ""
  for (const [username, devices] of Object.entries(userlist)) {
    const userDiv = generate_monitor_user(username,devices)
    page.appendChild(userDiv)
  }
  hookScripts(hook)
}

function generate_monitor_user(username,devices) {
  const userMainDiv = document.createElement('div')
  userMainDiv.setAttribute("class","monitor-user")
  const userUpperDiv = document.createElement('div')
  userUpperDiv.innerHTML = 
  `
  <p class="monitor-user-name">${username}<p>`
  const userLowerDiv = document.createElement('div')
  userLowerDiv.setAttribute("class","monitor-user-lower")
  userUpperDiv.setAttribute("class","monitor-user-upper")
  const headerDiv = document.createElement('div')
  headerDiv.setAttribute("class","monitor-device monitor-device-header")
  headerDiv.innerHTML = 
  `<p class="monitor-device-header-name">Devices</p>
    <p class="monitor-device-header-app">App</p>
    <p class="monitor-device-header-lock"}>Locked</p>`
  userLowerDiv.appendChild(headerDiv);
  devices.forEach(device => { 
    let id = username + device['device_name']
    const deviceDiv = generate_monitor_device(device['device_name'],device['app'],id)
    deviceDiv.id = id
    deviceDiv.setAttribute("class","monitor-device")
    deviceDiv.setAttribute("name","monitor-device")
    userLowerDiv.appendChild(deviceDiv);
  });
  userMainDiv.appendChild(userUpperDiv);
  userMainDiv.appendChild(userLowerDiv);
  return userMainDiv;
}

function generate_monitor_device(name,app,id) {
  const deviceDiv = document.createElement('div')
  deviceDiv.innerHTML = 
  `
  <p class="monitor-device-entities monitor-device-name" id="${id} device name">${name}</p>
  <p class="monitor-device-entities monitor-device-app" id="${id} device app">${app}</p>
  <buttton class="monitor-device-entities monitor-device-lock" id="${id} device lock">
    <span class="material-symbols-outlined menu-butn-icon monitor-device-lock-icon">lock</span>
  </button>
  `
  return deviceDiv
}

function hookScripts(hook) {
  let devices = document.getElementsByName("monitor-device")
  devices.forEach((device) => {
    const id = device.id
    const entities = device.getElementsByClassName("monitor-device-entities")
    let DevName,DevApp,DevLock
    for(let i=0; i<entities.length; i++) {
      if (entities[i].id === id+" device name") { DevName = entities[i]}
      if (entities[i].id === id+" device app") { DevApp = entities[i]}
      if (entities[i].id === id+" device lock") { DevLock = entities[i]}
    }
    if (DevApp && DevLock && DevName) {
      DevLock.onclick = () => {
        hook("monitor-shuffle",{id, app: DevApp.innerText})
      }
     }
  })
}

export function refreshUI(updateArray) {
  updateArray.forEach(updateInstance => {
    const device = document.getElementById(updateInstance[0])
    if (device) {
      const id = device.id
      const entities = device.getElementsByClassName("monitor-device-entities")
      let DevName,DevApp,DevLock
      for(let i=0; i<entities.length; i++) {
        if (entities[i].id === id+" device name") { DevName = entities[i]}
        if (entities[i].id === id+" device app") { DevApp = entities[i]}
        if (entities[i].id === id+" device lock") { DevLock = entities[i]}
      }
      if (DevApp && DevLock && DevName) {
        if (updateInstance[1] == 0) { 
          //Means user has isn't in watchlist
          //DevLock.setAttribute("class","monitor-device-entities monitor-device-lock")
          DevApp.style.color = "black"
        } else if (updateInstance[1] == 1){
          //Means user has is in watchlist and hasn't violated rules
          //DevLock.setAttribute("class","monitor-device-entities monitor-device-lock")
          DevApp.style.color = "green"   
        } else {
          //Means user has isn't in watchlist and has violated rules
          //DevLock.setAttribute("class","monitor-device-entities monitor-device-lock")
          DevApp.style.color = "red"    
        }
      }
    }
  })
}