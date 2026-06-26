"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useFollow(agentId: string, initialFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLoading(false);
      return false;
    }

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", agentId);
      setIsFollowing(false);
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: agentId });
      setIsFollowing(true);
    }

    setIsLoading(false);
    return true;
  }, [agentId, isFollowing]);

  return { isFollowing, isLoading, toggle };
}
