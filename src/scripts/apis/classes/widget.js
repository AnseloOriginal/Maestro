
import {widgetFormatter} from "./widgetFormatter.js"
const WEEKDAY = [
  "Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"
]

const MONTH = [
  "January", "Febuary", "March", "April", "May", "June", "August",
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

const toTimeString = (hour,min) => {

}

export class Widget {

  constructor(format="largeandsmall",options={},...data) {
    //Supported formats include largeandsmall, 
    const mainDom =  document.createElement("div")
    this.mainDom = mainDom
    this.options = options
    this.data = data
    this.formatText(format,options,data)
    // const formatter = new widgetFormatter(this)
  }
  
  formatText(formatType,options,data) {
    this.mainDom.innerHTML = ""
    if (formatType === "largeandsmall") {
        const text1 = document.createElement("p")
        text1.classList.add("bolden","larger","no-bottom")
        const text2 = document.createElement("p")
        text2.classList.add("no-top")
        text1.innerHTML = data[0] || "No Data"
        text2.innerHTML = data[1] || "No Data"
        this.mainDom.append(text1,text2)
      }
      this.format =  formatType
    }
  onHover = (func) => {
    if (typeof func === "function") {
      this.mainDom.onmouseover = (evt) => func(this,evt)
    }
  }

  onClick = (func) => {
    if (typeof func === "function") {
      this.mainDom.onclick = (evt) => func(this,evt)
    }
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
  constructor(version) {
    super("largeandsmall",{},version,"Maestro") 
  }
}