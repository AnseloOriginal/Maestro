export  function generate_test_topbar(content,userinfo,duration) {
  let name = "User"
  if (userinfo) {
    name = userinfo.firstname
    console.log(userinfo)
  }
  content.innerHTML = `
  <div class="test-interface-grid">
    <div class = "test-interface-userinfo-container">
      <div class = "test-interface-userinfo">
        <span class="test-interface-icon" title="user">account_circle</span>
        <p class="test-interface-user-name"> ${name} </p>
      </div>
    </div>
    <div class="test-interface-usertools">
      <button class="test-interface-butn test-interface-submit"> Submit </button> 
      <button class="test-interface-butn test-interface-abort"> Abort </button>
    </div>
    <div class="test-interface-time-container">
    <div class="test-interface-time">
      <p> ${time(duration,"hour")} </p>:
      <p> ${time(duration,"minute")} </p>:
      <p> ${time(duration,"second")} </p>
    </div>
    </div>
    <dialog class="test-interface-dialog">
      <button> SS </button>
    </dialog>
  </div>
  `
}

export function regenerate_time_display(duration) {
  const obj = document.querySelector(".test-interface-time")
  if (obj) {
    obj.innerHTML = `
      <p> ${time(duration,"hour")} </p>:
      <p> ${time(duration,"minute")} </p>:
      <p> ${time(duration,"second")} </p>
    `
  }
}
export function generate_test_mainpage(
  content,schedule,old,special,setupButnClick,startButnClick,
  offlineTestData
) {
  const maincontainer = document.createElement("div")
  const subcontainer1 = document.createElement("div")
  maincontainer.setAttribute("class","test-mainpage-maincontainer")
  const scheduled = generate_test_scheduled(schedule,startButnClick)
  const config = generate_test_config(setupButnClick,offlineTestData,startButnClick)
  const oldtest = generate_test_oldtests(old,special,startButnClick)
  maincontainer.append(scheduled, config, oldtest)
  content.append(maincontainer)
}

function generate_test_scheduled(scheduled,startButnClick) {
  const maindiv = document.createElement("div")
  maindiv.setAttribute("class","test-mainpage-scheduled test-mainpage-maindiv")
  const header = generate_test_maindiv_header("Scheduled")
  const contentDiv = document.createElement("p")
  if (scheduled) {
    scheduled.forEach(test => {
      const div = document.createElement('div')
      const p = document.createElement("p")
      p.innerText = test[0]
      const butn = document.createElement("button")
      butn.onclick = (evt) => startButnClick(evt,test[1],test[0],"scheduled",false)
      butn.innerText = "Start"
      div.append(p,butn)
      contentDiv.append(div)
    });
  } else {
    contentDiv.innerText = "No Schedule Test"
  }
  maindiv.append(header, contentDiv)
  return maindiv
}

function generate_test_config(setupButnClick,testdata,startButnClick) {
  const maindiv = document.createElement("div")
  maindiv.setAttribute("class","test-mainpage-config test-mainpage-maindiv")
  const header = generate_test_maindiv_header("New Test")
  const contentDiv = document.createElement('div')
  contentDiv.innerHTML = `
  <div> <p> Exam Source </p> <select id="configbankselection"> </select> </div>
  <div> <p> Category </p> <select id="configcategoriesselection"> </select> </div>
  <div> <p> Arrangement </p> <select id="configarrangementselection">
    <option value="order" >Ordered</option>
    <option value="random" >Random</option>
  </select></div>
  <div> <p> No of Questions </p> <input type='number' min="1" id="confignoofquestions" value="10"> </div>
  <div> <p> Duration </p> <input type='number' min="1" max="600" placeholder='Minutes' id="configduration" value="5"> </div>
  `
  prepare_config_options(contentDiv,testdata)
  const buttonDiv = document.createElement('div')
  buttonDiv.innerHTML = `
  <button> Reset </button>
  <button id='testmainpage-start-button'> Start </button>
  <button id='testmainpage-setup-button'> Setup </button>`
  const button = buttonDiv.querySelector("#testmainpage-setup-button")
  if (button) {
    button.onclick = setupButnClick
  }
  const button2 = buttonDiv.querySelector("#testmainpage-start-button")
   if (button2) {

    button2.onclick = (evt) => startButnClick(evt,0,0,0,true)
   }

  maindiv.append(header, contentDiv, buttonDiv)
  return maindiv
}

function prepare_config_options(container,data) {
  const bankSelection = container.querySelector("#configbankselection")
  const bankCategories = container.querySelector("#configcategoriesselection")
  if (data) {
    let isFirst = true
    for(const [uuid,bank] of Object.entries(data)) {
      const option = document.createElement("option")
      option.label = bank[0]
      option.value = bank[1]
      bankSelection.add(option)
      bankSelection.onchange = (evt) => helper_config_options_categories(data,bankCategories,evt.target.value)
      if (isFirst) {
        helper_config_options_categories(data,bankCategories,uuid)
        isFirst = false
      }
    }
  }
}

function helper_config_options_categories(data,categories,uuid) {
  if (data[uuid][2]?.categories) {
    categories.innerHTML = ""
    const option = document.createElement("option")
    option.label = "All"
    option.value = "-1"
    categories.add(option)
    data[uuid][2].categories.forEach(category => {
      const option = document.createElement("option")
      option.label = category[0]
      option.value = category[1]
      categories.add(option)
    })
  }
}
function generate_test_oldtests(old,special,startButnClick) {
  const maindiv = document.createElement("div")
  maindiv.setAttribute("class","test-mainpage-oldtest test-mainpage-maindiv")
  const header = generate_test_maindiv_header("Previous Test")
  maindiv.append(header)
  let genold,genspe
  if (special) {
    const specialDiv = document.createElement("div")
    const specialHeader = generate_test_maindiv_subheader("Special Test")
    specialDiv.append(specialHeader)
    special.forEach(test => {
      const div = document.createElement('div')
      const p = document.createElement("p")
      p.innerText = test[0]
      const butn = document.createElement("button")
      butn.onclick = (evt) => startButnClick(evt,test[1],test[0],"special",false)
      butn.innerText = "Start"
      div.append(p,butn)
      specialDiv.append(div)      
    });
    maindiv.append(specialDiv)
    genspe = true
  }
  if (old) {
    genold = true
    const contentDiv = document.createElement("div")
    contentDiv.append(generate_test_maindiv_subheader("Incomplete Tests"))
    old.forEach(test => {
      const div = document.createElement('div')
      div.setAttribute("class","test-mainDiv-largerbutn")
      const p = document.createElement("p")
      p.innerText = test[0]
      const butn = document.createElement("button")
      butn.innerText = "Continue"
      butn.onclick = (evt) => startButnClick(evt,test[1],test[3],test[2],true,true)
      const butn2 = document.createElement("button")
      butn2.innerText = "Discard"
      div.append(p,butn,butn2)
      contentDiv.append(div)
    })
    maindiv.append(contentDiv)
  }
  if (!genold && !genspe) {
    const contentDiv = document.createElement("div")
    contentDiv.innerText("No Test Here")
    maindiv.append(contentDiv)
  }
  return maindiv
}

function generate_test_maindiv_header(name) {
  const header = document.createElement("div")
  header.setAttribute("class","test-mainpage-headers")
  header.innerText = name
  return header
}

function generate_test_maindiv_subheader(name) {
  const header = document.createElement("p")
  header.setAttribute("class","test-mainpage-subheaders")
  header.innerText = name
  return header
}

export function rerender_test_config(existing,all,deleteFunc,installFunc) {
  const configDiv = document.querySelector(".test-mainpage-config")
  if (configDiv) {
    configDiv.innerHTML = ""
    const existDiv = generateConfigContainer(existing,"Downloaded","Delete",deleteFunc)
    const existUUIDs = extractUUIDs(existing)
    const allUUIDs = extractUUIDs(all)
    const notExisting = []
    
    allUUIDs.forEach((uuid,i) => {
      if (!existUUIDs.includes(uuid)) {
        notExisting.push(all[i])
      }
    })
    const notExistingDiv = generateConfigContainer(notExisting,"Available","Install",installFunc)
    configDiv.append(existDiv,notExistingDiv)
  }
}

function generateConfigContainer(list,headername,butnname,func) {
  const existDiv = document.createElement('div')
  const header = document.createElement('p')
  header.className = "test-mainpage-config-container-header"
  header.innerText = headername || "Header"
  existDiv.append(header)
  list.forEach(data => {
    const line = document.createElement('div')
    line.className = "test-mainpage-config-container"
    const text = document.createElement('p')
    text.innerText = data[0]
    text.className = "test-mainpage-config-text"
    const button = document.createElement('button')
    button.innerText = butnname || "button"
    button.className = "test-mainpage-config-butn"
    if (func) {
      button.onclick = (evt) => func(evt,data[1])
    }
    line.append(text, button)
    existDiv.append(line)
  })
  return existDiv
}

function extractUUIDs(array) {
  const list = []
  array.forEach(data => {
    if (data[1]) {
      list.push(data[1])
    }
  })
  return list
}
function time(duration,target) {
  let result = 0
  if (target === "second") {
    result = duration % 60
  } else if (target === "minute") {
    result = Math.floor(duration/60) % 60
  } else if (target === "hour") {
    result = Math.floor(duration / 3600)
  }
  if (result >= 10) {
    return result
  } else {
    return "0"+result //This is bad but needed
  }
}

export function render_confirm_submit_test(dialog) {
  dialog.innerHTML = `
  <p> Do you want to finish the exam <p>
  <div>
    <button class=testing-dialog-yes> Yes </button>
    <button class=testing-dialog-no> Return Back </button>
  </div>`
}

export function render_confirm_end_test(dialog) {
  dialog.innerHTML = `
  <p> Do you want to end the exam (irreversible)<p>
  <div>
    <button class=testing-dialog-yes> Yes </button>
    <button class=testing-dialog-no> Return Back </button>
  </div>`
}