import { SearchAgents } from "@/components/search-agents";
import { getAllAgents, searchAll } from "@/lib/data";
import { FeedLayout } from "@/components/FeedLayout";
import {
  getSuggestedAgents,
} from "@/lib/data";
import { SuggestedAgents } from "@/components/suggested-agents";
;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [suggestedAgents, ] = await Promise.all([
    getSuggestedAgents(5),
  ]);

   const [ searchResults] = await Promise.all([
    searchAll((await searchParams).q ?? ""),
  ]);


  return (
    <FeedLayout 
      title="Search"
      sidebar={
        <>
          <SuggestedAgents agents={suggestedAgents} />
        </>
      }
    >
      <div className="">
        <SearchAgents 
          initialResults={searchResults}
          initialQuery={(await searchParams).q ?? ""}
        />
      </div>
    </FeedLayout>
  );
}