export function generate_notes_pages(page,barray,rarray,section,sorting,availablesort,hook){
  if (section==="main") {
    page.innerHTML = "<h1> Notes </h1>"
    const recents = generate_recents(rarray)
    const offline = generate_offline_notes(barray,sorting)
    page.append(recents)
    page.append(offline)
  } else if (section==="online") {
    page.innerHTML = 
    `<button class="notes-online-back notes-classic-button"> Back </button>
    <h1> School Notes </h1>`
    const online = generate_online_notes(barray,sorting,availablesort)
    page.append(online)
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

function generate_offline_notes(barray,sort) {
  const offline = document.createElement("div")
  offline.setAttribute("class","notes-offline")
  offline.innerHTML = 
  `<h3 class="notes-offline-header"> Offline </h3> 
  <div class="notes-offline-options"> 
    <datalist id="gensubject">
      <option value="Maths"></option>
      <option value="English"></option>
      <option value="Science"></option>
    </datalist>
    <input type="search" class="notes-offline-options-sort" list="gensubject" placeholder="Search Notes" value="${sort}" inputmode="search">
    <button class="notes-offline-options-online notes-classic-button"> Browse Online Notes </button>
  </div>`
  const butngroup = document.createElement("div")
  butngroup.setAttribute("class","offline-butn-group")
  if (barray.length > 0) {
    barray.forEach(element => {
      const lowerCase1 = element.toLowerCase()
      const lowerCase2 = sort.toLowerCase()
      if (lowerCase1.includes(lowerCase2)){
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

function attachHooks(hook,section) {
 const offlineSearchButton = document.querySelector(".notes-offline-options-sort")
 const offlineBrowseButton = document.querySelector(".notes-offline-options-online")
 const onlineSorter = document.querySelector(".notes-online-sorter")
 const onlineBack = document.querySelector(".notes-online-back")
 const downloadNoteButton = document.getElementsByName("notes-online-download-note")
 const openButton = document.getElementsByName("notes-offline-open-note")
 const recentsButton = document.getElementsByName("notes-recents-button")

 if (offlineSearchButton) {
  offlineSearchButton.oninput = () => {
    regenerate_offline_notes(offlineSearchButton.value)
  }
 }
 if (offlineBrowseButton) {
  offlineBrowseButton.onclick = () => {
    hook("screen","notes-online")
  }
 }
 if (onlineSorter) {
  onlineSorter.onchange = () => {
    regenerate_online_notes(onlineSorter.value)
  }
 }
 if (onlineBack) {
  onlineBack.onclick = () => {
    hook("screen","notes")
  }
 }
 downloadNoteButton.forEach((button)=>{
  button.onclick = () => {
    hook("download", button.getAttribute("content"))
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
  sort = sort.toLowerCase()
  allButtons.forEach(button => {
    const content = button.getAttribute("content")
    if (content.includes(sort)) {
      button.style.display = "inline"
    } else {
      button.style.display = "none"
    }
  });
}


function regenerate_online_notes(sort){
  const allButtons = document.getElementsByName("notes-online-download-note")
  sort = sort.toLowerCase()
  allButtons.forEach(button => {
    const content = button.getAttribute("content")
    if (content.includes(sort)) {
      button.style.display = "inline"
    } else {
      button.style.display = "none"
    }
  });
}

function generate_online_notes(barray,sort,availablesort) {
  const online = document.createElement("div")
  online.setAttribute("class","notes-online")
  const butngroup = document.createElement("div")
  const sorter = document.createElement("select")
  sorter.setAttribute("class","notes-online-sorter")
  const all = document.createElement("option")
  all.innerText = "All"
  all.value = ""
  sorter.add(all);
  availablesort.forEach(sorts => {
    const newsort = document.createElement("option")
    newsort.innerText = sorts
    newsort.value = sorts
    sorter.add(newsort);
  });
  online.append(sorter)
  if (barray.length > 0) {
    barray.forEach(element => {
      const lowerCase1 = element.toLowerCase()
      const lowerCase2 = sort.toLowerCase()
      if (lowerCase1.includes(lowerCase2)){
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