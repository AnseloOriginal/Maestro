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
  </div>
  `
}

export function generate_test_mainpage(content,schedule,old,special,setupButnClick) {
  const maincontainer = document.createElement("div")
  const subcontainer1 = document.createElement("div")
  maincontainer.setAttribute("class","test-mainpage-maincontainer")
  const scheduled = generate_test_scheduled(schedule)
  const config = generate_test_config(setupButnClick)
  const oldtest = generate_test_oldtests(old,special)
  maincontainer.append(scheduled, config, oldtest)
  content.append(maincontainer)
}

function generate_test_scheduled(scheduled) {
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

function generate_test_config(setupButnClick) {
  const maindiv = document.createElement("div")
  maindiv.setAttribute("class","test-mainpage-config test-mainpage-maindiv")
  const header = generate_test_maindiv_header("New Test")
  const contentDiv = document.createElement('div')
  contentDiv.innerHTML = `
  <div> <p> Select Subject </p> <select> </select> </div>
  <div> <p> Select Bank </p> <select> </select> </div>
  <div> <p> Exam Type </p> <select> </select> </div>
  `
  const buttonDiv = document.createElement('div')
  buttonDiv.innerHTML = `
  <button> Reset </button>
  <button> Start </button>
  <button id='testmainpage-setup-button'> Setup </button>`
  const button = buttonDiv.querySelector("#testmainpage-setup-button")
  if (button) {
    button.onclick = setupButnClick
  }
  console.log(button)
  maindiv.append(header, contentDiv, buttonDiv)
  return maindiv
}

function generate_test_oldtests(old,special) {
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