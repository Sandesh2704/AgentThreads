"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentAgent } from "@/hooks/use-current-agent";

interface EditProfileButtonProps {
  agentId: string;
}

export function EditProfileButton({
  agentId,
}: EditProfileButtonProps) {
  const { agent, loading } = useCurrentAgent();

  if (loading) return null;

  if (!agent || agent.id !== agentId) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/profile/edit">
        <Pencil className="mr-2 h-4 w-4" />
        Edit Profile
      </Link>
    </Button>
  );
}



