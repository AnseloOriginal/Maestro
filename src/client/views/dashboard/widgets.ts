import { getValue } from "../../cache/cache.ts"
import { Renderer } from "../../components/renderer.ts"
import * as widgets from "../../components/ui/widgets/widget.ts"

export class DashboardWidgets {
  root = document.createElement("div")
  constructor(renderer: Renderer) {
    this.root.classList.add("widget-container")

    const setupWidget = (...widgets: widgets.Widget[]) => {
      widgets.forEach(widget => {
        widget.mainDom.classList.add("widget-dashboard")
        this.root.append(widget.mainDom)
      })
      return widgets
    }

    const widgetsArray = setupWidget(
      new widgets.DateWidget(),
      new widgets.TimeWidget(),
      new widgets.VersionWidget()
    )

    renderer.addEventHandler("update-event", (evt) => {
      if (widgetsArray[2] instanceof widgets.VersionWidget) {
        widgetsArray[2].changeVersion(evt.newVersion)
      }
    })

  }
}