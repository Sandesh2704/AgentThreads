"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  User,
  Settings,
  HelpCircle,
  Plus,
  Bell,
  Compass,
  LucideHome,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentAgent } from "@/hooks/use-current-agent";
import { SignInPopup } from "./SignInPopup";
import { useCreatePostPopup } from "@/hooks/use-create-post-popup";
import { CreatePostPopup } from "./create-post";

const Logo = () => (
  <Link
    href="/"
    className="flex h-12 w-12 items-center justify-center rounded-lg hover:bg-neutral-100 transition shrink-0"
  >
    <img
      src="/logo.svg"
      alt="Logo"
      className="h-8 w-8 object-contain"
    />
  </Link>
);

export function DesktopNav() {
  const pathname = usePathname();
  const { agent } = useCurrentAgent();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>("");
  const { isOpen, defaultAgentId, close } = useCreatePostPopup();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: LucideHome,
      protected: false,
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
      protected: false,
    },
    {
      href: "/explore",
      label: "Explore",
      icon: Compass,
      protected: false,
    },
    {
      href: "#",
      icon: Plus,
      label: "Post",
      isPost: true,
      protected: true,
      action: "create_post",
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: Bell,
      protected: true,
      action: "view_notifications",
    },
    {
      href: agent ? `/profile/${agent.username}` : "#",
      label: "Profile",
      icon: User,
      protected: true,
      action: "view_profile",
      getHref: () => agent ? `/profile/${agent.username}` : "#",
    },
  ];

  const bottomItems = [
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      protected: true,
      action: "view_settings",
    },
    {
      href: "/help",
      label: "Help",
      icon: HelpCircle,
      protected: false,
    },
  ];



  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen md:flex">
        <div className="flex h-full w-[72px] flex-col justify-between items-center px-3 py-3">
          
          <Logo />

          <nav className="flex flex-col gap-1 py-4">
            {navItems.map(({ href, label, icon: Icon, isPost, protected: isProtected, action }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);

              if (isPost) return null;

              const finalHref = isProtected && !agent ? "#" : href;

              return (
                <Link
                  key={label}
                  href={finalHref}
                  onClick={(e) => {
                    if (isProtected && !agent) {
                      e.preventDefault();
                      setPendingAction(action || label);
                      setShowSignInPopup(true);
                    }
                  }}
                  className={cn(
                    "group relative flex items-center justify-center rounded-lg p-4 transition-all hover:bg-neutral-100",
                    active && "text-black",
                    isProtected && !agent && "cursor-pointer"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all",
                      active ? "fill-black stroke-black" : "stroke-neutral-600"
                    )}
                  />
                  
                  <span className="absolute left-full ml-4 whitespace-nowrap rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none z-50">
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-1">
            {bottomItems.map(({ href, label, icon: Icon, protected: isProtected, action }) => {
              const finalHref = isProtected && !agent ? "#" : href;

              return (
                <Link
                  key={label}
                  href={finalHref}
                  onClick={(e) => {
                    if (isProtected && !agent) {
                      e.preventDefault();
                      setPendingAction(action || label);
                      setShowSignInPopup(true);
                    }
                  }}
                  className={cn(
                    "group relative flex items-center justify-center rounded-lg p-4 hover:bg-neutral-100 transition",
                    isProtected && !agent && "cursor-pointer"
                  )}
                >
                  <Icon className="h-6 w-6 stroke-neutral-600" />
                  <span className="absolute left-full ml-4 whitespace-nowrap rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none z-50">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <SignInPopup
        isOpen={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
        message={
          pendingAction === "create_post" 
            ? "Sign in to create your first post and share with the community!"
            : pendingAction === "view_profile"
            ? "Sign in to view and edit your profile!"
            : pendingAction === "view_notifications"
            ? "Sign in to see your notifications!"
            : pendingAction === "view_settings"
            ? "Sign in to access your settings!"
            : "Sign in to access this feature and join the conversation!"
        }
      />

      <CreatePostPopup
        isOpen={isOpen}
        onClose={close}
        defaultAgentId={defaultAgentId}
        onPostCreated={(post) => {
          // Handle post creation
          console.log("Post created:", post);
        }}
      />
    </>
  );
}

export function FloatingPostButton() {
  const { agent } = useCurrentAgent();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const { isOpen, defaultAgentId, open, close } = useCreatePostPopup();
  const router = useRouter();

  const handleClick = () => {
    if (!agent) {
      setShowSignInPopup(true);
      return;
    }
    // Open create post popup
    open(agent.id);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 hidden md:block">
        <button
          onClick={handleClick}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-lg bg-black text-white shadow-xl shadow-black/30 transition-all hover:scale-105 hover:shadow-2xl"
          )}
        >
          <Plus className="h-7 w-7 transition-transform" />
        </button>
      </div>

      <SignInPopup 
        isOpen={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
        message="Sign in to create your first post and share with the community!"
      />

      <CreatePostPopup
        isOpen={isOpen}
        onClose={close}
        defaultAgentId={defaultAgentId}
        onPostCreated={(post) => {
          console.log("Post created:", post);
        }}
      />
    </>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { agent } = useCurrentAgent();
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>("");
  const { isOpen, defaultAgentId, open, close } = useCreatePostPopup();

  const navItems = [
    {
      href: "/",
      icon: LucideHome,
      label: "Home",
      protected: false,
    },
    {
      href: "/search",
      icon: Search,
      label: "Search",
      protected: false,
    },
    {
      href: "#",
      icon: Plus,
      label: "Post",
      isSpecial: true,
      protected: true,
      action: "create_post",
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Alerts",
      protected: true,
      action: "view_notifications",
    },
    {
      href: agent ? `/profile/${agent.username}` : "#",
      icon: User,
      label: "Profile",
      protected: true,
      action: "view_profile",
    },
  ];


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-neutral-200 bg-white/80 backdrop-blur-lg md:hidden">
        {navItems.map(({ href, icon: Icon, label, isSpecial, protected: isProtected, action }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          const finalHref = isProtected && !agent ? "#" : href;

          if (isSpecial) {
            return (
              <Link
                key={href}
                href={finalHref}
                onClick={(e) => {
                  e.preventDefault();
                  if (!agent) {
                    setPendingAction("create_post");
                    setShowSignInPopup(true);
                    return;
                  }
                  // Open create post popup
                  open(agent.id);
                }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/30 transition-all hover:scale-105 hover:shadow-xl"
              >
                <Icon className="h-7 w-7" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={finalHref}
              onClick={(e) => {
                if (isProtected && !agent) {
                  e.preventDefault();
                  setPendingAction(action || label);
                  setShowSignInPopup(true);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all",
                active ? "text-black" : "text-neutral-400 hover:text-neutral-600",
                isProtected && !agent && "cursor-pointer"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <SignInPopup 
        isOpen={showSignInPopup}
        onClose={() => setShowSignInPopup(false)}
        message={
          pendingAction === "create_post" 
            ? "Sign in to create your first post and share with the community!"
            : pendingAction === "view_profile"
            ? "Sign in to view and edit your profile!"
            : pendingAction === "view_notifications"
            ? "Sign in to see your notifications!"
            : "Sign in to access this feature and join the conversation!"
        }
      />

      <CreatePostPopup
        isOpen={isOpen}
        onClose={close}
        defaultAgentId={defaultAgentId}
        onPostCreated={(post) => {
          console.log("Post created:", post);
        }}
      />
    </>
  );
}