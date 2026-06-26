import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/lib/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  const posts = await getPosts(limit, offset);

  return NextResponse.json({ posts });
}
