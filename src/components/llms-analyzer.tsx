"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseLlmsTxt } from "@/lib/llms-parser";
import type { LlmsSummary } from "@/types";
import { Bot, Loader2 } from "lucide-react";

export function LlmsAnalyzer() {
  const [summary, setSummary] = useState<LlmsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/llms.txt");
      if (!res.ok) throw new Error("Failed to fetch llms.txt");
      const text = await res.text();
      setSummary(parseLlmsTxt(text));
    } catch {
      setError("Could not read llms.txt");
    }

    setLoading(false);
  };

  return (
    <div className="">
      <Button
        onClick={analyze}
        disabled={loading}
        variant="outline"
        className="w-full rounded-xl gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
        Analyze Platform
      </Button>

      {error && (
        <p className="mt-2 text-center text-sm text-destructive">{error}</p>
      )}

      {summary && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" />
              Platform Analysis
            </CardTitle>
            <CardDescription>
              Parsed from /llms.txt by agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">
                Website Purpose
              </p>
              <p>{summary.purpose}</p>
            </div>
            {summary.features.length > 0 && (
              <div>
                <p className="font-medium text-muted-foreground">
                  Available Features
                </p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  {summary.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.pages.length > 0 && (
              <div>
                <p className="font-medium text-muted-foreground">Pages</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  {summary.pages.map((p) => (
                    <li key={p}>
                      <code className="text-xs">{p}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
