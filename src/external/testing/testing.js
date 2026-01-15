import * as dom from "./testing-dom.js"
const tempdata = sessionStorage.getItem("testdata")
const numberarea = document.getElementById("numberarea")
const testarea = document.getElementById("testarea")
const testAreaQuestions = document.getElementById("testarea-question")
const testAreaOptions = document.getElementById("testarea-options")
const subjectlist = document.getElementById("subjectlist")
let uuid = sessionStorage.getItem("testuuid")
if (uuid) {
  uuid = JSON.parse(uuid)
} else {
  uuid = ""
}

let data;
let currentSection = ""
let currentSubsection = 0
let currentQuestion = 0
let currentQuestionID = 0
const LastSelected = {}
const resultData = []
const syncResultData = {}

if (!tempdata) {
  console.error("No Data passed to Test Library")
} else {
  data = JSON.parse(tempdata)
  buildFirstUI(data,testarea,numberarea,subjectlist)
}



function changeQuestion(section,subsection,question,id) {
  const questionData =  data[section]?.[subsection]?.[question]
  if (questionData) {
    console.log(currentSection)
    
    if (section === currentSection) {
      document.getElementById(`NumberAreaButn-${currentQuestionID}`)?.setAttribute("selected","false")
    }
    // console.log(document.getElementById(`NumberAreaButn-${id}`),id)
    document.getElementById(`NumberAreaButn-${id}`)?.setAttribute("selected","true")
    displayQuestion(questionData)
    currentQuestionID = id
    currentQuestion = question
    currentSubsection = subsection
    currentSection =  section
    if (LastSelected) {
      LastSelected[section] = [subsection, question, id]
    }
  }
  refreshNumberBarThumbnail()
}

function changeSection(section) {
  const sectionData = data[section]
  if (sectionData) {
    document.getElementById(`subjectbutton-${currentSection}`)?.setAttribute('selected','no')
    document.getElementById(`subjectbutton-${section}`)?.setAttribute('selected','yes')
    let count = 1
    numberarea.innerHTML = ""
    sectionData.forEach((sub,subIndex) => {
      sub.forEach((ques,quesIndex) => {
        const butn =  dom.createNumberAreaButton(count)
        const p = count + 0
        butn.onclick = () => changeQuestion(section,subIndex,quesIndex,p)
        numberarea.append(butn)
        count++
      })
    })
    if (LastSelected[section]) {
      const [sub, ques, id] = LastSelected[section]
      changeQuestion(section, sub, ques, id)
    } else {
      if (sectionData[0]?.[0]) {
        changeQuestion(section, 0, 0, 1)
      }
    }
  }
  refreshNumberBarThumbnail()
}

function buildFirstUI(data,testarea,numberarea,subjectlist) {
  let builtFirst = false //Checks if it has build the fist
  for(const [name, sections] of Object.entries(data)) {
    const subjectButn = document.createElement('button')
    subjectButn.innerText = name
    subjectButn.onclick = () => changeSection(name)
    subjectButn.id = `subjectbutton-${name}`
    subjectlist.append(subjectButn)
    

    if (!builtFirst) {
      const firstQuestion = sections[0]?.[0];
      currentSection = name;
      if (firstQuestion) {
        changeQuestion(name,0,0,1)
        // displayQuestion(firstQuestion,testarea)
      }
      let count = 1
      sections.forEach((sub,subIndex) => {
        sub.forEach((ques,quesIndex) => {
          const butn =  dom.createNumberAreaButton(count)
          const p = count + 0
          butn.onclick = () => changeQuestion(name,subIndex,quesIndex,p)
          numberarea.append(butn)
          count++
        })
      })
      document.getElementById(`NumberAreaButn-1`)?.setAttribute("selected","true")
      refreshNumberBarThumbnail()
      currentSection = name
      currentQuestion = 1
      builtFirst = true
    }
  }
}

function displayQuestion(data) {
  testAreaQuestions.innerText = data.question
  testAreaOptions.innerHTML = ""
  data.options.forEach((option,i) => {
    const selected = (i+1) == data.preanswer
    const optionDom = dom.regularOption(i+1,option,onOptionSelection,selected);
    testAreaOptions.append(optionDom)
  });
}

function onOptionSelection(evt,num) {
  const i = evt?.target?.value || num || 0
  console.log(i)
  if (data[currentSection]?.[currentSubsection]?.[currentQuestion]) {
    data[currentSection][currentSubsection][currentQuestion].preanswer = parseInt(i)
    syncResult(currentSection,currentSubsection,currentQuestion) //Must be called first
  }
  const option = document.getElementById(`option-${i}`)
  if (option) {
    option.checked = true
  }
}

document.onkeydown = (evt) => {
  if (evt.key === "a") {
    onOptionSelection(0,1)
  } else if (evt.key === "b") {
    onOptionSelection(0,2)
  } else if (evt.key === "c") {
    onOptionSelection(0,3)
  } else if (evt.key === "d") {
    onOptionSelection(0,4)
  } else if(evt.key === "left" || evt.key === "right") {
    return;
    const isForward = evt.key === "right"
    const isAtBeginofSub = currentQuestion === 0
    const isAtEndOfSub = (currentQuestion+1) === data[currentSection]?.[currentSubsection]?.length
    const isAtBeginofSec =  isAtBeginofSub && currentSubsection === 0 
    const isAtEndofSec =  isAtEndOfSub && (currentSubsection+1) === data[currentSection]?.length
    const isFreeBothWays = !isAtBeginofSub && !isAtEndOfSub
    const notADeadEnd = !isAtEndofSec && !isAtBeginofSec
    if (isFreeBothWays) {
      if (isForward) {
        changeQuestion(currentSection,currentSubsection,currentQuestion+1)
      } else {
        changeQuestion(currentSection,currentSubsection,currentQuestion-1)
      }
    } else {
      if (notADeadEnd) {
        if (isAtBeginofSub) {
          if (isForward) {
            changeQuestion(currentSection,currentSubsection,currentQuestion+1)
          } else {
            changeQuestion(currentSection,currentSubsection-1,0)
          }   
        }
        if (isAtEndOfSub) {
          if (isForward) {
            changeQuestion(currentSection,currentSubsection+1,0)
          } else {
            changeQuestion(currentSection,currentSubsection-1,0)
          }   
        }
      }
    }
  }
}

function syncResult(section,sub,ques) {
  const key = `${section}-${sub}-${ques}`
  const answer = data[currentSection]?.[currentSubsection]?.[currentQuestion]?.preanswer || 0
  syncResultData[key] = false
  window.parent.test.results(uuid,section,sub,ques,answer).then(result => {
    syncResultData[key] = result
    sessionStorage.setItem("testsync",JSON.stringify(syncResultData))
  })
  sessionStorage.setItem("testdata",JSON.stringify(data))
  sessionStorage.setItem("testsync",JSON.stringify(syncResultData))
}

function refreshNumberBarThumbnail() {
  const section = data[currentSection]
  if (section) {
    let count = 1
    section.forEach(sub => {
      sub.forEach(ques => {
        let i = 0
        if (ques.preanswer) {i = parseInt(ques.preanswer)}
        if (i) {
          document.getElementById(`NumberAreaButn-${count}`)?.setAttribute("answered","true")
        } else {
          document.getElementById(`NumberAreaButn-${count}`)?.setAttribute("answered","false")
        }
        count++
      })
    })
  }
}