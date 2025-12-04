const sumbitBtn = document.getElementById("submit-button")
const username = document.getElementById("username-input")
const password = document.getElementById("password-input")

sumbitBtn.onclick  = async () => {
  const result = await window.runtime.submitServerAction("fgp",username.value,password.value)
}

function checkValidity() {
  if (username.value!=="" && password.value.length > 4 ) {
    sumbitBtn.disabled = false
  } else {
    sumbitBtn.disabled = true
  }
}

checkValidity()

username.oninput = checkValidity
password.oninput = checkValidity