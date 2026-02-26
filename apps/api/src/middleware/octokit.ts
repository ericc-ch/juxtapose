import { Octokit } from "octokit"
import { createMiddleware } from "hono/factory"
import type { HonoContext } from "../types"

export const octokitMiddleware = createMiddleware<HonoContext>(async (c, next) => {
  const tokenResponse = await c.var.auth.api.getAccessToken({
    headers: c.req.raw.headers,
    body: {
      providerId: "github",
    },
  })

  if (tokenResponse.accessToken) {
    c.set("octokit", new Octokit({ auth: tokenResponse.accessToken }))
  } else {
    c.set("octokit", undefined)
  }

  return await next()
})
