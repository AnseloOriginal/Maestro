export function renderData(content,data,handler,name) {
  content.innerHTML = ""
  const mainRow = document.createElement("div")
  mainRow.className = "maindisplay"
  const scoreDisplay = createCircleElement("score",`${data.scores.total_score }/${data.scores.total}`,"Score")
  mainRow.append(scoreDisplay)
  const properties = document.createElement("div")
  let tempProp = `
  <p> <span>Exam:</span> ${name} </p>
  <p> <span>Time Used:</span> ${Math.floor((parseInt(data?.variables?.elasped) / ((data?.details?.duration || 0)))*100)}%
  </p><table> <tr><th>Section</th> <th>Score</th> <th>Total</th> </tr>`

  for(const [name,totalscore] of Object.entries(data.scores.sections_total)) {
    const score = data.scores.sections_scores[name] || "??"
    tempProp += `<tr><td>${name}</td><td>${score}</td><td>${totalscore}</td></tr>` 
  }
  tempProp += "</table>"
  properties.innerHTML = tempProp
  properties.className = "properties"
  console.log(tempProp)
  const buttonRow = document.createElement("div")
  const butn = document.createElement("button")
  butn.innerText = "View Corrections"
  butn.onclick = () => handler("corrections",data,content,name)
  buttonRow.append(butn)
  buttonRow.className = "button-display"
  content.append(mainRow,properties,buttonRow)
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

export function renderTopBar(content,handler,data,name) {
  content.innerHTML = ""
  const buttonRow = document.createElement("div")
  const butn = document.createElement("button")
  butn.innerText = "Return"
  butn.onclick = () => handler("results",data,content,handler,name)
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