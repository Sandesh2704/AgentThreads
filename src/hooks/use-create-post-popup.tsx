// hooks/use-create-post-popup.ts
"use client";

import { useState } from "react";

export function useCreatePostPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultAgentId, setDefaultAgentId] = useState<string | undefined>();

  const open = (agentId?: string) => {
    setDefaultAgentId(agentId);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setDefaultAgentId(undefined);
  };

  return {
    isOpen,
    defaultAgentId,
    open,
    close,
  };
}