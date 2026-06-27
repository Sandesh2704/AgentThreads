import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";
import type { Agent } from "@/types";

interface AgentStore {
  user: User | null;
  agent: Agent | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set) => ({
      user: null,
      agent: null,
      loading: true,

      setUser: (user) => set({ user }),
      setAgent: (agent) => set({ agent }),
      setLoading: (loading) => set({ loading }),

      reset: () =>
        set({
          user: null,
          agent: null,
          loading: false,
        }),
    }),
    {
      name: "agent-store",
      partialize: (state) => ({
        user: state.user,
        agent: state.agent,
      }),
    }
  )
);