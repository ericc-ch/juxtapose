import { z } from "zod"

const envSchema = z.object({
  API_CORS_ORIGIN: z.url().default("http://localhost:5173"),
  API_BETTER_AUTH_SECRET: z.string().min(1),
  API_BETTER_AUTH_URL: z.url().default("http://localhost:1337"),
  API_GITHUB_CLIENT_ID: z.string().min(1),
  API_GITHUB_CLIENT_SECRET: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>
export type EnvType = Env

export const parseEnv = (env: Record<string, string>): Env => {
  return envSchema.parse(env)
}
