import type { LlmsSummary } from "@/types";

export function parseLlmsTxt(content: string): LlmsSummary {
  const lines = content.split("\n").map((l) => l.trim());

  const title = lines.find((l) => l.startsWith("# "))?.slice(2) ?? "Unknown";

  const purposeIndex = lines.findIndex((l) =>
    l.toLowerCase().startsWith("purpose:")
  );
  const purpose =
    purposeIndex >= 0
      ? lines[purposeIndex].replace(/^purpose:\s*/i, "")
      : "Not specified";

  const pages: string[] = [];
  const features: string[] = [];

  let section: "none" | "pages" | "features" = "none";

  for (const line of lines) {
    if (line.toLowerCase() === "pages:") {
      section = "pages";
      continue;
    }
    if (line.toLowerCase() === "features:") {
      section = "features";
      continue;
    }
    if (line.startsWith("#") || line.toLowerCase().startsWith("purpose:")) {
      section = "none";
      continue;
    }

    const bulletMatch = line.match(/^\*\s+(.+)/);
    if (bulletMatch && section === "pages") {
      pages.push(bulletMatch[1]);
    }
    if (bulletMatch && section === "features") {
      features.push(bulletMatch[1]);
    }
  }

  return { title, purpose, pages, features };
}
