Vite + React + TanStack Start (SPA) + Effect RPC

## Architecture

Uses Effect RPC over HTTP via @effect-atom/atom-react for type-safe client-server communication:

- **Effect RPC** - Type-safe RPC calls using @effect/rpc with HTTP protocol
- **TanStack Start** - SPA mode with file-based routing via @tanstack/react-start
- **Cloudflare** - Deployed via Alchemy integration

References:

- apps/web/src/lib/rpc.ts - Effect RPC client configuration
- apps/web/src/routes/\_\_root.tsx - Root route with RegistryProvider

## Effect RPC

Uses @effect-atom/atom-react for RPC client integration with Effect RPC over HTTP:

- RPC client defined in `lib/rpc.ts` using `AtomRpc.Tag`
- Wrap app in `RegistryProvider` (already in \_\_root.tsx)
- RPC protocol uses HTTP with JSON serialization
- API contracts are defined in `api/rpc` (workspace dependency)

**For queries (readonly):**

```typescript
import { useAtomValue } from "@effect-atom/atom-react"
import { RpcClientTag } from "@/lib/rpc"

function MyComponent() {
  const result = useAtomValue(RpcClientTag.query("methodName", payload))
  // result is Result.Result<SuccessType>
}
```

**For mutations:**

```typescript
import { useAtomSet } from "@effect-atom/atom-react"
import { RpcClientTag } from "@/lib/rpc"

function MyComponent() {
  const mutate = useAtomSet(RpcClientTag.mutation("methodName"))
  // Call mutate({ payload, reactivityKeys?: [...] })
}
```

**With reactivity (for automatic cache invalidation):**

```typescript
// Query with reactivity key
const data = useAtomValue(
  RpcClientTag.query("getUsers", void 0, {
    reactivityKeys: ["users"],
  }),
)

// Mutation that invalidates the query
const createUser = useAtomSet(RpcClientTag.mutation("createUser"))
// Call with reactivityKeys to invalidate
createUser({ payload: newUser, reactivityKeys: ["users"] })
```

## Components

shadcn/ui with new-york style, Tailwind v4, Lucide icons. Run from apps/web/.
Uses Base UI (@base-ui/react) instead of Radix UI as the underlying primitive library.

- Search: pnpm dlx shadcn@latest search <query>
- Add: pnpm dlx shadcn@latest add <component>
- List all: pnpm dlx shadcn@latest view @shadcn

References:

- apps/web/components.json

## Typography

Prioritize using semantic text sizes: text-h1, text-h2, text-h3, text-h4, text-lead, text-large, text-body, text-small

References:

- apps/web/src/index.css

## Forms

TanStack Form with Zod validation and shadcn/ui Field components.

- `validators.onSubmit` - Zod schema for field validation
- `onSubmit` handler + `useState` - Server/auth errors (separate from validation)
- `validators.onSubmitAsync` - Async validation only, not submission logic
- `form.Subscribe` - Use for reactive UI (e.g., submit button state)
- `form.state` - Snapshot, not reactive on its own

References:

- apps/web/src/routes/login.tsx

## Authentication

Uses Better Auth with React integration for authentication:

- Import from `better-auth/react` (not `better-auth/client`)
- Base URL configured to point to `/api/auth` on the API
- Client methods return `{ data, error }` - always check for errors

**useSession hook:**

```typescript
import { auth } from "@/lib/auth"

function MyComponent() {
  const { data: session, isPending, error, refetch } = auth.useSession()

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (session) return <div>Welcome {session.user.name}</div>
}
```

**Social sign in (GitHub OAuth):**

```typescript
const { error } = await auth.signIn.social({
  provider: "github",
  callbackURL: window.location.href,
})
if (error) {
  // Handle error
}
```

**Sign out:**

```typescript
await auth.signOut()
```

**Error handling:**

```typescript
const { data, error } = await auth.signIn.social({ provider: "github" })
if (error) {
  console.error(error.message) // Human-readable error message
  console.error(error.status) // HTTP status code
}
```

References:

- apps/web/src/lib/auth.ts - Better Auth client setup
- apps/web/src/routes/index.tsx - Usage example

## Dropdown Menu Gotchas

Uses Base UI primitives (not Radix), which has different requirements:

- **No nested buttons**: `DropdownMenuTrigger` renders as `<button>`, do not wrap with `<Button>` - style the trigger directly with className
- **Label requires Group**: `DropdownMenuLabel` must be wrapped in `DropdownMenuGroup` or you'll get "MenuGroupRootContext is missing" error

References:

- apps/web/src/routes/index.tsx

## Layout Guidelines

Never use margin spacing (`m-*`, `mx-*`, `my-*`, `mt-*`, etc.) or `space-x-*` / `space-y-*` utilities for element spacing. Instead, use:

- **Flex layouts with gaps**: `flex flex-col gap-4` or `flex gap-4`
- **Grid layouts with gaps**: `grid gap-4`

This maintains consistent spacing and makes layouts more maintainable.
