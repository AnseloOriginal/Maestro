import * as render from "./dashboard-elements/render/resultviewerspecific.js"
const content = document.getElementById("content")
const external = document.getElementById("external")

async function loadResult() {
  let result = await window.test.result().replace("--result=","")
  try {
    result = JSON.parse(result);
  } catch (e) {
    result = false
  }

  let data = await window.test.data().replace("--data=","")
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = "Unknown Exam"
  }
  const handler = (event,...extras) => {
    if (event === "corrections") {
      //extras0 - data, extras1 - content div
      sessionStorage.setItem("testdata",JSON.stringify(extras[0].test))
      sessionStorage.setItem("testmode","correction")
      external.style.display = "block"
      external.style.position = "absolute"
      external.style.height = `${window.innerHeight - 100}px`
      external.src = "./external/testing/testing.html"
      render.renderTopBar(extras[1],handler,extras[0])
    } else if (event === "results") {
      external.style.display = "none"
      render.renderData(extras[1],extras[0],extras[2])
    }
  }
  document.title = "Result - "+data
  console.log(result)
  render.renderData(content,result,handler)
}

loadResult()