
const PING_TIME = 1000
type OnPingFunc = ((pingResults: boolean) => void)
import { sendEvent } from "../../events/send"

export class Ping {
  isOnline: boolean
  #ping_id: number
  #funcs: OnPingFunc[] = []
  /**
  * Setups the ping but doesn't start the ping.
  * @constructor
  */
  constructor() {
    this.isOnline = false
    this.#ping_id = -1
  }

  /**
  * Start polling the server. Immediately runs a ping.
  * @param {boolean} sendEvent Run the registered ping functions during first call
  */
  start(sendEvent: boolean) {
    return this.#ping(!sendEvent)
  }

  #ping = async (skipEvents: boolean=false) => { 
    this.isOnline = await window.runtime.serverOnline()
    if (!skipEvents) {
      sendEvent("server-ping",{online: this.isOnline})
    }
    if (this.#funcs.length > 0) {
      this.#funcs.forEach(func => func(this.isOnline))
    }
    this.#ping_id = setTimeout(this.#ping,PING_TIME)
  }

  /**
  * Add a new function to be called on every ping. It is better to listen for the ping event 
  * * @param {OnPingFunc} func - Function called every ping, it takes one boolean representing ping results
  */
  registerOnPing(func: OnPingFunc) {
    this.#funcs.push(func)
  }
}



