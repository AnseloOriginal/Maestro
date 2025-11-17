let usertype = "student"
const create_btn = document.getElementById("new-button")
const username = document.getElementById("username-input")
const surname = document.getElementById("surname-input")
const firstname = document.getElementById("firstname-input")
const othername = document.getElementById("othername-input")
const password = document.getElementById("password-input")
const stu_class = document.getElementById("student-class-input")
const work_type = document.getElementById("worker-type-input")
const ver_password = document.getElementById("ver-password-input")
const username_error = document.getElementById("username-error")
const surname_error = document.getElementById("surname-error")
const firstname_error = document.getElementById("firstname-error")
const othername_error = document.getElementById("othername-error")
const password_error = document.getElementById("password-error")
const ver_password_error = document.getElementById("ver-password-error")
const dialog_process = document.getElementById("form-dialog-process")
const dialog_process_text = document.getElementById("form-dialog-process-text")
const dialog_process_img = document.getElementById("form-dialog-process-img")
const dialog_process_butn = document.getElementById("form-dialog-process-button")
const switch_student = document.getElementById("switch-student")
const switch_worker = document.getElementById("switch-worker")
const show_password = document.getElementById("show-password")
dialog_process_butn.style.display = "none" // hides the button at the beginning

console.log(work_type)
async function initiate() {
  dialog_process.showModal()
  const message = {
    username: username.value,
    password: password.value,
    lastname: surname.value,
    firstname: firstname.value,
    othername: othername.value,
    stuclass: stu_class.value,
    workername: work_type.value,
    usertype
  }
  const response = await window.runtime.createNewAccount(message)
  console.log(response)
  if (response[0] === 0) {
    dialog_process_img.setAttribute('src', "images/success.png")
    dialog_process_text.innerText = "Successfull"
    setTimeout(() => {window.location.href = "login.html"}, 1000)
  } else {
    if (response[2]) {console.log(response[2]) }
    dialog_process_text.innerText = response[1]
    dialog_process_img.setAttribute('src', "images/error.png")
    dialog_process_butn.style.display = "inline"
  }
}

function switcher(type) {
  if (type === "student") {
    document.getElementById("worker-type").style.display = "none"
    document.getElementById("student-class").style.display = "inline-block"
    switch_student.setAttribute("class","new-type-button-active")
    switch_worker.setAttribute("class","new-type-button-inactive")
    
  } else if (type === "worker") {
    document.getElementById("student-class").style.display = "none"
    document.getElementById("worker-type").style.display = "inline-block"
    switch_student.setAttribute("class","new-type-button-inactive") 
    switch_worker.setAttribute("class","new-type-button-active") 
  }
  usertype = type
}

function BulkCheck(){
  let val = true
  let size = [4,15]
  let phase = []
  phase[0] = Checker(username,size,username_error,"str-check")
  phase[1] = Checker(firstname,size,firstname_error,"str-check")
  phase[2] = Checker(surname,size,surname_error,"str-check")
  phase[3] = Checker(othername,size,othername_error,"str-check")
  phase[4] = Checker(password,[4],password_error,"pass-check")
  phase[5] = Checker(ver_password,[password],ver_password_error,"same-check")
  phase.forEach(element => {
    if (!element) {
      val = false
    }
  });
  return val
}

function Checker(input,check,output,type){
  const value = input.value
  if (type === "str-check") {
    let test = /\W/
    if (value.length < check[0]) {
      output.innerText = "Text Too Short"
      return false
    } else if (value.length > check[1]) {
      output.innerText = "Text Too Long"
      return false
    } else if (test.test(value)) {
      output.innerText = "Invalid character (Only A-Z,0-9)"
      return false
    }
  } else if (type === "pass-check") {
    if (value.length < check[0]) {
      output.innerText = "Weak password"
      return false
    }
  } else if (type === "same-check") {
    validation = check[0].value
    if (value !== validation) {
      output.innerText = "Does not match"
      return false
    }
  }
  output.innerText = ""
  return true
}

switcher("student")
switch_student.onclick = () => {switcher("student")}
switch_worker.onclick = () => {switcher("worker")}
create_btn.onclick = () => {
  let checks = BulkCheck()
  if (checks) { initiate() }
}

show_password.onchange = () => {
  if (show_password.checked) {
    password.setAttribute("type","text")
    ver_password.setAttribute("type","text")
  } else {
    password.setAttribute("type","password")
    ver_password.setAttribute("type","password")
  }
}

dialog_process.addEventListener('cancel', event => {
  event.preventDefault(); // Stops the Esc key from closing the dialog
});

dialog_process.onclose = () => {
  dialog_process_butn.style.display = "none"
  
}

dialog_process_butn.onclick = () => {
  dialog_process.close()
}