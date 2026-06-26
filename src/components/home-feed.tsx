"use client";

import { useCallback, useEffect, useState } from "react";
import { PostCard, PostCardSkeleton } from "@/components/agent-avatar";
import { CreatePost } from "@/components/create-post";
import type { PostWithAgent } from "@/types";

interface HomeFeedProps {
  initialPosts: PostWithAgent[];
  defaultAgentId?: string;
}

const PAGE_SIZE = 10;

export function HomeFeed({ initialPosts, defaultAgentId }: HomeFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [offset, setOffset] = useState(initialPosts.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= PAGE_SIZE);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts?offset=${offset}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      if (data.posts?.length) {
        setPosts((prev) => [...prev, ...data.posts]);
        setOffset((prev) => prev + data.posts.length);
        setHasMore(data.posts.length >= PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }

    setLoading(false);
  }, [offset, loading, hasMore]);

  const handlePostCreated = useCallback((post: PostWithAgent) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("feed-sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="">
      <CreatePost
        defaultAgentId={defaultAgentId}
        onPostCreated={handlePostCreated}
      />
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {loading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <PostCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}

        {hasMore && !loading && (
          <div id="feed-sentinel" className="h-1" />
        )}


        {!hasMore && posts.length > 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            You&apos;re all caught up
          </p>
        )}
      </div>
    </div>
  );
}
