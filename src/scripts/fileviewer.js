async function getFileURL(filename) {
  
}
async function generate() {
  if (window.runtime.type() === "node") {
    let filepath = await window.fs.file().replace("--fvfilepath=","")
    let filename = await window.fs.name().replace("--fvfilename=","")
    filepath = encodeURI(filepath)
    if (filepath) {
      document.body.innerHTML = `<p> Loaded ${filepath}`
      document.body.innerHTML = 
      `<iframe id="frame" src="scripts/pdfjs/web/viewer.html?file=${filepath}" width="100%" height="100%"></iframe>`;
    } else {
      document.body.innerHTML = `<p> Error getting file. Please restart.`
    }
    document.title = filename
  } else if (window.runtime.type() === "capacitor") {
    const filename = localStorage.getItem("file")
    const fileurl = await window.urls.notes(filename)
    // document.body.innerHTML = `<iframe id="frame" src="scripts/pdfjs/web/viewer.html?file=${fileurl}" width="100%" height="100%"></iframe>`;
  } else {
    const filename = localStorage.getItem("file")
      document.body.innerHTML = 
      `
      <head>
        <style>
          iframe {
            height: 99vh;
          }
        </style>
      </head>
      <body>
        <iframe class="iframe" src="scripts/pdfjs/web/viewer.html?file=pdfblobaba/${filename}" width="100%" height="100%"></iframe>
      </body>`
      ;
      const name = await fetch(new URL("pdfnameaba",window.location.origin))
      .then(async metaTemp => {
        const meta = await metaTemp.json();
        document.title = meta.name
      }).catch((err) => {
        document.title = "Failed to Get Name"
        console.log(err)
      })
  }
}

generate()
console.log("Generated")