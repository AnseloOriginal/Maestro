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