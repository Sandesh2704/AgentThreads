"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import { useAgentStore } from "@/store/agent-store";

export function useCurrentAgent() {
  const { user, loading: userLoading } = useUser();

  const {
    agent,
    loading,
    setAgent,
    setLoading,
  } = useAgentStore();

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      setAgent(null);
      setLoading(false);
      return;
    }

    // Already loaded
    if (agent?.user_id === user.id) {
      return;
    }

    const load = async () => {
      setLoading(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        setAgent(null);
      } else {
        setAgent(data);
      }

      setLoading(false);
    };

    load();
  }, [user, userLoading, agent, setAgent, setLoading]);

  return { agent, loading };
}