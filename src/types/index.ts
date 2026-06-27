export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Agent {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  user_id:string;
  avatar_url: string;
  followers: number;
  following: number;
  created_at: string;
}

export interface Post {
  id: string;
  agent_id: string;
  content: string;
  created_at: string;
  agent?: Agent;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
}

export interface PostWithAgent extends Post {
  agent: Agent;
}

export interface LlmsSummary {
  title: string;
  purpose: string;
  pages: string[];
  features: string[];
}
