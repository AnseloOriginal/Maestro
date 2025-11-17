const username = document.getElementById("username-input")
const password = document.getElementById("password-input")
const error = document.getElementById("error")
const logonButton = document.getElementById("logon-button")
const dialog_process = document.getElementById("form-dialog-process")
const dialog_process_text = document.getElementById("form-dialog-process-text")
const dialog_process_img = document.getElementById("form-dialog-process-img")
const dialog_process_butn = document.getElementById("form-dialog-process-button")
const show_password = document.getElementById("show-password")
dialog_process_butn.style.display = "none" // hides the button at the beginning

function checkValidity() {
  if (username.value!=="" && password.value.length > 4 ) {
    logonButton.disabled = false
  } else {
    logonButton.disabled = true
  }
}

checkValidity()

document.getElementById("logon-button").onclick = async () => {
  let uservalue = username.value
  let passvalue = password.value
  dialog_process.showModal()
  //console.log(window.runtime.login())
  //console.log(uservalue,passvalue)
  const response = await window.runtime.login(uservalue,passvalue)
  console.log(response)
  if (response[0] === 0) {
    dialog_process_img.setAttribute('src', "images/success.png")
    dialog_process_text.innerText = "Successfull"
    setTimeout(() => {window.location.href = "dashboard.html"}, 1000)
  } else {
    if (response[2]) {console.log(response[2]) }
    dialog_process_text.innerText = response[1]
    dialog_process_img.setAttribute('src', "images/error.png")
    dialog_process_butn.style.display = "inline"
  }
}

username.oninput = checkValidity
password.oninput = checkValidity

dialog_process.addEventListener('cancel', event => {
  event.preventDefault(); // Stops the Esc key from closing the dialog
});

dialog_process.onclose = () => {
  dialog_process_butn.style.display = "none"
}

dialog_process_butn.onclick = () => {
  dialog_process.close()
} 

show_password.onchange = () => {
  if (show_password.checked) {
    password.setAttribute("type","text")
  } else {
    password.setAttribute("type","password")
  }
}