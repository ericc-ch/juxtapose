import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useMemo, useState } from "react"

interface Repository {
  fullName: string
  lastSyncAt: number | null
}

function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp || timestamp === 0) return "Never"
  const hours = (Date.now() - timestamp) / (1000 * 60 * 60)
  return new Intl.RelativeTimeFormat("en").format(-Math.round(hours), "hour")
}

export const Route = createFileRoute("/_layout/")({
  component: function Home() {
    const [searchQuery, setSearchQuery] = useState("")

    const {
      data: repos,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["repositories"],
      queryFn: async () => {
        const res = await apiClient.api.repositories.$get()
        if (!res.ok) throw new Error("Failed to fetch repositories")
        const json = (await res.json()) as { data: Repository[] }
        return json.data
      },
    })

    const filteredRepos = useMemo(() => {
      if (!repos) return []
      if (!searchQuery.trim()) return repos
      const query = searchQuery.toLowerCase()
      return repos.filter((repo: Repository) =>
        repo.fullName.toLowerCase().includes(query),
      )
    }, [repos, searchQuery])

    if (isLoading) {
      return (
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search repositories"
            disabled
          />
          <div className="text-muted-foreground py-8 text-center">
            Loading repositories...
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search repositories"
          />
          <div className="text-destructive py-8 text-center">
            Failed to load repositories
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search repositories"
        />

        {filteredRepos.length === 0 ?
          <div className="text-muted-foreground py-8 text-center">
            No repositories found
          </div>
        : filteredRepos.map((repo) => {
            const [owner, repoName] = repo.fullName.split("/")
            return (
              <Link
                key={repo.fullName}
                to="/repos/$owner/$repo"
                params={{ owner: owner!, repo: repoName! }}
                className="flex items-center justify-between"
                role="listitem"
              >
                <div className="truncate font-mono text-sm">
                  <span className="text-muted-foreground">{owner}/</span>
                  <span className="text-foreground">{repoName}</span>
                </div>
                <span className="w-20 text-right">
                  {repo.lastSyncAt && repo.lastSyncAt > 0 ?
                    formatRelativeTime(repo.lastSyncAt)
                  : "Queued"}
                </span>
              </Link>
            )
          })
        }
      </div>
    )
  },
})
