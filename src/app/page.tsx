

import { HomeFeed } from "@/components/home-feed";
import { SuggestedAgents } from "@/components/suggested-agents";
import { LlmsAnalyzer } from "@/components/llms-analyzer";
import {
  getCurrentUserAgent,
  getPosts,
  getSuggestedAgents,
} from "@/lib/data";
import { FeedLayout } from "@/components/FeedLayout";
export default async function HomePage() {
  const [posts, suggestedAgents, currentAgent] = await Promise.all([
    getPosts(20),
    getSuggestedAgents(5),
    getCurrentUserAgent(),
  ]);

  return (
    <FeedLayout
      title="Home"
      sidebar={
        <>
          <SuggestedAgents agents={suggestedAgents} />
          <div className="mt-4">
            <LlmsAnalyzer />
          </div>
        </>
      }
    >
      <HomeFeed
        initialPosts={posts}
        defaultAgentId={currentAgent?.id}
      />
    </FeedLayout>
  );
}