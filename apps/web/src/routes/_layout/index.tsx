import { Input } from "@/components/ui/input"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

type RepositoryStatus =
  | "pending"
  | "backfilling"
  | "syncing"
  | "active"
  | "error"

interface Repository {
  id: string
  fullName: string
  description: string
  status: RepositoryStatus
  stars: number
  lastSyncAt: number | null
  errorMessage?: string
  issuesCount: number
}

const MOCK_REPOS: Repository[] = [
  {
    id: "1",
    fullName: "facebook/react",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces",
    status: "active",
    stars: 230000,
    lastSyncAt: Date.now() - 1000 * 60 * 5,
    issuesCount: 1247,
  },
  {
    id: "2",
    fullName: "microsoft/vscode",
    description: "Visual Studio Code - open source code editor",
    status: "syncing",
    stars: 160000,
    lastSyncAt: Date.now() - 1000 * 60 * 30,
    issuesCount: 5234,
  },
  {
    id: "3",
    fullName: "vercel/next.js",
    description: "The React Framework for the Web",
    status: "active",
    stars: 120000,
    lastSyncAt: Date.now() - 1000 * 60 * 60 * 2,
    issuesCount: 892,
  },
  {
    id: "4",
    fullName: "torvalds/linux",
    description: "Linux kernel source tree",
    status: "backfilling",
    stars: 180000,
    lastSyncAt: null,
    issuesCount: 0,
  },
  {
    id: "5",
    fullName: "rust-lang/rust",
    description: "Empowering everyone to build reliable and efficient software",
    status: "error",
    stars: 95000,
    lastSyncAt: Date.now() - 1000 * 60 * 60 * 24,
    errorMessage: "Rate limit exceeded. Retry in 15 minutes.",
    issuesCount: 8234,
  },
  {
    id: "6",
    fullName: "nodejs/node",
    description: "Node.js JavaScript runtime",
    status: "pending",
    stars: 105000,
    lastSyncAt: null,
    issuesCount: 1240,
  },
]

function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) return "Never"
  const hours = (Date.now() - timestamp) / (1000 * 60 * 60)
  return new Intl.RelativeTimeFormat("en").format(-Math.round(hours), "hour")
}

export const Route = createFileRoute("/_layout/")({
  component: function Home() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredRepos = useMemo(() => {
      if (!searchQuery.trim()) return MOCK_REPOS
      const query = searchQuery.toLowerCase()
      return MOCK_REPOS.filter((repo) =>
        repo.fullName.toLowerCase().includes(query),
      )
    }, [searchQuery])

    return (
      <>
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search repositories"
        />

        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="flex items-center justify-between"
            role="listitem"
          >
            <div className="truncate font-mono text-sm">
              <span className="text-muted-foreground">
                {repo.fullName.split("/")[0]}/
              </span>
              <span className="text-foreground">
                {repo.fullName.split("/")[1]}
              </span>
            </div>

            <span className="w-20 text-right">
              {repo.lastSyncAt ? formatRelativeTime(repo.lastSyncAt) : "Queued"}
            </span>
          </div>
        ))}
      </>
    )
  },
})
