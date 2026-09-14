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

export interface MediaLibrary {
  content: MediaSection[]
  offline: boolean
}

interface MediaSection {
  title: string
  group: MediaVideo[]
}

export interface MediaVideo {
  imageID: string
    title: string
    videoID: string
    downloads: boolean
    source?: string
}

export interface TestDetails {
  duration?: number
  calculator?: boolean
}

export interface TestQuestion {
  options: string[]
  question: string
  preanswer?: number | string
}

export type TestQuestions = {[name: string]: TestQuestion[][]}

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
      toVideoURL: (id: string) =>  Promise<string>
      toImageURL: (id: string) =>  Promise<string>
      library: () => Promise<MediaLibrary>
    }
    test: {
      names: (type: "scheduled" | "special" | "public") => Promise<[string, string][]>
      offline: () => Promise<{[key: string]: number[], }>,
      details: (uuid: string, type: string) => Promise<TestDetails | undefined>,
      questions: (uuid: string, type: string) => Promise<TestQuestions | undefined | "OUT_OF_RETRIES" | "USER_HAS_SUBMITTED">
      results: (uuid: string,section: string,sub: number,ques: number,answer: number,type: string) => Promise<boolean>,
      submit: (uuid: string,location: string) => Promise<boolean>
      displayResult: (uuid: string,location:string,examName: string)  => Promise<void>
      variable: (action: "get" | "set",uuid: string,name: string, content: string | number | null,location: string) => Promise<string | number | undefined>
      upload: (uuid: string, answers: TestQuestions) => Promise<boolean>
    }
  }
}