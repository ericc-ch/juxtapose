import * as books from "./books.sql"
import * as repositories from "./repositories.sql"

export const schema = {
  ...books,
  ...repositories,
}

export * from "./books.sql"
export * from "./repositories.sql"
