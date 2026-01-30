export function newSubjectHeader(name) {
  const button = document.createElement("button")
  button.setAttribute("class","subject-list")
  button.id = "subject-list-"+name
  button.innerText = name
  return button
}

export function regularOption(id,name,func,selected,highlight,unSelectable,) {
  const label = document.createElement('label')
  const radio = document.createElement('input')
  radio.type = "radio"
  radio.name = "OptionsRadio"
  if (unSelectable) {
    radio.disabled = true
  }
  radio.value = id
  radio.oninput = func
  if (selected) {
    radio.checked = true
  }
  radio.id = `option-${id}`
  const text = document.createElement('p')
  text.innerText = name
  if (highlight) {
    text.classList.add("highlight")
  }
  label.append(radio,text)
  label.className = 'OptionsRadio'
  return label
}

export function createNumberAreaButton(id) {
  const butn = document.createElement('button')
  butn.innerText = id
  butn.id = `NumberAreaButn-${id}`
  return butn
}