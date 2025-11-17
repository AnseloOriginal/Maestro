export function generate_main_dashboard(page,type,titleCSS,buttonCSS,headerCSS) {
  if (type === "worker") {
    page.innerHTML = `
    <h1 class="${titleCSS}"> Worker Dashboard</h1>
    <p> Use this app to access notes and monitor students<p>
    `
  } else if(type === "offline") {
    page.innerHTML = `
    <h1 class="${titleCSS}"> Offline Dashboard</h1>
    <p> Most features are unavaiable while offline. <p>
    `
  } else {
    page.innerHTML = `
    <h1 class="${titleCSS}"> Student Dashboard</h1>
    <p> Use this app to access notes. <p>
    `
  }
}