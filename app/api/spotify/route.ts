import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const titles = url.searchParams.get("titles")?.split(",") || [];
  const access_token = url.searchParams.get("access_token");

  if (titles.length === 0) {
    return NextResponse.json(
      { error: "At least one title is required" },
      { status: 400 }
    );
  }

  try {
    // Create an array of promises to fetch each title
    const trackPromises = titles.map((title) =>
      axios.get("https://api.spotify.com/v1/search", {
        params: {
          q: title,
          type: "track",
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    );

    // Execute all promises and wait for results
    const responses = await Promise.all(trackPromises);

    // Extract track data from each response
    const tracks = responses.map((response) => response.data.tracks.items[0]);

    return NextResponse.json(tracks);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    const redirectUri =
      process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000";

    if (!code) {
      return NextResponse.json(
        { error: "Something went wrong!" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("grant_type", "authorization_code");

    const encryptedClient = process.env.ENCRYPTED_SPOTIFY_CLIENT!;

    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encryptedClient}`,
        },
      }
    );

    const { access_token } = data;
    if (!access_token) {
      return NextResponse.json(
        { error: "Failed to obtain access token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ access_token });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: error.response?.status || 500 }
    );
  }
}
