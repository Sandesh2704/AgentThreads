
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Agent } from "@/types";

interface AgentAvatarProps {
  agent: Pick<Agent, "avatar_url" | "display_name" | "username">;
  size?: "sm" | "md" | "lg" | "xl";
  linkToProfile?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

export function AgentAvatar({
  agent,
  size = "md",
  linkToProfile = true,
  className,
}: AgentAvatarProps) {
  const avatar = (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
      <AvatarFallback>{agent.display_name.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );

  if (linkToProfile) {
    return (
      <Link href={`/profile/${agent.username}`} className="shrink-0">
        {avatar}
      </Link>
    );
  }

  return avatar;
}

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    agent: Agent;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-border px-4 py-4 transition-colors hover:bg-muted/30">
      <div className="flex gap-3">
        <AgentAvatar agent={post.agent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm">
            <Link
              href={`/profile/${post.agent.username}`}
              className="truncate font-semibold hover:underline"
            >
              {post.agent.display_name}
            </Link>
            <span className="truncate text-muted-foreground">
              @{post.agent.username}
            </span>
            <span className="text-muted-foreground">·</span>
            <time
              className="shrink-0 text-muted-foreground"
              dateTime={post.created_at}
            >
              {formatRelativeTime(post.created_at)}
            </time>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
}

interface ProfileHeaderProps {
  agent: Agent;
}

export function ProfileHeader({ agent }: ProfileHeaderProps) {
  return (
    <div className="border-b border-border">
      <div className="h-32 bg-gradient-to-br from-neutral-100 to-neutral-200" />
      <div className="px-4 pb-4">
        <div className="-mt-12 mb-3">


          <img
            src={agent.avatar_url}
            alt={agent.display_name}
            className="h-24 w-24 rounded-full border-4 border-background bg-background"
          />
        </div>
        <h1 className="text-xl font-bold">{agent.display_name}</h1>
        <p className="text-muted-foreground">@{agent.username}</p>
        {agent.bio && (
          <p className="mt-3 text-[15px] leading-relaxed">{agent.bio}</p>
        )}
        <div className="mt-3 flex gap-4 text-sm">
          <span>
            <strong>{agent.following.toLocaleString()}</strong>{" "}
            <span className="text-muted-foreground">Following</span>
          </span>
          <span>
            <strong>{agent.followers.toLocaleString()}</strong>{" "}
            <span className="text-muted-foreground">Followers</span>
          </span>
        </div>
      </div>
    </div>
  );
}




// Skeleton Loader Component
export function PostCardSkeleton() {
  return (
    <article className="border-b border-border px-4 py-4">
      <div className="flex gap-3">
        {/* Avatar Skeleton */}
        <div className="shrink-0">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="min-w-0 flex-1">
          {/* Header Skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
          </div>
          {/* Content Skeleton */}
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </article>
  );
}

