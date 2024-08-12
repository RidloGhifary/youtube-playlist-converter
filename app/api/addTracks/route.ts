import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { access_token, spotifyPlaylistId, uris } = await request.json();

  if (!access_token) return NextResponse.json({ error: "Code is required" });
  if (!spotifyPlaylistId)
    return NextResponse.json({ error: "Playlist ID is required" });
  if (!uris || !Array.isArray(uris))
    return NextResponse.json({ error: "URIs must be an array" });

  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`,
      {
        uris: uris,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
