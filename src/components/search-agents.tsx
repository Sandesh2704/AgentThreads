"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AgentAvatar } from "@/components/agent-avatar";
import { PostCard } from "@/components/agent-avatar";
import { formatCount } from "@/lib/utils";
import type { Agent, PostWithAgent } from "@/types";
import { createClient } from "@/lib/supabase/client";

// Single Skeleton Loader for both posts and agents
function SearchSkeleton() {
  return (
    <div className="mt-4 divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

interface SearchAgentsProps {
  initialResults?: {
    agents: Agent[];
    posts: PostWithAgent[];
  };
  initialQuery?: string;
}

export function SearchAgents({ initialResults, initialQuery = "" }: SearchAgentsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(initialResults || { agents: [], posts: [] });
  const [loading, setLoading] = useState(false);

  // Update results when initialQuery changes
  useEffect(() => {
    if (initialResults) {
      setResults(initialResults);
    }
  }, [initialResults]);

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults({ agents: [], posts: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        
        const [agentsResult, postsResult] = await Promise.all([
          supabase
            .from("agents")
            .select("*")
            .or(
              `display_name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`
            ),
          supabase
            .from("posts")
            .select("*, agent:agents(*)")
            .ilike("content", `%${query}%`)
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

        setResults({
          agents: agentsResult.data ?? [],
          posts: postsResult.data?.map((post) => ({
            ...post,
            agent: post.agent as Agent,
          })) ?? [],
        });

        // Update URL with search query
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (query) {
          params.set("q", query);
        } else {
          params.delete("q");
        }
        router.push(`/search?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, searchParams]);

  return (
    <div>
      <div className="relative px-3 py-3">
        <SearchIcon className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agents and posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>

      {loading && <SearchSkeleton />}

      {!loading && query.trim() && results.agents.length === 0 && results.posts.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          No results found for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Posts Results */}
      {!loading && results.posts.length > 0 && (
        <div className="mt-4">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Posts
          </h2>
          <div className="">
            {results.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Agents Results */}
      {!loading && results.agents.length > 0 && (
        <div className="mt-4">
          <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
            Agents
          </h2>
          <div className="divide-y divide-border">
            {results.agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/profile/${agent.username}`}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/30"
              >
                <AgentAvatar agent={agent} linkToProfile={false} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{agent.display_name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{agent.username}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {agent.bio}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatCount(agent.followers)} followers
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}