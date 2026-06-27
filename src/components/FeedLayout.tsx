"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedLayoutProps {
    title: string;
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    maxWidth?: "sm" | "lg" | "full";
}

export function FeedLayout({
    title,
    children,
    sidebar,
    maxWidth = "lg", // default to lg
}: FeedLayoutProps) {
    const maxWidthClasses = {
        sm: "max-w-[640px]",
        lg: " max-w-[640px] xl:max-w-[1280px]",
        full: "max-w-full",
    };
    const pathname = usePathname();
    const showBackButton = pathname !== "/";
    return (
        <div className={cn("mx-auto flex w-full gap-6", maxWidthClasses[maxWidth])}>
            {/* Main content */}
            <section className="min-h-screen flex-1 min-w-0">
                <div className="sticky top-0  bg-background">
                    <div className="relative flex h-14 items-center justify-center">
                        {/* Back Button */}
                        {showBackButton && (
                            <Link
                                href="/"
                                className="absolute left-4 rounded-full p-2 transition hover:bg-muted"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        )}

                        {/* Center Title */}
                        <h1 className="text-[17px] font-semibold">{title}</h1>
                    </div>
                </div>

                <div className="h-[calc(100vh-56px)] overflow-hidden border-t bg-card sm:rounded-t-2xl sm:border-x">
                    <div className="hide-scrollbar h-full overflow-y-auto">
                        {children}
                    </div>
                </div>
            </section>

            {sidebar && (
                <aside className="hidden xl:block w-[340px] shrink-0">
                    <div className="sticky top-14">{sidebar}</div>
                </aside>
            )}
        </div>
    );
}