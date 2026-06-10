
export function generateLockdownScreen(content,func) {
  content.innerHtml = ""
  const header = document.createElement("h1")
  header.innerText = "Lockdown Mode"
  const subtext = document.createElement("h2")
  subtext.innerText = "Submit your test and ask for pin"
  const pinBox = document.createElement("input")
  pinBox.max = 4
  pinBox.type = "number"
  const verifyButn = document.createElement("button")
  verifyButn.innerText = "Verify"
  const errorDisplay = document.createElement("p")
  content.append(header,subtext,pinBox,verifyButn,errorDisplay)
  verifyButn.onclick = () => {
    if (pinBox.value.length === 4 || pinBox.value.length === 12) {
      func(pinBox.value,errorDisplay)
    } else {
      errorDisplay.innerText = "Pin is 4 digit."
    }
  }
}

