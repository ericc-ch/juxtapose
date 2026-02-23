import * as sqlite from "drizzle-orm/sqlite-core"
import { z } from "zod"

export const books = sqlite.sqliteTable("books", {
  id: sqlite.integer().primaryKey({ autoIncrement: true }),
  title: sqlite.text().notNull(),
  author: sqlite.text().notNull(),
})

export const BookId = z.number().int().positive()

export const Book = z.object({
  id: BookId,
  title: z.string(),
  author: z.string(),
})

export type Book = z.infer<typeof Book>

export const BookInsert = Book.omit({ id: true })
export type BookInsert = z.infer<typeof BookInsert>

export const BookUpdate = BookInsert.partial()
export type BookUpdate = z.infer<typeof BookUpdate>
