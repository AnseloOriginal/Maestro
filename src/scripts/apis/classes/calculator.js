import {FloatableDiv} from './float.js';

const buttonList = [
  {
    text: "$\\sqrt{x}$",
    add: "sqrt("
  },
  {
    text: "$x^2$",
    add: "^2"
  },
  {
    text: "$\sin(x)$",
    add: "sin("
  },
  {
    text: "$\cos(x)$",
    add: "cos("
  },
  {
    text: "$\\tan(x)$",
    add: "tan("
  },
  {
    text: "$\\log(x)$",
    add: "log10("
  },
]

const customFunctions = {
  sin: function (x) {
    return math.sin(math.unit(x, 'deg'));
  },
  cos: function (x) {
    return math.cos(math.unit(x, 'deg'));
  },
  tan: function (x) {
    return math.tan(math.unit(x, 'deg'));
  },
  // Add asin, acos, atan if needed
};

export class Calculator extends FloatableDiv {
  constructor(x,y) {
    super(0,0,true)
    const textBody = document.createElement("div")
    textBody.classList = "calculator-text"
    const textInput = document.createElement("input")
    textInput.placeholder = "Type Equations here"
    const latexDisplay = document.createElement("p")
    latexDisplay.innerText = "Equations Here"
    const result= document.createElement("p")
    result.innerText = "Result Here"
    const buttonBody = document.createElement("div")

    buttonBody.className = "calculator-buttons"
    textBody.append(textInput,latexDisplay,result)
    textInput.oninput = () => {
      this.calculate()
    }
    this.latexText = latexDisplay
    this.textInput = textInput
    this.resultText = result
    this.objectDiv.append(textBody,buttonBody)
    this.objectDiv.className = "calculator"
    this.lastResult = false
    buttonList.forEach((data,i) => {
      const butn =  document.createElement("button")
      butn.innerText = data.text
      this.renderKatex(butn)
      butn.onclick = () => this.butnInput(i)
      buttonBody.append(butn)
    })
    this.objectDiv.classList = "floating-calculator"
  }

  hide() {
    this.objectDiv.style.display = "none"
  }

  show() {
    this.objectDiv.style.display = "block"
  }

  toggle() {
    if (this.objectDiv.style.display === "none") {
      this.show()
    } else {
      this.hide()
    }
  }

  calculate() {
    const innerCalc = (str="") => {
      const node = math.parse(str);
      const latex = node.toTex();
      this.latexText.innerText = "$"+latex+"$"
      this.renderKatex(this.latexText)
      const answer = math.evaluate(str,customFunctions)
      this.resultText.innerText = math.format(answer,{ precision: 14 })
    }
    const origText = this.textInput.value
    const fallbackText = origText+"+0"
    try {
      if (this.textInput.value.length > 0) {
        innerCalc(origText)
      } else {
        this.latexText.innerText = "Equations Here"
        this.resultText.innerText = "Result Here"
      }
    } catch (e) {
      try{
        innerCalc(fallbackText)
      } catch {
        this.latexText.innerText = e
      }
    }
  }

  renderKatex = (elem) => {
    renderMathInElement(elem, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });

  }

  butnInput = (i) => {
    this.textInput.value += buttonList[i]?.add ? buttonList[i]?.add: ""
    this.calculate()
  }
}