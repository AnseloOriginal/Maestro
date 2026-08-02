import { getValue } from "../../../cache/cache"
import { getVerseOfTheDay } from "../../gospel/votd/main"
import {widgetFormatter} from "./widgetFormatter"

type WidgetFormatType = "largeandsmall"

const WEEKDAY = [
  "Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"
]

const MONTH = [
  "January", "Febuary", "March", "April", "May", "June", "July", "August",
  "September", "November", "December"
]

const numberSuffix = (num=1) => {
  const rem = num % 10
  if (rem === 1) {
    return "st"
  } else if (rem === 2) {
    return "nd"
  } else if (rem === 3) {
    return "rd"
  } else {
    return "th"
  }
}


export class Widget {

  mainDom  = document.createElement("div")
  options: Object
  format: WidgetFormatType

  constructor(format: WidgetFormatType ="largeandsmall", options={}, ...data: string[]) {
    const mainDom =  document.createElement("div")
    this.mainDom = mainDom
    this.options = options
    this.format = format
    this.formatText(data)
  }
  
  formatText(data: string[]) {
    this.mainDom.innerHTML = ""
    if (this.format === "largeandsmall") {
        const text1 = document.createElement("p")
        text1.classList.add("bolden","larger","no-bottom","widget-largeandsmall-text1")
        const text2 = document.createElement("p")
        text2.classList.add("no-top","widget-largeandsmall-text2")
        text1.innerHTML = data[0] || "No Data"
        text2.innerHTML = data[1] || "No Data"
        this.mainDom.append(text1,text2)
      }
  }

  updateData(...data: string[]) {
    if (this.format) {
      const text1 = this.mainDom.querySelector(".widget-largeandsmall-text1")
      const text2 = this.mainDom.querySelector(".widget-largeandsmall-text2")
      if (text1 && data[0]) {
        text1.innerHTML = data[0]
      }
      if (text2 && data[1]) {
        text2.innerHTML = data[1]
      }
    }
  }

  onHover = (func: (s: Widget, e: PointerEvent | MouseEvent) => void) => {
    this.mainDom.onmouseover = (evt) => func(this,evt)
  }

  onClick = (func: (s: Widget, e: PointerEvent | MouseEvent) => void) => {
    this.mainDom.onclick = (evt) => func(this,evt)
  }
}

export class DateWidget extends Widget {

  constructor() {
    const date = new Date()
    const dayText = `${WEEKDAY[date.getDay()]} ${date.getDate()}${numberSuffix(date.getDate())}`
    const dateText = `${MONTH[date.getMonth()]} ${date.getFullYear()}`
    super("largeandsmall",{},dayText,dateText) 
  }
}

export class TimeWidget extends Widget {

  constructor() {
    const date = new Date()
    const realHour = date.getHours() % 12 || 12
    const realMin = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()
    const AmOrPm = date.getHours() < 12 ? "AM" : "PM"
    const timeText =  `${realHour}:${realMin} ${AmOrPm}`
    const dayPeriod = date.getHours() < 12 ? "Morning" : date.getHours() < 15 ? "Afteroon" : "Evening"
    super("largeandsmall",{},timeText,dayPeriod)
  }
}

export class VersionWidget extends Widget {
  constructor() {
    const appVersion = getValue("version","0.0.0")
    super("largeandsmall",{},appVersion,"Maestro") 
  }

  changeVersion(newVersion: string) {
    this.updateData(newVersion,"Maestro")
  }
}

export class VOTDWidget extends Widget {
  constructor() {
    const verse = getVerseOfTheDay()
    super("largeandsmall",{},verse,"Verse of the Day") 
  }
}