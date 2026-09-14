import { TestQuestions } from "../../../.."

export function createNumberedElem(n: number) {
  const butn = document.createElement('button')
  butn.innerText = n.toString(10)
  butn.id = `NumberAreaButn-${n}`
  return butn
}

export function createOptions(
  container: HTMLElement,
  options: string[],
  onclick: (option: number) => void,
  selected?: number,
  highlightOnSelected?: boolean,
  unSelectable?: boolean
) {
  container.innerHTML = ""
  options.forEach((option,preIndex) => {
    const i = preIndex + 1
    const label = document.createElement('label')
    const radio = document.createElement('input')
    const text = document.createElement('p')
    radio.type = "radio"
    radio.name = "TestOptionsRadio"
    if (unSelectable) {
      radio.disabled = true
    }
    
    if (i === selected) {
      radio.checked = true
    }
    if (highlightOnSelected) {
      radio.classList.add("highlight-on-select")
    }
    radio.oninput = () => onclick(i)
    text.innerText = option
    label.append(radio,text)
    label.className = 'TestOptionsRadio'
    container.append(label)
  })
}


export function convertToNumber(n?: string | number) {
  if (typeof n === "string") {
    return parseInt(n)
  } else {
    return n ? n : 0
  }
}

export function countQuestions(questions: TestQuestions) {
  let count = 0
  for(const [name, section] of Object.entries(questions)) {
    section.forEach(subSec => subSec.forEach(q => count++))
  }
  return count
}