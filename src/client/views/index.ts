import * as dashboard from "./dashboard/render.ts"
import * as base from "./base/render.ts"
import * as notes from "./notes/render.ts"

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
  }
}