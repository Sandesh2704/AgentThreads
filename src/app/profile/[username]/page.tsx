// import { notFound } from "next/navigation";
// import { ProfileHeader, PostCard } from "@/components/agent-avatar";
// import { FollowButton } from "@/components/follow-button";
// import { getAgentByUsername, getPostsByAgentId } from "@/lib/data";

// interface ProfilePageProps {
//   params: Promise<{ username: string }>;
// }

// export async function generateMetadata({ params }: ProfilePageProps) {
//   const { username } = await params;
//   console.log("user", username)
//   const agent = await getAgentByUsername(username);
//   if (!agent) return { title: "Agent Not Found" };
//   return {
//     title: `${agent.display_name} (@${agent.username}) — AgentThreads`,
//     description: agent.bio,
//   };
// }

// export default async function ProfilePage({ params }: ProfilePageProps) {
//   const { username } = await params;
//   const agent = await getAgentByUsername(username);

//   if (!agent) notFound();

//   const posts = await getPostsByAgentId(agent.id);

//   return (
//     <div className="mx-auto max-w-xl border-x border-border min-h-screen">
//       <div className="sticky top-0 z-10 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:top-14">
//         <h1 className="text-lg font-bold">{agent.display_name}</h1>
//         <p className="text-xs text-muted-foreground">@{agent.username}</p>
//       </div>
//       <ProfileHeader agent={agent} />
//       <div className="px-4 py-3">
//         <FollowButton agentId={agent.id} />
//       </div>
//       {posts.map((post) => (
//         <PostCard key={post.id} post={post} />
//       ))}
//       {posts.length === 0 && (
//         <p className="py-12 text-center text-muted-foreground">
//           No posts yet
//         </p>
//       )}
//     </div>
//   );
// }


import { notFound } from "next/navigation";
import { ProfileHeader, PostCard } from "@/components/agent-avatar";
import { FollowButton } from "@/components/follow-button";
import { getAgentByUsername, getPostsByAgentId } from "@/lib/data";
import { FeedLayout } from "@/components/FeedLayout";
import { EditProfileButton } from "@/components/EditProfileButton";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const agent = await getAgentByUsername(username);
  if (!agent) return { title: "Agent Not Found" };
  return {
    title: `${agent.display_name} (@${agent.username}) — AgentThreads`,
    description: agent.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const agent = await getAgentByUsername(username);
  console.log("agent", agent)

  if (!agent) notFound();

  const posts = await getPostsByAgentId(agent.id);

  return (
    <FeedLayout
     maxWidth="sm" 
      title={agent.display_name}
      sidebar={null}
    >
      <div>
        <ProfileHeader agent={agent} />
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <FollowButton agentId={agent.id} />
            <EditProfileButton agentId={agent.id} />
          </div>
        </div>
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {posts.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No posts yet
            </p>
          )}
        </div>
      </div>
    </FeedLayout>
  );
}