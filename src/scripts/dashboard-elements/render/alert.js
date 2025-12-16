export function generate_alert(page,type,textCSS) {
  page.style.display = "block"
  if (type === "disabled") {
    page.innerHTML = `
    <p class="${textCSS}"> Account Disabled </h1>
    `
  } else if((type === "unverified")) {
    page.innerHTML = `
    <p class="${textCSS}">Non-verified Account</h1>
    `
  } else if((type === "failed")) {
    page.innerHTML = `
    <p class="${textCSS}">No Session, Contact Support</h1>
    `
  } else if((type === "offline")) {
    page.innerHTML = `
    <p class="${textCSS}"> Offline mode</h1>
    `
  } else {
    page.innerHTML = ""
    page.style.display = "none"
  }
}