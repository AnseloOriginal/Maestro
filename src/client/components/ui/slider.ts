class SliderButn {
  container: HTMLDivElement | HTMLButtonElement
  icon: HTMLSpanElement
  expandable: boolean
  text: HTMLParagraphElement | undefined

  constructor(
    icon: string, 
    expandable: boolean, 
    name: string = "Default",
  ) {
    this.container = expandable ? document.createElement("div") : document.createElement("button")
    this.icon = document.createElement("span")
    this.icon.innerText = icon
    this.icon.classList.add("material-symbols-outlined","menu-butn-icon")
    this.container.classList.add(expandable ? "menu-butn" : "menu-button")
    this.expandable = expandable
    this.container.append(this.icon)
    if (expandable) {
      this.text = document.createElement("p")
      this.text.innerText = name
      this.text.classList.add("menu-butn-text")
      this.container.append(this.text)
      this.expand(false)
    }
  }

  changeIcon(icon: string) {
    this.icon.innerText = icon
    return this
  }

  onclickEvent(evt: () => any) {
    this.container.onclick = evt
    return this
  }

  delete() {
    this.container.onclick = () => undefined
  }

  expand(shouldExpand: boolean) {
    if (!this.expandable) {return}
    if (!this.text) {return}
    if (shouldExpand) {
      this.text.style.display = "inline"
    } else {
      this.text.style.display = "none"
    }
  }
}

export class Slider {
  container: HTMLDivElement
  buttons: {[key: string]: SliderButn | undefined}
  expanded: boolean

  constructor () {
    this.container =  document.createElement("div")
    this.container.id = "sidepanel"
    this.container.classList.add("sidepanel","sidepanel-min")
    this.buttons = {}
    this.addButton("main-switch","menu", false).onclickEvent(
      () => this.toggleSwitch()
    )
    this.expanded = false
  }

  addButton(id: string, icon: string, expandable: boolean, name: string = "Default"){
    const newButton = new SliderButn(icon,expandable,name)
    this.buttons[id] = newButton
    this.container.append(newButton.container)
    return newButton
  }

  removeButton(id: string) {
    const button = this.buttons[id]
    if (button) {
      button.delete()
      this.container.removeChild(button.container)
      return true
    } else {
      return false
    }
  }

  toggleSwitch() {
    this.expanded = this.expanded ? false : true
    if (this.expanded) {
      this.container.classList.replace("sidepanel-min","sidepanel-max")
    } else {
      this.container.classList.replace("sidepanel-max","sidepanel-min") 
    }
    for(const [name,button] of Object.entries(this.buttons)) {
      if (button) {
        button.expand(this.expanded)
      }
    }
  }
}