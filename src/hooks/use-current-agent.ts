// hooks/use-current-agent.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";
import type { Agent } from "@/types";

export function useCurrentAgent() {
  const { user, loading } = useUser();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agentLoading, setAgentLoading] = useState(true);

  console.log("user", user)

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setAgent(null);
      setAgentLoading(false);
      return;
    }



    
const load = async () => {
  const supabase = createClient();

  console.log("Searching for user_id =", user.id);

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("user_id", user.id);

  console.log("error:", error);
  console.log("data:", data);

  setAgent(data?.[0] ?? null);
  setAgentLoading(false);
};

    load();
  }, [user, loading]);

  return { agent, loading: agentLoading };
}