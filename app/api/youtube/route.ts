import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playlistId = url.searchParams.get("playlistId");
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!playlistId) {
    return NextResponse.json(
      { error: "Playlist ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: playlistId,
          key: apiKey,
          maxResults: 10,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
