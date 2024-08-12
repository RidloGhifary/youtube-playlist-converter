import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI || "https://localhost:3000";

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("code", code.toString());

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
        // redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    const { access_token } = response.data;
    // Save the access token securely, e.g., in session or database
    return NextResponse.json({ access_token });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }
}
