export async function renderInteractPage(content,roomData,roomOnclick,createRoomOnclick) {
  const roomBody = document.createElement("div")
  const roomButnSection = document.createElement("div")
  const roomHeader = document.createElement("p")
  const roomCreateButn =  document.createElement("button")
  roomBody.className = "interact-room-container"
  roomButnSection.className = "interact-room-buttons"
  roomHeader.className = "interact-room-header"
  roomHeader.innerHTML = "Rooms"
  roomCreateButn.innerText = "Create"
  roomCreateButn.className = "interact-room-create-butn"
  roomCreateButn.onclick = () =>  createRoomOnclick()
  roomHeader.append(roomCreateButn)
  if (roomData?.length > 0) {
    roomData.forEach(data => {
      const div = roomButton(data,roomOnclick)
      roomButnSection.append(div)
    });
  } else {
    const notAvailable = document.createElement("p")
    notAvailable.innerText = "Seems there isn't any room right now. Try again later."
    roomButnSection.append(notAvailable)
  }
  roomBody.append(roomHeader,roomButnSection)
  content.append(roomBody)
}

function roomButton(data,onclick) {
  const div = document.createElement("div")
  div.className = "interact-room-butn-container"
  const p =  document.createElement("p")
  const button =  document.createElement("button")
  p.innerHTML = data?.name || "No Name"
  button.innerHTML = "Join"
  button.onclick = () => onclick(data)
  div.append(p,button)
  return div
}

export function renderCreateDialog(dialog,onCreate) {
  const name = document.createElement("p")
  name.className = "interact-room-create-name-header"
  name.innerHTML = "Name:"
  const nameInput = document.createElement("input")
  const createButn = document.createElement("button")
  createButn.innerText = "Create"
  const butnDiv = document.createElement("div")
  butnDiv.append(createButn)
  createButn.onclick = () => onCreate(nameInput.value)
  dialog.append(name,nameInput,butnDiv)
}