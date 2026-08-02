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
      new widgets.VersionWidget(),
      new widgets.VOTDWidget()
    )

    renderer.addEventHandler("update-event", (evt) => {
      if (widgetsArray[2] instanceof widgets.VersionWidget) {
        widgetsArray[2].changeVersion(evt.newVersion)
      }
    })

    widgetsArray[3].onClick(
      (widget) => renderer.dialogManager.newDialog((dialog) => {
        const h2  = document.createElement("h2")
        h2.innerText = "Verse of the Day"
        const p = document.createElement("p")
        window.media.getBibleVerses(widget.data[0]).then(verses => {
          if (!verses) {
            return
          }
          p.innerHTML = verses.text
        })
        dialog.root.append(h2,p)
      })
    )

  }
}