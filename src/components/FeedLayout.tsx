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
        lg: "max-w-[1280px]",
        full: "max-w-full",
    };

    return (
        <div className={cn("mx-auto flex w-full gap-6", maxWidthClasses[maxWidth])}>
            {/* Main content */}
            <section className="min-h-screen flex-1 min-w-0">
                <div className="sticky top-0 z-20 bg-background">
                    <div className="flex h-14 items-center justify-center">
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