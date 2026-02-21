import { RpcGroup } from "@effect/rpc"
import { BooksRpcGroup } from "./books/contract"
import { RepositoriesRpcGroup } from "./repositories/contract"
export * from "./errors"

export const RootRpcGroup = RpcGroup.make()
  .merge(BooksRpcGroup)
  .merge(RepositoriesRpcGroup)
