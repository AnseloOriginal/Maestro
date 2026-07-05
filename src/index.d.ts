export {};
import { SchemaTypes } from "./client/cache/types";

interface FailedUserInfo {
  failed?: true
}
type PassedUserInfo = SchemaTypes["username"]
type SessionFailureUserInfo = [number, string]
type UserInfo = PassedUserInfo & FailedUserInfo & SessionFailureUserInfo

declare global {
  interface Window {
    runtime: {
      init: () => Promise<0 | 1 | 2>;
      serverOnline: () => Promise<boolean>;
      newSession: () => Promise<boolean>;
    };

    server: {
      serverUserInfo: () => Promise<UserInfo>;
    }
  }
}