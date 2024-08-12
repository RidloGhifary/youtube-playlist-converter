"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Container from "./Container";
import Button from "./Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Header from "./Header";

const spotifyPlaylistRegex =
  /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?$/;
const youtubePlaylistRegex =
  /^https:\/\/youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+(&si=[a-zA-Z0-9_-]+)?$/;

const schema = yup
  .object({
    youtube: yup
      .string()
      .required()
      .matches(youtubePlaylistRegex, "Invalid YouTube playlist URL"),
    spotify: yup
      .string()
      .required()
      .matches(spotifyPlaylistRegex, "Invalid Spotify playlist URL"),
  })
  .required();

export default function FormConvert() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [result, setResult] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string | null>(searchParams.get("code"));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ youtube: string; spotify: string }>({
    resolver: yupResolver(schema),
    defaultValues: {
      youtube: "",
      spotify: "",
    },
  });

  const onSubmit: SubmitHandler<{ youtube: string; spotify: string }> = async (
    data
  ) => {
    if (!code) {
      router.push(
        process.env.AUTHORIZE_SPOTIFY_URL ||
          "https://accounts.spotify.com/authorize?response_type=code&client_id=e9ba95de74de471891bd4e98c73b66ef&scope=playlist-modify-private playlist-modify-public&redirect_uri=http://localhost:3000"
      );
    }

    setLoading(true);

    try {
      let youtubeLink = data.youtube;
      let spotifyLink = data.spotify;

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
      reset();
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
    <Container>
      <div className="w-full py-[200px]">
        <div className="w-full text-center md:max-w-[70%] lg:max-w-[60%] mx-auto mb-24">
          <Header
            title="Convert your youtube playlist into Spotify"
            subtitle="Authorized your spotify account to use this app"
          />
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 w-full gap-6"
          id="convert">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 min-w-full">
            <div className="flex flex-col gap-2">
              <div className="w-full flex justify-between items-center">
                <label htmlFor="youtube" className="text-white text-sm">
                  Youtube playlist url
                </label>
                {errors.youtube && (
                  <span className="text-red-500 text-xs">
                    {errors.youtube?.message?.toString()}
                  </span>
                )}
              </div>
              <input
                {...register("youtube")}
                type="text"
                id="youtube"
                disabled={loading || !code}
                placeholder={
                  !code
                    ? "Authorized spotify first"
                    : "https://youtube.com/playlist/playlistId"
                }
                className="w-full rounded-md bg-transparent border border-white p-3 outline-none ring-0 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-full flex justify-between items-center">
                <label htmlFor="spotify" className="text-white text-sm">
                  Spotify playlist url
                </label>
                {errors.spotify && (
                  <span className="text-red-500 text-xs">
                    {errors.spotify?.message?.toString()}
                  </span>
                )}
              </div>
              <input
                {...register("spotify")}
                type="text"
                id="spotify"
                disabled={loading || !code}
                placeholder={
                  !code
                    ? "Authorize spotify first"
                    : "https://open.spotify.com/playlist/playlistId"
                }
                className="w-full rounded-md bg-transparent border border-white p-3 outline-none ring-0 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex gap-4 items-center">
              {!code ? (
                <Button
                  disabled={loading}
                  type="button"
                  className="border-none bg-[#3cd868] text-stone-950"
                  onClick={authorizeSpotify}>
                  {loading ? "Loading..." : "Authorize Spotify"}
                </Button>
              ) : (
                <Button disabled={loading} type="submit">
                  {loading ? "Loading..." : "Convert"}
                </Button>
              )}
            </div>
          </form>
          <div
            className={`p-4 flex flex-col gap-4 mt-3 ${
              !result && "bg-slate-500/20 rounded-md"
            }`}>
            {result ? (
              <ol className="list-disc space-y-3">
                {result.map((item) => (
                  <li
                    key={item}
                    className="p-3 border rounded-md w-full truncate">
                    Added {item}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-center">Your result will be here!</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
