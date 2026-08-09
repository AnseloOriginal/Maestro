export class BaseTestWindow {
  root = document.createElement("div")
  body = document.createElement("div")

  constructor(name="Template") {
    this.root.classList.add("test-mainpage-maindiv")

    const header = document.createElement("div")
    header.classList.add("test-mainpage-headers")
    header.innerText = name
    this.root.append(header)

    this.body.classList.add("test-mainpage-body")
    this.root.append(this.body)
  }

}