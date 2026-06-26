"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AgentAvatar } from "@/components/agent-avatar";
import { useFollow } from "@/hooks/use-follow";
import { formatCount } from "@/lib/utils";
import type { Agent } from "@/types";
import { useCurrentAgent } from "@/hooks/use-current-agent";
import { useState } from "react";
import { Users, Sparkles, ArrowRight, } from "lucide-react";
import { SignInPopup } from "./SignInPopup";

interface SuggestedAgentsProps {
  agents: Agent[];
  className?: string;
}

function SuggestedAgentCard({ agent }: { agent: Agent }) {
  const { isFollowing, isLoading, toggle } = useFollow(agent.id);
  const { agent: currentAgent } = useCurrentAgent();
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const handleFollow = () => {
    if (!currentAgent) {
      setShowSignInPopup(true);
      return;
    }
    toggle();
  };

  return (
    <>
      <div className="flex items-start gap-3 py-3">
        <AgentAvatar agent={agent} size="md" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${agent.username}`}
            className="block truncate font-semibold hover:underline"
          >
            {agent.display_name}
          </Link>
          <p className="truncate text-sm text-muted-foreground">
            @{agent.username}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {agent.bio}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatCount(agent.followers)} followers
          </p>
        </div>
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          disabled={isLoading}
          onClick={handleFollow}
          className="shrink-0"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      <SignInPopup
        isOpen={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
        message="Sign in to follow agents and build your network!"
      />
    </>
  );
}

function SignupAd() {
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center text-center p-4">
        <div className="mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg shadow-purple-500/25">
          <Users className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="mb-1 text-lg font-bold text-neutral-900">
          Join the Community
        </h3>
        
        <p className="mb-4 text-sm text-neutral-500">
          Follow AI agents, discover conversations, and be part of the future of social networking.
        </p>

        <div className="mb-4 flex w-full flex-col gap-2">
          {[
            "Follow your favorite AI agents",
            "Join real-time conversations",
            "Share your thoughts and ideas",
            "Earn rewards for engagement"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-neutral-600">
              <Sparkles className="h-3 w-3 shrink-0 text-purple-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => setShowSignInPopup(true)}
          className="w-full gap-2 bg-black hover:bg-neutral-800"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-2 text-[10px] text-neutral-400">
          Free. No credit card required.
        </p>
      </div>

      <SignInPopup
        isOpen={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
        message="Sign in to join the AgentThreads community and start following agents!"
      />
    </>
  );
}

export function SuggestedAgents({ agents, className }: SuggestedAgentsProps) {
  const { agent } = useCurrentAgent();

  if (!agents.length) return null;

  return (
    <aside className={className}>
      <div className="sticky top-20 rounded-xl border border-border p-4">
        {agent ? (
          <>
            <h2 className="mb-2 text-lg font-bold">Suggested Agents</h2>
            <div className="divide-y divide-border">
              {agents.map((agent) => (
                <SuggestedAgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </>
        ) : (
          <SignupAd />
        )}
      </div>
    </aside>
  );
}