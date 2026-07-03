import {Ping} from "./ping"
import { addEventHandler } from "../../events/recieve"
export class Session {
  lastOnlineState: boolean = false
  lastSessionState: boolean = false
  #ping: Ping
  onStateChanged: (session: Session) => void

  constructor() {
    this.#ping = new Ping()
    addEventHandler("server-ping", (evt) => this.#OnPing(evt.online))
    this.onStateChanged = (session: Session) => console.log("State Changed")
  }

  /**
   * Checks for the first time if session is available and starts ping server
   * To be used only once
   */
  firstTry = async () => {
    const hasSession = await window.runtime.newSession()
    this.lastSessionState = hasSession
    await this.#ping.start(true)
    return hasSession
  }

  #OnPing = async (isOnline: boolean) => {
    const onlineStateChanged = this.lastOnlineState != isOnline
    const needSessionCheck = !this.lastSessionState
    if (onlineStateChanged || needSessionCheck) {
      this.lastOnlineState = isOnline
      const isSession = this.lastSessionState ? 
      true : await window.runtime.newSession()
      const sessionChanged = this.lastSessionState != isSession
      this.lastSessionState = isSession // Safe here since we capture it above
      if (sessionChanged || onlineStateChanged) {
        this.onStateChanged(this)
      }
    }
  }
}