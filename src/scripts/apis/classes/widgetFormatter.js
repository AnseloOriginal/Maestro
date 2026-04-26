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
  constructor(widget,startingFormat="default") {
    this.widget = widget
    this.format(startingFormat)
  }

  format(type) {
    const styleClass = "widget-formated-style" 
    const styleDom = this.widget.mainDom.querySelector(styleClass)
    this.widget.mainDom.setAttribute("style",docile)
    return;
    if (styleDom) {
      styleDom.textContent = docile
    } else {
      const style = document.createElement("style")
      style.type =  "text/css"
      style.textContent = docile
      this.widget.mainDom.setAr = style.style
      // console.log(style.style)
      this.widget.mainDom.prepend(style)
    }
  }
}