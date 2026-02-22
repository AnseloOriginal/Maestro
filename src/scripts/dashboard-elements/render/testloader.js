//Pre-test confirmation
export function render_confirmation(content,name,yesFunc,noFunc) {
  content.innerHTML = ""
  const text = document.createElement('p')
  text.innerHTML = `Please confirm writing CBT test: <span>${name}</span>`
  text.className = "test-confirmation-text"
  
  const butnGroup = document.createElement("div")
  butnGroup.className = "test-confirmation-butngroup"
  const yes =  document.createElement('button')
  yes.onclick =  yesFunc
  yes.innerText = "Yes"
  const no =  document.createElement('button')
  no.onclick =  noFunc
  no.innerText = "Return"
  butnGroup.append(yes,no)
  content.append(text,butnGroup)
}

//Loading symbol
export function render_loading(content) {
  content.innerHTML = ""
  const loading = document.createElement('p')
  loading.innerText = "Loading..."
  content.append(loading)
  return loading
}