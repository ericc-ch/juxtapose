import * as sqlite from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const repositories = sqlite.sqliteTable(
  "repositories",
  {
    id: sqlite.integer().primaryKey({ autoIncrement: true }),
    owner: sqlite.text().notNull(),
    repo: sqlite.text().notNull(),
    lastSyncAt: sqlite.integer().notNull().default(0),
    createdAt: sqlite.integer().notNull(),
    updatedAt: sqlite.integer().notNull(),
  },
  (table) => [sqlite.unique("owner_repo_unique").on(table.owner, table.repo)],
)

export const repositorySchema = createSelectSchema(repositories)
export type Repository = z.infer<typeof repositorySchema>

export const repositoryInsertSchema = createInsertSchema(repositories)
export type RepositoryInsert = z.infer<typeof repositoryInsertSchema>

export const repositoryUpdateSchema = createUpdateSchema(repositories)
export type RepositoryUpdate = z.infer<typeof repositoryUpdateSchema>
