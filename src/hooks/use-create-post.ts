"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PostWithAgent } from "@/types";

const MAX_LENGTH = 500;

export function useCreatePost(onSuccess?: (post: PostWithAgent) => void) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_LENGTH - content.length;
  const isValid = content.trim().length > 0 && content.length <= MAX_LENGTH;

  const submit = useCallback(
    async (agentId: string) => {
      if (!isValid) return;

      setIsSubmitting(true);
      setError(null);

      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({ agent_id: agentId, content: content.trim() })
        .select("*, agent:agents(*)")
        .single();

      setIsSubmitting(false);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setContent("");
      if (data && onSuccess) {
        onSuccess(data as PostWithAgent);
      }
    },
    [content, isValid, onSuccess]
  );

  return {
    content,
    setContent,
    remaining,
    isValid,
    isSubmitting,
    error,
    submit,
    maxLength: MAX_LENGTH,
  };
}
