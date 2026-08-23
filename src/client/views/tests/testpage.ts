import { getValue } from "../../cache/cache.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { BaseTestWindow } from "./base.ts"
import { convertOfflineTestToTuple, secToMinutes } from "./helpers.ts"
import { ListGenerator, mainHandlerFunc } from "./list-generator.ts"

export const initialRendering =  async (
  maincontainer: HTMLDivElement, 
  handleOnClick: mainHandlerFunc
) => {
  const publicBanks = getValue("public banks", false) || await window.test.names("public")

  const scheduled = await window.test.names("scheduled")
  const special = await window.test.names("special")
  const pastOfflineTests = await window.test.offline()
  const offlineTestNormalized = convertOfflineTestToTuple(pastOfflineTests,publicBanks)

  const comingSoonTag = document.createElement("p")
  comingSoonTag.innerHTML = "Functionality will return in newer versions."

  const offlinePastTest = new ListGenerator(
      "Past Offline Tests",
      offlineTestNormalized,
      [
        ["Continue","continue"],
        ["Delete","delete"]
      ],
      "offline"
  ) //Coming soom
  offlinePastTest.body.innerHTML = ""
  offlinePastTest.body.append(comingSoonTag)
  const offlineTest = new BaseTestWindow("New Offline Test")
  offlineTest.body.append(comingSoonTag)

  maincontainer.innerHTML = ""
  maincontainer.append(
    (new ListGenerator(
      "Planned Exams",
      scheduled,
      [["Start","start"]],
      "scheduled",
      handleOnClick
    )).root,
    offlineTest.root,
    (new ListGenerator(
      "Special Exams",
      special,
      [["Start","start"]],
      "special",
      handleOnClick
    )).root,
    offlinePastTest.root
  )
}

export const preSelection = async (
  container: HTMLDivElement,
  uuid: string,
  type: string,
  name: string,
  handleOnClick: mainHandlerFunc
) => {
  container.innerHTML = ""
  container.append(
    (new LoadingSign).root
  )
  const details = await window.test.details(uuid,type)

  container.innerHTML = ""
  const text = document.createElement('p')
  text.innerHTML = `You're about to start a test`
  text.className = "test-confirmation-text"

  const info = document.createElement("div")
  info.innerHTML = `
    <p><span>Test Name:</span><span>${name}</span>
    <p><span>Duration:</span><span>${secToMinutes(details?.duration) || "Unknown"} Minutes</span>
    <p><span>Calculator Allowed:</span><span>${details?.calculator === true ? "Yes" : "No"}</span>
  `
  info.classList.add("test-confirmation-info")
  
  const butnGroup = document.createElement("div")
  butnGroup.className = "test-confirmation-butngroup"
  const yes =  document.createElement('button')
  yes.onclick = () => handleOnClick("mainstart",uuid,type,name)
  yes.innerText = "Start"
  const no =  document.createElement('button')
  no.onclick = () => handleOnClick("cancel",uuid,type,name)
  no.innerText = "Return"
  butnGroup.append(yes,no)
  container.append(text,info,butnGroup)
}