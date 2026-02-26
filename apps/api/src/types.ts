import type { Octokit } from "octokit"
import type { createAuth } from "./lib/auth"
import type { Database } from "./lib/db"

type EnvWithStorage = Env & {
  STORAGE: R2Bucket
}

export type HonoContext = {
  Bindings: EnvWithStorage
  Variables: {
    db: Database
    auth: ReturnType<typeof createAuth>
    octokit: Octokit | undefined
  }
}
