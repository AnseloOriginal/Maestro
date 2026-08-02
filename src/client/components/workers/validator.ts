import { SchemaTypes } from "../../cache/types"
import {getValue,updateValue} from "../../cache/cache"

type AccessLevels = 0 | 1 

export class Validator {
  userinfo: null | SchemaTypes["username"] = null
  freshUserInfo: boolean = false

  async validate() {
    if (this.freshUserInfo) {
      return
    }
    const onlineUserInfo = await window.server.serverUserInfo()
    const failed = typeof onlineUserInfo?.["username"] !== "string"

    if (failed && this.userinfo)  {
      //Return since the user info already exists from cache
      return
    }
    if (failed) {
      const cachedUserinfo = getValue("username",false)
      console.log("Offline User Info",cachedUserinfo)
      this.userinfo = cachedUserinfo ? cachedUserinfo : null
    } else {
      this.freshUserInfo = true
      this.userinfo = onlineUserInfo
      updateValue("username",onlineUserInfo)
    }
  }

  accessLevel(): AccessLevels  {
    if (!this.userinfo) {
      return 0
    }
    if (!this.userinfo.verified || this.userinfo.student) {
      return 0
    }
    return 1
  }

}