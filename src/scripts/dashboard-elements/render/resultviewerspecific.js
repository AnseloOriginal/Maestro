export function renderData(content,data,handler) {
  content.innerHTML = ""
  const mainRow = document.createElement("div")
  mainRow.className = "maindisplay"
  const scoreDisplay = createCircleElement("score",`${data.scores.total_score }/${data.scores.total}`,"Score")
  mainRow.append(scoreDisplay)
  const buttonRow = document.createElement("div")
  const butn = document.createElement("button")
  butn.innerText = "View Corrections"
  butn.onclick = () => handler("corrections",data,content)
  buttonRow.append(butn)
  buttonRow.className = "button-display"
  content.append(mainRow,buttonRow)
}

function createCircleElement(id,text,label) {
  const circle1 = document.createElement('div')
  circle1.className = "result-body-cicle-focus"
  circle1.id = "result-body-cicle-focus-"+id
  const p1 = document.createElement("p")
  p1.innerText = text
  p1.className = "result-body-cicle-focus-text"
  p1.id = "result-body-cicle-focus-text"+id
  const p2 = document.createElement("p")
  p2.innerText = label
  p2.className = "result-body-cicle-focus-label"
  p2.id = "result-body-cicle-focus-label"+id
  circle1.append(p1,p2)
  return circle1
}

export function renderTopBar(content,handler,data) {
  content.innerHTML = ""
  const buttonRow = document.createElement("div")
  const butn = document.createElement("button")
  butn.innerText = "Return"
  butn.onclick = () => handler("results",data,content,handler)
  buttonRow.append(butn)
  buttonRow.className = "button-display"
  content.append(buttonRow)
} 

export function renderNoResult(content) {
  const div = document.createElement("div")
  div.className = "noresultdiv"
  div.innerText = "Result not available at this momment"
  content.append(div)
}