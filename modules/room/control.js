const exitButn = document.getElementById("main-butn-exit")
const windowSpawnerForm = document.getElementById("window-spawner-form")
const windowSpawnerInput = document.getElementById("window-spawner-input")
const windowSpawnerSelect = document.getElementById("window-spawner-select")
exitButn.onclick = () => window.close()
windowSpawnerForm.onsubmit = (evt) => {
  evt.preventDefault()
  main.newWindow(windowSpawnerSelect.value,windowSpawnerInput.value)
  console.log("Submitted")
  windowSpawnerInput.value = ""
}