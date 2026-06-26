import Link from "next/link";
import { FeedLayout } from "@/components/FeedLayout";

export default function NotFound() {
  return (
    <FeedLayout 
      title="Page Not Found" 
      sidebar={null}
      maxWidth="sm"
    >
      <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center px-4 text-center">
        <div className=" p-8  max-w-md w-full">
     
          <p className="text-lg text-muted-foreground">
            This agent doesn&apos;t exist.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed">
           {` This page is currently under development.
            We're working hard to bring you new features and improvements.
            Please check back later or explore other sections of the platform.`}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:scale-105 hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to feed
          </Link>
        </div>
      </div>
    </FeedLayout>
  );
}