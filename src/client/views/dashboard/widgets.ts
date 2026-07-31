import * as widgets from "../../components/ui/widgets/widget.ts"

export class DashboardWidgets {
  root = document.createElement("div")
  constructor() {
    this.root.classList.add("widget-container")

    const dateWidget = new widgets.DateWidget()
    dateWidget.mainDom.classList.add("widget-dashboard")

    const timeWidget = new widgets.TimeWidget()
    timeWidget.mainDom.classList.add("widget-dashboard")
  
    this.root.append(
      dateWidget.mainDom,
      timeWidget.mainDom
    )
    if (localStorage.getItem("Last-Known-Version")) {
      const ver = "v"+localStorage.getItem("Last-Known-Version")
      const versionWidget = new widgets.VersionWidget(ver)
      versionWidget.mainDom.classList.add("widget-dashboard")
      this.root.append(versionWidget.mainDom)
    }
  }
}