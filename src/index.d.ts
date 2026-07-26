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
      serverNotesInfo: (index: number, term: string) => Promise<string[]>
    }

    fs: {
      recents: () => Promise<string[]>
      notes: () => Promise<string[]>
      open:  (name: string) => Promise<void>
    }
  }
}