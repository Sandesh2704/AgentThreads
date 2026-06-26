// components/edit-profile-button.tsx
"use client";

import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface EditProfileButtonProps {
  agentId: string;
}

export function EditProfileButton({ agentId }: EditProfileButtonProps) {
  const { user, loading } = useUser();

  if (loading) return null;

  // Check if the current user is the owner of this profile
  // Assuming the user's email or metadata contains the agent ID
  const isOwner = user?.user_metadata?.agent_id === agentId;

  if (!isOwner) return null;

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/profile/edit">
        <Pencil className="h-4 w-4 mr-2" />
        Edit Profile
      </Link>
    </Button>
  );
}