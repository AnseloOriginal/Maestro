import * as dashboard from "./dashboard/render.ts"
import * as base from "./base/render.ts"

export type AvailableViews = 
"dashboard" |
"base"

export const VIEWS = {
  dashboard: {
    render: dashboard.render,
    update: dashboard.update
  },
  base: {
    render: base.render,
    update: base.update
  }
}