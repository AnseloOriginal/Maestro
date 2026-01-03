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

export function rerender_create_page(
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
  const start = bankinfo.no || 0
  body.append(header)

  const questionContainer = document.createElement("div")
  let count = 1;
  if (existing) {
    existing.forEach((question,id) => {
      if (!question) {return}
      const div = create_question_display((start+id),question.question,question.options,question.answer,bankinfo.uuid)
      questionContainer.append(div)
    })
    count = existing.length
  }

  const buttondisplay =  document.createElement("div")
  buttondisplay.className = "testmanager-body-buttongroup"
  const createButn = document.createElement("button")
  createButn.onclick = () => {
    const div = create_question_display((start+count),undefined,undefined,undefined,bankinfo.uuid)
    questionContainer.append(div)
    count++
  }
  createButn.innerText = "Add Question"
  const finishButn = document.createElement("button")
  finishButn.innerText = "Finish"
  finishButn.onclick = () => {
    let allTrue = true
    let firstFocus = true
    let mainStore = localStorage.getItem("teacher_temporary_store")
    if (mainStore) {
      mainStore = JSON.parse(mainStore)
      const questionStore = mainStore[bankinfo.uuid]
      if (questionStore) {
        questionStore.forEach((question,id) => {
          if (!question) {return}
          let justTrue = true
          if (!question.question) {
            const nameError = document.getElementById("testmanager-body-add-name-error"+id)
            nameError.focus()
            nameError.style.display = "block"
            allTrue = false
            justTrue = false
          }
    
          const a = question.options.reduce((f,c) => {
            if (c) {
              return f + 1
            } else {
              return 0
            }
          },0)

          if (a < 4) {
            const error = document.getElementById("testmanager-body-add-option-error"+id)
            error.style.display = 'block'
            error.innerText = "Please fill out all 4 options"
            allTrue = false
            justTrue = false
          } else {
            if (!question.answer) {
              const error = document.getElementById("testmanager-body-add-option-error"+id)
              error.style.display = 'block'
              error.innerText = "Please select an answer"
              allTrue = false
              justTrue = false  
            }
          }
          if (justTrue) {
            question.finished = true
          }
        })
      }
      localStorage.setItem("teacher_temporary_store",JSON.stringify(mainStore))
    }
    if (allTrue) {
      hook("changescreen","test-manager")
    }
  }
  buttondisplay.append(createButn,finishButn)
  body.append(questionContainer,buttondisplay)
}

function create_question_display(id,prefillname,prefilledOptions,prefilledAnswer,uuid) {
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
  name.oninput = () => {
    if (nameError.style.display === "block") {
      nameError.style.display = "none"
    }
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
    }
    radio.oninput = () => {
      if (optionsError.style.display === "block") {
        optionsError.style.display = "none"
      }
      let store = getStore()
      store[uuid][id].answer = i
      saveStore(store)
    } 
    option.oninput = () => {
      if (optionsError.style.display === "block") {
        optionsError.style.display = "none"
      }
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
  optionsGroup.append(optionsLabel,optionLine,optionsError)
  const buttondisplay = document.createElement('div')
  buttondisplay.className = "testmanager-body-add-buttongroup"
  const b1 = document.createElement('button')
  b1.innerText = "Delete"
  b1.className = "testmanager-body-add-buttongroup-delete"
  b1.onclick = () => {
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