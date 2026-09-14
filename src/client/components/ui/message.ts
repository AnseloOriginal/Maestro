export class  MessageDisplay {
  root = document.createElement("div")
  constructor(
    type: "offline" | "error",
    text = "Oops! Find the router"
  ) {
    let icon;
    if (type === "offline") {
      icon = "cloud_off"
    } else if (type === "error") {
      icon = "error"
    }
    this.root.innerHTML = `
      <div class="offline-mode-container">
        <span class="material-symbols-outlined" id="offline-mode-icon" title="Offline Icon">${icon}</span>
        <p class="menu-butn-text" name="offline-mode-text"> ${text} </p>
      </div>
    `
  }

}