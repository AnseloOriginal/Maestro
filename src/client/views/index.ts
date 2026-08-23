import * as dashboard from "./dashboard/render.ts"
import * as base from "./base/render.ts"
import * as notes from "./notes/render.ts"
import * as tests from "./tests/render.ts"
import * as videos from "./videos/render.ts"
import * as videosPlayer from "./videoplayer/render.ts"
import * as test from "./test/render.ts"

export type AvailableViews = keyof typeof VIEWS
export const VIEWS = {
  dashboard: {
    render: dashboard.render,
    update: dashboard.update
  },
  base: {
    render: base.render,
    update: base.update
  },
  notes: {
    render: notes.render,
    update: notes.update
  },
  tests: {
    render: tests.render,
    update: tests.update
  },
  videos: {
    render: videos.render,
    update: videos.update
  },
  "video-player": {
    render: videosPlayer.render,
    update: videosPlayer.update
  },
  'test': {
    render: test.render,
    update: test.update
  }
}