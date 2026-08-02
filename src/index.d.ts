export {};
import { SchemaTypes } from "./client/cache/types";

interface FailedUserInfo {
  failed?: true
}
type PassedUserInfo = SchemaTypes["username"]
type SessionFailureUserInfo = [number, string]
type UserInfo = PassedUserInfo & FailedUserInfo & SessionFailureUserInfo
interface DownloadInfo {
  download: string
  status: "complete" | "error"
}

interface Verse {
  passage: string
  text: string
  version: string
}

declare global {
  interface Window {
    runtime: {
      init: () => Promise<0 | 1 | 2>;
      serverOnline: () => Promise<boolean>;
      newSession: () => Promise<boolean>;
      onDownloadComplete: (
        handler: (details: DownloadInfo) => void
      ) => Promise<void>
    };

    server: {
      serverUserInfo: () => Promise<UserInfo>;
      serverNotesInfo: (index: number, term: string) => Promise<string[]>
    }

    fs: {
      recents: () => Promise<string[]>
      notes: () => Promise<string[]>
      open:  (name: string) => Promise<void>
      download: (name: string) => Promise<string[]>
    }

    sys: {
      appVersion: () => Promise<string>
    }

    media: {
      getBibleVerses: (verse: string) => Promise<Verse | undefined>
    }
  }
}