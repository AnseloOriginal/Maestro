import { TestQuestions } from "../../../..";
import { convertToNumber, createNumberedElem as createNumberAreaButton, createOptions } from "./helper";

type SectionMap = [subSection: number, question: number]

export class TestInterface {
  testType: string
  testUUID: string
  questions: TestQuestions

  numberArea = document.createElement("div")
  testArea = document.createElement("div")
  testAreaQuestion = document.createElement("div")
  testAreaOptions = document.createElement("div")
  sectionButtons = document.createElement("div")
  root = document.createElement("div")
  sectionMaps: Record<string, SectionMap[]> = {}
  currentSection: string | undefined
  currentNo: number = 1

  constructor(
    testType: string,
    testUUID: string,
    questions: TestQuestions
  ) {
    this.testType = testType
    this.testUUID = testUUID
    this.questions = questions
    this.buildIndex()
    this.initialRender()
  }

  buildIndex() {
    for(const [name, section] of Object.entries(this.questions)) {
      const sectionMap: SectionMap[] = []
      section.forEach((sub,subi) => 
        sub.forEach((ques,id) => sectionMap.push([subi,id]))
      )
      this.sectionMaps[name] = sectionMap
      if (!this.currentSection) {
        this.currentSection = name
      }
    }
  }

  initialRender() {
    this.root.innerHTML = ""
    this.numberArea.focus()
    this.root.append(
      this.sectionButtons,
      this.testArea,
      this.numberArea
    )
    this.testArea.append(
      this.testAreaQuestion,
      this.testAreaOptions
    )
    this.root.classList.add("test-root")
    this.sectionButtons.classList.add("test-subjectlist")
    this.testAreaQuestion.classList.add("test-testarea-question")
    this.testAreaOptions.classList.add("test-testarea-options")
    this.numberArea.classList.add("test-numberarea")
    for(const [name, sections] of Object.entries(this.questions)) {
      const sectionButn = document.createElement('button')
      sectionButn.innerText = name
      sectionButn.onclick = () => this.changeSection(name)
      sectionButn.id = `subjectbutton-${name}`
      this.sectionButtons.append(sectionButn)
    }
    this.buildNumberList()
    this.displayQuestion()
  }

  changeSection(section: string) {
    const sectionExist = this.sectionMaps[section]
    if (!sectionExist) {
      return
    }
    this.currentSection = section
    this.currentNo = 1
    this.buildNumberList()
    this.displayQuestion()
  }

  changeQuestion(no: number) {
    this.root.querySelector(`#NumberAreaButn-${this.currentNo}`)?.removeAttribute("selected")
    if (!this.currentSection) {return}
    const map = this.sectionMaps[this.currentSection]
    if (!map || no < 1 || no > map.length) {
      return
    }
    this.currentNo = no
    this.displayQuestion()
  }

  buildNumberList() {
    if (!this.currentSection) { return }
    const map = this.sectionMaps[this.currentSection]
    if (!map) { return }
    this.numberArea.innerHTML = ""
    for(let i=0;i<map.length;i++) {
      const butn = createNumberAreaButton(i+1)
      butn.onclick = () => this.changeQuestion(i+1)
      this.numberArea.append(butn)
    }
  }

  displayQuestion() {
    if (!this.currentSection) {return}
    const data = this.sectionMaps?.[this.currentSection]?.[this.currentNo-1]
    if (!data) {return}
    const questionData = this.questions[this.currentSection]?.[data[0]]?.[data[1]]
    if (!questionData) {return}
    this.testAreaQuestion.innerHTML = questionData.question
    this.root.querySelector(`#NumberAreaButn-${this.currentNo}`)?.setAttribute("selected","true")
    console.log("showing",questionData)
    createOptions(
        this.testAreaOptions,
        questionData.options,
        (n) => this.selectAnswer(n),
        convertToNumber(questionData.preanswer)
    )
  }

  selectAnswer(answer: number) {
    if (!this.currentSection) {return}
    const data = this.sectionMaps?.[this.currentSection]?.[this.currentNo-1]
    if (!data) {return}
    const questionData = this.questions[this.currentSection]?.[data[0]]?.[data[1]]
    if (!questionData) {return}
    if (answer > questionData.options.length) {
      return
    }
    questionData.preanswer = answer
    window.test.results(this.testUUID,this.currentSection,data[0],data[1],answer,this.testType)
  }
}