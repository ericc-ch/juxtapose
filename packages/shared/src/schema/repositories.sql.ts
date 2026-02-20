import * as sqlite from "drizzle-orm/sqlite-core"
import { Schema } from "effect"

export const repositoryStatus = [
  "pending",
  "backfilling",
  "syncing",
  "active",
  "error",
] as const

export type RepositoryStatus = (typeof repositoryStatus)[number]

export const repositories = sqlite.sqliteTable("repositories", {
  fullName: sqlite.text().primaryKey(),
  status: sqlite.text({ enum: repositoryStatus }).notNull().default("pending"),
  lastSyncAt: sqlite.integer().notNull().default(0),
  errorMessage: sqlite.text(),
  createdAt: sqlite.integer().notNull(),
  updatedAt: sqlite.integer().notNull(),
})

export const RepositoryFullName = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/),
)

export const RepositoryId = RepositoryFullName

export const RepositoryStatus = Schema.Literal(...repositoryStatus)

export class Repository extends Schema.Class<Repository>("Repository")({
  fullName: RepositoryFullName,
  status: RepositoryStatus,
  lastSyncAt: Schema.Number.pipe(Schema.int()),
  errorMessage: Schema.optionalWith(Schema.String, { as: "Option" }),
  createdAt: Schema.Number.pipe(Schema.int()),
  updatedAt: Schema.Number.pipe(Schema.int()),
}) {}

export const RepositoryInsert = Schema.Struct(Repository.fields)

export const RepositoryUpdate = Schema.partial(
  Schema.Struct({
    status: Repository.fields.status,
    lastSyncAt: Repository.fields.lastSyncAt,
    errorMessage: Repository.fields.errorMessage,
    updatedAt: Repository.fields.updatedAt,
  }),
)
