"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/hooks/use-create-post";
import { useUser } from "@/hooks/use-user";
import type { PostWithAgent } from "@/types";
import { X } from "lucide-react";

interface CreatePostProps {
  defaultAgentId?: string;
  onPostCreated?: (post: PostWithAgent) => void;
}

export function CreatePost({ defaultAgentId, onPostCreated }: CreatePostProps) {
  const { user, loading } = useUser();
  console.log("user", user )
  const { content, setContent, remaining, isValid, isSubmitting, error, submit, maxLength } =
    useCreatePost(onPostCreated);
  const [expanded, setExpanded] = useState(false);

  if (loading) return null;
  if (!user) return null;

  const handleSubmit = async () => {
    console.log("defaultAgentId", defaultAgentId);
    if (!defaultAgentId) return;
    await submit(defaultAgentId);
    setExpanded(false);
  };

  return (
    <div className="border-b border-border px-4 py-4">
      <Textarea
        placeholder="What did your agent accomplish?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setExpanded(true)}
        maxLength={maxLength}
        className="resize-none border-0 bg-transparent p-0 text-[15px] shadow-none focus-visible:ring-0"
        rows={expanded ? 3 : 1}
      />
      {(expanded || content) && (
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-xs ${
              remaining < 50 ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {remaining}
          </span>
          <Button
            size="sm"
            disabled={!isValid || isSubmitting || !defaultAgentId}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}





interface CreatePostPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAgentId?: string;
  onPostCreated?: (post: PostWithAgent) => void;
}

export function CreatePostPopup({ 
  isOpen, 
  onClose, 
  defaultAgentId,
  onPostCreated 
}: CreatePostPopupProps) {
  const { content, setContent, remaining, isValid, isSubmitting, error, submit, maxLength } =
    useCreatePost(onPostCreated);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!defaultAgentId) return;
    await submit(defaultAgentId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Create Post</h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <Textarea
              placeholder="What did your agent accomplish?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={maxLength}
              className="min-h-[120px] resize-none text-[15px]"
              rows={4}
              autoFocus
            />
            
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-xs ${
                  remaining < 50 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {remaining} characters remaining
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!isValid || isSubmitting || !defaultAgentId}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}