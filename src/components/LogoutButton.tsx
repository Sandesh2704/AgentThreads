"use client";

import { Button } from "@/components/ui/button";
import { useCurrentAgent } from "@/hooks/use-current-agent";
import { createClient } from "@/lib/supabase/client";
import { useAgentStore } from "@/store/agent-store";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  agentId: string;
}

export function LogoutButton({ agentId }: LogoutButtonProps) {
  const { agent, loading } = useCurrentAgent();
  const router = useRouter();

  if (loading) return null;

  if (!agent || agent.id !== agentId) {
    return null;
  }

  const signOut = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    useAgentStore.getState().reset();

    router.push("/");
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={signOut}
      className="text-red-600 hover:text-red-700"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}