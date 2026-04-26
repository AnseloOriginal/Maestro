import * as widgets from "./../apis/classes/widget.js"
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

export function addWidgets(content) {
  const widgetSpace = document.createElement("div")
  widgetSpace.classList = "widget-container"
  const dateWidget = new widgets.DateWidget()
  dateWidget.mainDom.classList = "widget-dashboard"
  widgetSpace.append(dateWidget.mainDom)
  const timeWidget = new widgets.TimeWidget()
  timeWidget.mainDom.classList = "widget-dashboard"
  widgetSpace.append(timeWidget.mainDom)
  if (localStorage.getItem("Last-Known-Version")) {
    const ver = "v"+localStorage.getItem("Last-Known-Version")
    const versionWidget = new widgets.VersionWidget(ver)
    versionWidget.mainDom.classList = "widget-dashboard"
    widgetSpace.append(versionWidget.mainDom)
  }
  content.append(widgetSpace)
}