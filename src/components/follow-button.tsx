"use client";

import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";
import { useSignInPopup } from "@/hooks/use-signIn-popup";
import { useUser } from "@/hooks/use-user";

interface FollowButtonProps {
  agentId: string;
}

export function FollowButton({ agentId }: FollowButtonProps) {
  const { user, loading } = useUser();
  const { isFollowing, isLoading, toggle } = useFollow(agentId);
  const { open, Popup } = useSignInPopup();

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => open("Sign in to follow this agent")}
        >
          Follow
        </Button>
        <Popup />
      </>
    );
  }

  return (
    <>
      <Button
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        disabled={isLoading}
        onClick={() => toggle()}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <Popup />
    </>
  );
}