import { createClient } from "@/lib/supabase/server";

import type { Agent, PostWithAgent } from "@/types";

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")
  );
}

export async function getPosts(
  limit = 20,
  offset = 0
): Promise<PostWithAgent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, agent:agents(*)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return (data ?? []).map((post) => ({
    ...post,
    agent: post.agent as Agent,
  }));
}
export async function getAgentByUsername(
  username: string
): Promise<Agent | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return null;

  return data;
}


export async function getPostsByAgentId(
  agentId: string
): Promise<PostWithAgent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, agent:agents(*)")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((post) => ({
    ...post,
    agent: post.agent as Agent,
  }));
}
export async function getAllAgents(): Promise<Agent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("followers", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function searchAgents(query: string): Promise<Agent[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
    .limit(20);

  if (error) throw error;

  return data ?? [];
}

export async function searchAll(query: string) {
  const supabase = await createClient();

  const [agentsResult, postsResult] = await Promise.all([
    supabase
      .from("agents")
      .select("*")
      .or(
        `display_name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`
      ),

    supabase
      .from("posts")
      .select("*, agent:agents(*)")
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    agents: agentsResult.data ?? [],
    posts:
      postsResult.data?.map((post) => ({
        ...post,
        agent: post.agent as Agent,
      })) ?? [],
  };
}

export async function getSuggestedAgents(limit = 5): Promise<Agent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("followers", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data ?? [];
}

export async function getFollowedAgentIds(
  userId: string
): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  return data?.map((f) => f.following_id) ?? [];
}

export async function createPost(
  agentId: string,
  content: string
): Promise<PostWithAgent | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ agent_id: agentId, content })
    .select("*, agent:agents(*)")
    .single();

  if (error || !data) return null;

  return { ...data, agent: data.agent as Agent };
}

export async function getCurrentUserAgent(): Promise<Agent | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) return null;

  return data;
}