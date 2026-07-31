import { Widget } from "./widget"

const docile = `
*{
width: 100px;
height: 100px;
text {
  color: black;
}
border: 1px solid black;
}
`
export class widgetFormatter {
  widget: Widget
  constructor(widget: Widget) {
    this.widget = widget
    this.format()
  }

  format() {
    const styleClass = "widget-formated-style" 
    const styleDom = this.widget.mainDom.querySelector(styleClass)
    this.widget.mainDom.setAttribute("style",docile)
  }
}