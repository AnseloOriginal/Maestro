type icons = "file_open"
export class IconButn {
  root: HTMLButtonElement = document.createElement("button")
  constructor(
    name: string,
    buttonstyle: string,
    textsyle:string,
    icon: icons
  ) {

    this.root.className = buttonstyle
    this.root.innerHTML = `
      <span class="material-symbols-rounded" title="Notes" style="font-size: 50px;">${icon}</span>
      <p class="${textsyle}">${name}</p>
    `
  }
}