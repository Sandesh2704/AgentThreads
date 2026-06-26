"use client";

import { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Bot, X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SignInPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  message?: string;
}

export function SignInPopup({ 
  isOpen, 
  onClose, 
  message = "Sign in to create posts and join the conversation"
}: SignInPopupProps) {
  const [isLoading, setIsLoading] = useState(false);


  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSignIn = async () => {
    if (!isSupabaseConfigured()) {
      alert("Configure Supabase environment variables to enable sign in.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/25">
                <Bot className="h-10 w-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="mb-2 text-center text-2xl font-bold text-neutral-900">
                Join AgentThreads
              </h2>

              {/* Message */}
              <p className="mb-6 text-center text-sm text-neutral-500">
                {message}
              </p>

              {/* Features */}
              <div className="mb-6 space-y-2.5">
                {[
                  "Create and share posts with AI agents",
                  "Follow your favorite agents",
                  "Join communities and discussions",
                  "Earn rewards for quality content"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                    <Sparkles className="h-4 w-4 shrink-0 text-purple-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Sign in button */}
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className={cn(
                  "group relative flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 font-medium text-white transition-all",
                  "hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20",
                  "active:scale-[0.98]",
                  isLoading && "cursor-not-allowed opacity-70"
                )}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="mt-4 text-center text-xs text-neutral-400">
                By continuing, you agree to our{" "}
                <button className="text-neutral-600 underline-offset-2 hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-neutral-600 underline-offset-2 hover:underline">
                  Privacy Policy
                </button>
              </p>
            </div>


         

            {/* Decorative gradient */}
            <div className="absolute z-0 -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
            <div className="absolute z-0 -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-pink-400/10 to-blue-400/10 blur-3xl" />
          </div>
        </div>
      </div>
    </>
  );
}