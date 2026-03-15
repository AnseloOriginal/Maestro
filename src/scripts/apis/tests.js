import {Calculator} from "./classes/calculator.js"

export function manageButns(render,finishFunc) {
  const submitButn = document.querySelector('.test-interface-submit')
  const abortButn = document.querySelector('.test-interface-abort')
  const dialog = document.querySelector('.test-interface-dialog')

  if (submitButn) {
    submitButn.onclick = (evt) => {
      render.render_confirm_submit_test(dialog)
      dialog.showModal()
      const yesButn = dialog.querySelector(".testing-dialog-yes")
      const noButn = dialog.querySelector(".testing-dialog-no")
      noButn.onclick = () => {
        dialog.close()
      }
      yesButn.onclick = () => {
        finishFunc()
      }
    }
  }

  if (abortButn) {
    abortButn.onclick = (evt) => {
      render.render_confirm_end_test(dialog)
      dialog.showModal()
      const yesButn = dialog.querySelector(".testing-dialog-yes")
      const noButn = dialog.querySelector(".testing-dialog-no")
      noButn.onclick = () => {
        dialog.close()
      }
      yesButn.onclick = () => {
        finishFunc()
      }
    }
  }
}

export function calculatorLogic(showCalculator,parent,floatingSpace) {
  const butn = parent.querySelector(".test-interface-calculator")
  if (!showCalculator) {
    butn.style.display = "none"
    return
  }
  const calculator = new Calculator(0,0)
  calculator.hide()
  butn.onclick = () => calculator.toggle()
  floatingSpace.append(calculator.objectDiv)
}