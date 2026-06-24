const settings = {
  
}

type CreatableElement =
  "p" |
  "div"

export class ElementCreator {
  
  create(element: CreatableElement) {
    if (element == "p") {
      return document.createElement("p")
    } else if (element == "div") {
      return document.createElement("div")
    }
  }
}