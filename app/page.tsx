"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [result, setResult] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string | null>(searchParams.get("code"));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) {
      router.push(
        process.env.AUTHORIZE_SPOTIFY_URL ||
          "https://accounts.spotify.com/authorize?response_type=code&client_id=e9ba95de74de471891bd4e98c73b66ef&scope=playlist-modify-private playlist-modify-public&redirect_uri=http://localhost:3000"
      );
    }

    setLoading(true);

    try {
      let youtubeLink = e.currentTarget.youtube.value;
      let spotifyLink = e.currentTarget.spotify.value;

      if (!youtubeLink || !spotifyLink)
        return toast.error("All fields are required");

      youtubeLink = youtubeLink.split("&")[0].split("=")[1];
      spotifyLink = spotifyLink.split("/")[4].split("?")[0];

      const youtubeResponse = await axios.get(
        `/api/youtube?playlistId=${youtubeLink}`
      );

      if (youtubeResponse.data.error)
        return toast.error(
          youtubeResponse.data.error || "Something went wrong!"
        );

      const youtubePlaylist = youtubeResponse.data.items;

      const titles = youtubePlaylist.map(
        (item: { snippet: { title: string } }) => item.snippet.title
      );

      const getAccessToken = await axios.post("/api/spotify", {
        code: code,
      });

      if (getAccessToken.data.error)
        return toast.error(
          getAccessToken.data.error || "Something went wrong!"
        );
      const { access_token } = getAccessToken.data;

      const getMusicResponse = await axios.get(
        `/api/spotify?titles=${titles.join(",")}&access_token=${access_token}`
      );

      if (getMusicResponse.data.error)
        return toast.error(
          getMusicResponse.data.error || "Something went wrong!"
        );

      const uris = getMusicResponse.data.map((item: any) => item.uri);

      const response = await axios.post("/api/addTracks", {
        uris: uris,
        access_token: access_token,
        spotifyPlaylistId: spotifyLink,
      });

      if (response.data.error)
        return toast.error(response.data.error || "Something went wrong!");

      toast.success("Playlist inserted successfully!");
      setResult(titles);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const authorizeSpotify = () => {
    router.push(
      process.env.AUTHORIZE_SPOTIFY_URL ||
        "https://accounts.spotify.com/authorize?response_type=code&client_id=e9ba95de74de471891bd4e98c73b66ef&scope=playlist-modify-private playlist-modify-public&redirect_uri=http://localhost:3000"
    );
  };

  useEffect(() => {
    if (code) {
      setCode(code);
    }
  }, [code, authorizeSpotify]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="youtube"
          id="youtube"
          placeholder="Playlist youtube link"
          disabled={loading}
        />
        <input
          type="text"
          name="spotify"
          id="spotify"
          placeholder="Playlist spotify link"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Add Tracks
        </button>
      </form>
      {!code && <button onClick={authorizeSpotify}>Authorize Spotify</button>}
      {result && (
        <ul>
          {result.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
