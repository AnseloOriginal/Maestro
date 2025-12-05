export function generate_notes_pages(page,barray,rarray,section,sorting,supersort,availablesort,hook){
  if (section==="main") {
    page.innerHTML = "<h1> Notes </h1>"
    const recents = generate_recents(rarray)
    const offline = generate_offline_notes(barray,sorting,supersort)
    page.append(recents)
    page.append(offline)
    regenerate_offline_notes(supersort) //An alternative is needed because this is costly
  } else if (section==="online") {
    page.innerHTML = 
    `<button class="notes-online-back notes-classic-button"> Back </button>
    <h1> School Notes </h1>`
    const online = generate_online_notes(barray,sorting,availablesort,supersort)
    page.append(online)
    regenerate_online_notes(supersort) //An alternative is needed because this is costly
  }
  //Must be called after generation
  attachHooks(hook,section)
}

function create_note_button(name,buttonstyle,textsyle,icon) {
  const button = document.createElement("button")
  button.setAttribute("class",buttonstyle)
  button.innerHTML = `
  <span class="material-symbols-rounded" title="Notes" style="font-size: 50px;">${icon}</span>
  <p class="${textsyle}">${name}</p>
  `
  return button
}

function generate_recents(rarray) {
  const recents = document.createElement("div")
  recents.setAttribute("class","notes-recents")
  recents.id = "recents"
  recents.innerHTML = '<h3 class="notes-recent-header" > Recents </h3>'
  if (rarray.length > 0) {
    rarray.forEach(element => {
      const newbutton = create_note_button(element,"notes-button","notes-button-text","file_open")
      newbutton.setAttribute("name","notes-recents-button")
      newbutton.setAttribute("content",element.toLowerCase())
      recents.append(newbutton)
    });
  } else {
    recents.innerHTML = recents.innerHTML + '<p class="recents-no-notes"> Recently Opened notes will appear here </p>'
  }
  return recents
}

export function refresh_recents(rarray,hook) {
  const recents = document.getElementById("recents")
  if (recents) {
    recents.setAttribute("class","notes-recents")
    recents.innerHTML = '<h3 class="notes-recent-header" id="recents"> Recents </h3>'
    if (rarray.length > 0) {
      rarray.forEach(element => {
        const noteName = element.toLowerCase()
        const newbutton = create_note_button(element,"notes-button","notes-button-text","file_open")
        newbutton.setAttribute("name","notes-recents-button")
        newbutton.setAttribute("content",noteName)
        newbutton.onclick = () => {
          hook("file open",noteName)
        }
        recents.append(newbutton)
      });
    } else {
      recents.innerHTML = recents.innerHTML + '<p class="recents-no-notes"> Recently Opened notes will appear here </p>'
    }
  }
}

function extract_subject_name(array,sort) {
  const ret = []
  array.forEach(value  => {
    const seperated = value.split(" ")
    if (seperated[1]) {
      seperated[0] = ""
      const subject_only = seperated.join(" ")
      ret.push(subject_only)
    }
  })
  return ret
}

function generate_offline_notes(barray,sort,supersort) {
  const offline = document.createElement("div")
  const subject_only = extract_subject_name(barray)
  let datalist = ""
  subject_only.forEach( subject => {
    datalist = datalist + `<option value="${subject}"></option>`
  })
  offline.setAttribute("class","notes-offline")
  offline.innerHTML = 
  `<h3 class="notes-offline-header"> Offline </h3> 
  <div class="notes-offline-options"> 
    <datalist id="gensubject"> 
      ${datalist}
    </datalist>
    <select class="notes-offline-select-term">
      <option value="firstterm">First Term</option>
      <option value="secondterm">Second Term</option>
      <option value="thirdterm">Third Term</option> 
    </select>
    <input type="search" class="notes-offline-options-sort" list="gensubject" placeholder="Search Notes" value="${sort}" inputmode="search">
    <button class="notes-offline-options-online notes-classic-button"> Browse Online Notes </button>
  </div>`
  const butngroup = document.createElement("div")
  butngroup.setAttribute("class","offline-butn-group")
  if (barray.length > 0) {
    barray.forEach(element => {
      const lowerCase1 = element.toLowerCase()
      const lowerCase2 = ""//supersort.toLowerCase() + " " + sort.toLowerCase() Used for sorting before 1.9
      if (lowerCase1.includes(lowerCase2)){
        element = element.replace("firstterm","") //Removes supersort
        element = element.replace("thirdterm","") //Removes supersort
        element = element.replace("secondterm","") //Removes supersort
        console.log(element)
        const newbutton = create_note_button(element,"notes-button","notes-button-text","file_open")
        newbutton.setAttribute("content",lowerCase1)
        newbutton.setAttribute("name","notes-offline-open-note")
        butngroup.append(newbutton)
      }
    });
  } else {
    offline.innerHTML = offline.innerHTML + '<p class="offline-no-notes"> No offline notes available here </p>'
  }
  offline.append(butngroup)
  return offline
}

function attachHooks(hook,section,supersort) {
 const offlineSearchButton = document.querySelector(".notes-offline-options-sort")
 const offlineBrowseButton = document.querySelector(".notes-offline-options-online")
 const onlineSorter = document.querySelector(".notes-online-sorter")
 const onlineBack = document.querySelector(".notes-online-back")
 const onlineTextSorter = document.querySelector(".notes-online-text-sorter")
 const onlineTermSelector = document.querySelector(".notes-online-term-sorter")
 const downloadNoteButton = document.getElementsByName("notes-online-download-note")
 const openButton = document.getElementsByName("notes-offline-open-note")
 const recentsButton = document.getElementsByName("notes-recents-button")
 const offlineSelectTermButton = document.querySelector(".notes-offline-select-term")
 
 if (offlineSelectTermButton) {
    if (supersort === "firstterm") {
      offlineSelectTermButton.selectedIndex = 0
    } else if (supersort === "secondterm") {
      offlineSelectTermButton.selectedIndex = 1
    } else if (supersort === "thirdterm") {
      offlineSelectTermButton.selectedIndex = 2
    }
  offlineSelectTermButton.addEventListener("change",evt => {
    const supersort = evt.target.value
    const extraSearch = offlineSearchButton?.value
    if (extraSearch) {
      regenerate_offline_notes(supersort+" "+extraSearch) 
    } else {
      regenerate_offline_notes(supersort)
    }
  })
 }

 if (offlineSearchButton) {
  offlineSearchButton.oninput = () => {
    const extraSearch = offlineSelectTermButton ? offlineSelectTermButton.value + " ": ""
    regenerate_offline_notes(extraSearch + offlineSearchButton.value)
  }
 }

 if (onlineTermSelector) {
    if (supersort === "firstterm") {
      onlineTermSelector.selectedIndex = 0
    } else if (supersort === "secondterm") {
      onlineTermSelector.selectedIndex = 1
    } else if (supersort === "thirdterm") {
      onlineTermSelector.selectedIndex = 2
    }
    onlineTermSelector.addEventListener("change",evt => {
      const supersort = evt.target.value
      const extraSearch1 = onlineSorter ? " " + onlineSorter.value : "" //same as offlineSearchButton
      const extraSearch2 = onlineTextSorter ? " " + onlineTextSorter.value : "" //same as offlineSearchButton
      const sortstring = supersort+extraSearch1+extraSearch2
      regenerate_online_notes(sortstring)
      console.log(sortstring)
    })
 }

  if (onlineTextSorter) {
    onlineTextSorter.oninput = () => {
      const supersort = onlineTermSelector.value
      const extraSearch1 = onlineSorter ? " " + onlineSorter.value : "" //same as offlineSearchButton
      const extraSearch2 = onlineTextSorter ? " " + onlineTextSorter.value : "" //same as offlineSearchButton
      const sortstring = supersort+extraSearch1+extraSearch2
      regenerate_online_notes(sortstring)
      console.log(sortstring)
    }
  }
 if (offlineBrowseButton) {
  offlineBrowseButton.onclick = () => {
    hook("screen","notes-online")
  }
 }
 if (onlineSorter) {
  onlineSorter.onchange = () => {
    const supersort = onlineTermSelector.value
    const extraSearch1 = onlineSorter ? " " + onlineSorter.value : ""
    const extraSearch2 = onlineTextSorter ? " " + onlineTextSorter.value : "" //same as offlineSearchButton
    const sortstring = supersort+extraSearch1+extraSearch2
    regenerate_online_notes(sortstring)
    console.log(sortstring)
  }
 }
 if (onlineBack) {
  onlineBack.onclick = () => {
    hook("screen","notes")
  }
 }
 downloadNoteButton.forEach((button)=>{
  button.onclick = () => {
    button.id = button.getAttribute("content")
    hook("download", button.getAttribute("content"), button)
    //button.disabled = true
  }
 })
  openButton.forEach((button)=>{
    button.onclick = () => {
      hook("file open", button.getAttribute("content"))
      
    }
 })
  recentsButton.forEach((button)=>{
    button.onclick = () => {
      hook("file open", button.getAttribute("content"))   
    }
 })
}

function regenerate_offline_notes(sort){
  const allButtons = document.getElementsByName("notes-offline-open-note")
  const sort1 = sort.toLowerCase().split(" ")[0] //the term
  let sort2 = ""
  const remsort = sort.toLowerCase().split(" ")
  remsort.shift()
  if (remsort) {
    sort2 = remsort.join(" ")
  }
  allButtons.forEach(button => {
    const content = button.getAttribute("content")
    if (content.includes(sort1) && content.includes(sort2)) {
      button.style.display = "inline"
    } else {
      button.style.display = "none"
    }
  });
}


function regenerate_online_notes(sort){
  const allButtons = document.getElementsByName("notes-online-download-note")
  const sort1 = sort.toLowerCase().split(" ")[0] //the term
  let sort2 = ""
  const remsort = sort.toLowerCase().split(" ")
  remsort.shift()
  if (remsort) {
    sort2 = remsort.join(" ")
  }
  allButtons.forEach(button => {
    const content = button.getAttribute("content")
    //console.log(content,sort)
    if (content.toLowerCase().includes(sort1.toLowerCase()) && 
    content.toLowerCase().includes(sort2.toLowerCase())) {
      button.style.display = "inline"
    } else {
      button.style.display = "none"
    }
  });
}

function generate_online_notes(barray,sort,availablesort,supersort) {
  const online = document.createElement("div")
  online.setAttribute("class","notes-online")
  const butngroup = document.createElement("div")
  const ctrlgroup = document.createElement("div")
  const termselection = document.createElement("select")
  termselection.setAttribute("class","notes-online-term-sorter")
  termselection.innerHTML = `
  <option value="firstterm">First Term</option>
  <option value="secondterm">Second Term</option>
  <option value="thirdterm">Third Term</option>
  `
  const sorter = document.createElement("select")
  sorter.setAttribute("class","notes-online-sorter")
  ctrlgroup.setAttribute("class","notes-online-control-group")
  const all = document.createElement("option")
  all.innerText = "All"
  all.value = ""
  sorter.add(all);
  const textsort = document.createElement("input")
  textsort.placeholder = "Search Notes"
  textsort.setAttribute("class","notes-online-text-sorter")
  availablesort.forEach(sorts => {
    const newsort = document.createElement("option")
    newsort.innerText = sorts
    newsort.value = sorts
    sorter.add(newsort);
  });
  ctrlgroup.append(termselection)
  ctrlgroup.append(sorter)
  ctrlgroup.append(textsort)
  online.append(ctrlgroup)
  if (barray.length > 0) {
    barray.forEach(element => {
      const lowerCase1 = element.toLowerCase()
      const lowerCase2 = ""//supersort.toLowerCase()+ " " +sort.toLowerCase() //Sorting not needed before generation
      if (lowerCase1.includes(lowerCase2)){
        element = element.replace("firstterm","") //Removes supersort
        element = element.replace("secondterm","") //Removes supersort
        element = element.replace("thirdterm","") //Removes supersort
        const newbutton = create_note_button(element,"notes-button","notes-button-text","file_download")
        newbutton.name = "notes-online-download-note" 
        newbutton.setAttribute("content",lowerCase1)
        newbutton.setAttribute("name","notes-online-download-note")
        butngroup.append(newbutton)
      }
    });
  } else {
    online.innerHTML = online.innerHTML + '<p class="offline-no-notes"> No school note available here. Contact Admin </p>'
  }
  online.append(butngroup)
  return online
}

export function disable_download_buttons(barray) {
  const downloadNoteButton = document.getElementsByName("notes-online-download-note")
  downloadNoteButton.forEach((button) => {
    const content = button.getAttribute("content").toLowerCase()
    if (barray.includes(content)) {
      button.disabled = true
    } else {
      button.disabled = false
    }
  })
}