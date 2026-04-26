export function generate_alert(elem,type,textCSS) {
  elem.style.display = "block"
  if (type === "disabled") {
    elem.innerHTML = `
    <p class="${textCSS}"> Account Disabled </h1>
    `
  } else if((type === "unverified")) {
    elem.innerHTML = `
    <p class="${textCSS}">Non-verified Account</h1>
    `
  } else if((type === "failed")) {
    elem.innerHTML = `
    <p class="${textCSS}">No Session, Contact Support</h1>
    `
  } else if((type === "offline")) {
    elem.innerHTML = `
    <p class="${textCSS}"> Offline mode</h1>
    `
  } else {
    elem.innerHTML = ""
    elem.style.display = "none"
  }
}