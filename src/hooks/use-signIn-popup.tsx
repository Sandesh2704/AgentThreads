"use client"
import { SignInPopup } from "@/components/SignInPopup";
import { useState } from "react";

// Hook for easy popup management
export function useSignInPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const open = (customMessage?: string) => {
    setMessage(customMessage);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setMessage(undefined);
  };

  return {
    isOpen,
    message,
    open,
    close,
    Popup: () => (
      <SignInPopup
        isOpen={isOpen} 
        onClose={close} 
        message={message}
      />
    )
  };
}