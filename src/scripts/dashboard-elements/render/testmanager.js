export function render_mainpage(
  content,
  loading,
  teacher_weekly_quota,
  week_count,
  exam_info,
  hook
) 
{
  if (loading) {
    const topbar = create_topbar("Create","Results")
    const body = create_loading_space()
    content.append(topbar,body)
  } else {
    const topbar = create_topbar("Create","Results")
    const body =  create_create_content_space(week_count,teacher_weekly_quota,exam_info,hook)
    content.append(topbar,body)
  }
}

function create_topbar(...options) {
  const div = document.createElement("div")
  div.className = "testmanager-topbar"
  options.forEach((option,i) => {
    const button = document.createElement("button")
    button.className = "testmanager-topbar-option testmanager-topbar-option-"+option
    if (i==0) {
      button.setAttribute("selection","I am Selected")
    }
    button.innerText = option
    div.append(button)
  })
  return div
}

function create_create_content_space(week_count,teacher_weekly_quota,exam_info,hook) {
  const div = document.createElement("div")
  div.className = "testmanager-body"
  const topDisplay = document.createElement('p')
  topDisplay.className = "testmanager-body-topdisplay"
  topDisplay.id = "testmanager-body-topdisplay"
  
  div.append(topDisplay)
  for (const [key, data] of Object.entries(exam_info)) {
    const quota = week_count[key] || 0
    const group = create_create_group(key,data.name,quota,teacher_weekly_quota,data.no,hook)
    div.append(group)
  }

  return div
}

function create_create_group(uuid,name,current,quota,total,hook) {
  const div = document.createElement("div")
  div.className = "testmanager-body-group"
  const nameText = document.createElement("p")
  nameText.innerText = name
  nameText.className = "testmanager-body-group-name"
  const progressDisplay = document.createElement('div')
  progressDisplay.className = "testmanager-body-group-progressdisplay"
  const c1 = createCircleElement("g",`${current}/${quota}`,"Quota")
  const c2 = createCircleElement("g",`${total}`,"Total")
  progressDisplay.append(c1,c2)
  const buttonsDisplay = document.createElement("div")
  buttonsDisplay.className = "testmanager-body-group-buttondisplay"
  const b1 = document.createElement("button")

  b1.innerText = "Add Question"
  b1.onclick = () => {
    hook("addquestions",uuid)
  }

  const b2 = document.createElement("button")
  b2.onclick = () => {
    hook("viewquestions",uuid)
  }
  b2.innerText = "View All"
  buttonsDisplay.append(b1,b2)
  div.append(nameText,progressDisplay,buttonsDisplay)
  return div
}
function create_loading_space() {
  const div = document.createElement("div")
  div.className = "testmanager-body"
  const progressDisplay = document.createElement('div')
  progressDisplay.className = "testmanager-body-progressdisplay"
  const progressCircle = createCircleElement('l1',`0%`,"Loading...")
  progressDisplay.append(progressCircle)
  div.append(progressDisplay)
  return div
}

function createCircleElement(id,text,label) {
  const circle1 = document.createElement('div')
  circle1.className = "testmanager-body-cicle-focus"
  circle1.id = "testmanager-body-cicle-focus-"+id
  const p1 = document.createElement("p")
  p1.innerText = text
  p1.className = "testmanager-body-cicle-focus-text"
  p1.id = "testmanager-body-cicle-focus-text"+id
  const p2 = document.createElement("p")
  p2.innerText = label
  p2.className = "testmanager-body-cicle-focus-label"
  p2.id = "testmanager-body-cicle-focus-label"+id
  circle1.append(p1,p2)
  return circle1
}

export function renderAddQuestionPage(
  bankinfo,
  existing,
  hook
) {
  const body = document.querySelector(".testmanager-body")
  if (!body) {
    return;
  }
  body.innerHTML = ''
  const header = document.createElement("p")
  header.className = 'testmanager-body-add-header'
  header.innerText = `Add Questions to ${bankinfo.name}`
  body.append(header)

  const questionContainer = document.createElement("div")
  let nextID = 1;
  if (existing) {
    let displayCount = 1
    existing.forEach((question,id) => {
      if (!question) {return}
      const div = create_question_display(displayCount,question.question,question.options,question.answer,bankinfo.uuid)
      questionContainer.append(div)
      displayCount++
    })
    nextID = displayCount
  }

  const buttondisplay =  document.createElement("div")
  buttondisplay.className = "testmanager-body-buttongroup"
  const createButn = document.createElement("button")
  createButn.onclick = () => {
    const div = create_question_display(nextID,undefined,undefined,undefined,bankinfo.uuid)
    questionContainer.append(div)
    nextID++
  }
  createButn.innerText = "Add Question"
  const finishButn = document.createElement("button")
  finishButn.innerText = "Finish"
  finishButn.onclick = () => {
    let allTrue = true
    let firstFocus = true
    let mainStore = localStorage.getItem("teacher_temporary_store")
    if (!mainStore) {
      return;
    }
    mainStore = JSON.parse(mainStore)
    const questionStore = mainStore[bankinfo.uuid]
    if (!questionStore) {
      return;
    }
    questionStore.forEach((question,id) => {
      if (!question) {return}
      let justTrue = true
      if (!question.question) {
        const nameError = document.getElementById("testmanager-body-add-name-error"+id)
        nameError.focus()
        nameError.style.display = "block"
        allTrue = false
        justTrue = false
        console.log("No question",question.question)
      }
      const a = question.options.reduce((f,c) =>  c ? f + 1: 0,0)
      if (a < 4) {
        const error = document.getElementById("testmanager-body-add-option-error"+id)
        error.style.display = 'block'
        error.innerText = "Please fill out all 4 options"
        allTrue = false
        justTrue = false
        console.log("No option",question.options)
      } else {
        if (!question.answer) {
          const error = document.getElementById("testmanager-body-add-option-error"+id)
          error.style.display = 'block'
          error.innerText = "Please select an answer"
          allTrue = false
          justTrue = false
          console.log("No answee",question.answer)  
        }
      }
      if (justTrue) {
        question.finished = true
      }
    })
    localStorage.setItem("teacher_temporary_store",JSON.stringify(mainStore))
    
    if (allTrue) {
      hook("changescreen","test-manager")
    }
  }
  buttondisplay.append(createButn,finishButn)
  body.append(questionContainer,buttondisplay)
}

function create_question_display(id,prefillname,prefilledOptions,prefilledAnswer,uuid,editMode) {
  function getStore() {
    let store
    if (localStorage.getItem("teacher_temporary_store")) {
      store = JSON.parse(localStorage.getItem("teacher_temporary_store"))
    } else {
      store = {}
    }
    if (!store[uuid]) {store[uuid] = []}
    if (!store[uuid][id]) {store[uuid][id] = {
      question: "",
      options: [],
      answer: 0
    }}
    return store
  }

  function saveStore(store) {
    if (!store) {
      console.error("major error")
    }
    localStorage.setItem("teacher_temporary_store",JSON.stringify(store))
  }
  const div = document.createElement('div')
  div.className = 'testmanager-body-add-question'
  const idElem = document.createElement("p")
  idElem.innerText = "#"+id
  idElem.className = "testmanager-body-add-id"
  const nameGroup = document.createElement('label')
  nameGroup.className = "testmanager-body-add-namegroup"
  const nameLabel = document.createElement('p')
  nameLabel.innerText = "Question: "
  nameLabel.className = "testmanager-body-add-namelabel"
  const name = document.createElement('input')
  name.placeholder = "Write your question here"
  if (prefillname) {
    name.value = prefillname
  }
  name.className = "testmanager-body-add-name"
  const nameError = document.createElement('p')
  nameError.id = "testmanager-body-add-name-error"+id
  nameError.className = "testmanager-body-add-name-error"
  nameError.innerText = "Question must be filled"
  nameError.style.display = "none"
  div.questionText = ""
  div.answerNo = 0
  div.lastAnswerNo = 0
  div.optionsArray = ["","","",""]
  if (prefillname) {div.questionText = prefillname}
  if (prefilledOptions) {div.optionsArray = prefilledOptions}
  name.oninput = () => {
    if (nameError.style.display === "block") {
      nameError.style.display = "none"
    }
    div.questionText = name.value
    if (editMode) {return}
    let store = getStore()
    store[uuid][id].finished = false
    store[uuid][id].question = name.value
    saveStore(store)
  }

  nameGroup.append(nameLabel,name)
  const optionsGroup = document.createElement('label')
  optionsGroup.className = "testmanager-body-add-optiongroup"
  const optionsLabel = document.createElement('p')
  optionsLabel.innerText = 'Options:'
  optionsLabel.className = "testmanager-body-add-optionlabel"
  const optionLine = document.createElement('div')
  optionLine.className = "testmanager-body-add-optionline"
  const optionsError = document.createElement('p')
  optionsError.id ="testmanager-body-add-option-error"+id
  optionsError.className = "testmanager-body-add-option-error"
  for(let i=1;i<5;i++) {
    const option = document.createElement('input')
    option.className = "testmanager-body-add-optiontextbox"
    const radio = document.createElement('input')
    radio.className = "testmanager-body-add-optionradio"
    radio.onclick
    radio.type = "radio"
    radio.name = "radio"+id
    option.placeholder = "Insert Option "+i
    if (prefilledAnswer === i) {
      radio.checked = true
      div.answerNo = i
      div.lastAnswerNo = i
    }
    radio.oninput = () => {
      if (optionsError.style.display === "block") {
        optionsError.style.display = "none"
      }
      div.answerNo = i
      div.lastAnswerNo = i
      if (editMode) {return}
      let store = getStore()
      store[uuid][id].answer = i
      saveStore(store)
    } 
    option.oninput = () => {
      if (optionsError.style.display === "block") {
        optionsError.style.display = "none"
      }
      div.optionsArray[i-1] = option.value
      if (editMode) {return}
      let store = getStore()
      store[uuid][id].finished = false
      store[uuid][id].options[i-1] = option.value
      saveStore(store)
    }
    if (prefilledOptions?.[i-1]) {
      option.value = prefilledOptions[i-1]
    }
    optionLine.append(option,radio)
  }
  const bonusLine = document.createElement("p")
  const bonusBox = document.createElement("input")
  const bonusComment = document.createElement("span")
  bonusComment.innerText = "Mark as Bonus"
  bonusBox.type = "checkbox"
  bonusBox.oninput = (evt) => {
    if (bonusBox.value) {
      div.answerNo = 5
    } else {
      div.answerNo = lastAnswerNo
    }
  }
  if (prefilledAnswer === 5) {
    bonusBox.checked = true
  }
  bonusLine.append(bonusBox,bonusComment)
  optionsGroup.append(optionsLabel,optionLine,optionsError)
  if (editMode) { optionsGroup.append(bonusLine) }
  const buttondisplay = document.createElement('div')
  buttondisplay.className = "testmanager-body-add-buttongroup"
  const b1 = document.createElement('button')
  b1.innerText = editMode ? "Save" : "Delete"
  b1.className = "testmanager-body-add-buttongroup-delete"
  b1.onclick = () => {
    if (editMode) {
      if (div.clickButn) {div.clickButn()}
      return
    }
    div.remove()
    if (localStorage.getItem("teacher_temporary_store")) {
      const store = JSON.parse(localStorage.getItem("teacher_temporary_store"))
      if (store[uuid]) {
        store[uuid][id] = undefined
      }
      localStorage.setItem("teacher_temporary_store",JSON.stringify(store))
    }
  }
  buttondisplay.append(b1)
  div.append(idElem,nameGroup,nameError,optionsGroup,buttondisplay)
  return div
}

export function render_bank_question(uuid,questions,handle) {
  const body = document.querySelector(".testmanager-body")
  if (!body || !questions) {
    return
  }
  body.innerHTML = ""
  questions.forEach((question,no) => {
    const letters = ["A","B","C","D"]
    const obj = document.createElement("p")
    obj.innerHTML += `${no+1}. `
    if (question.answer === 5) {
      obj.innerHTML += `<span class="testmanager-viewall-answer"> (Bonus) </span>`
    }
    obj.innerHTML += `<span>${question.question}</span>`
    question.options.forEach((option,i) => {
      const isBold = (i+1) === question.answer
      const bold = isBold ? `class="testmanager-viewall-answer"` : ""
      const text = `<span ${bold}> ${letters[i]}. ${option}</span>`
      obj.innerHTML += text
    })
    const editButn = document.createElement("button")
    editButn.innerText  = "Edit"
    editButn.classList.add("testmanager-viewall-button")
    editButn.onclick = () => handle("editquestions",uuid,null,no,question)
    const deleteButn = document.createElement("button")
    deleteButn.innerText  = "Delete"
    deleteButn.onclick = () => handle("deletequestions",uuid,null,no,question.question)
    deleteButn.classList.add("testmanager-viewall-button")
    body.append(obj,editButn,deleteButn)
  })
}

export function renderConfirmationDialog(dialog,question,no,onclick) {
  dialog.innerHTML = ""
  const confirmation = document.createElement("p")
  confirmation.innerText = `Do you want to delete question ${no}?`
  const questionHint = document.createElement("p")
  questionHint.innerText = `"${question.substr(0,15)}..."`
  const yes = document.createElement("button")
  yes.onclick = () => onclick(true)
  yes.innerText = "Yes"
  yes.classList.add("testmanager-viewall-button")
  const cancel = document.createElement("button")
  cancel.innerText = "Cancel"
  cancel.classList.add("testmanager-viewall-button")
  cancel.onclick = () => onclick(false)
  dialog.append(confirmation,questionHint,yes,cancel)
}

export function renderEditQuestions(uuid,questions,no,handle) {
  const displayno = no +1
  const body = document.querySelector(".testmanager-body")
  if (!body) {
    return;
  }
  body.innerHTML = ''
  const header = document.createElement("p")
  header.className = 'testmanager-body-add-header'
  header.innerText = `Editing Question ${displayno}`
  const div = create_question_display(
    displayno,questions.question,
    questions.options,questions.answer,uuid,true
  )
  const onclick = async () => {
    console.log(div)
    const name = div.questionText
    const answer = div.answerNo
    const option = div.optionsArray
    const question = {
      "question": name,
      "options": option,
      "answer": answer,
      "finished": true
    }
    
    if (!name || !answer || !option) {
      return
    }
    let safe = true
    option.forEach(i => {if (i.length < 1) {safe = false}})
    if (!safe) {return}
    await test.replace(uuid,no,question)
    console.log(question)
    handle("viewquestions",uuid)
  }
  div.clickButn = onclick
  body.append(header,div)
}