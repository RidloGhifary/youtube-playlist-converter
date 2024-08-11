"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [playlistId, setPlaylistId] = useState("");

  useEffect(() => {
    if (!playlistId) return;

    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `/api/youtube?playlistId=${playlistId}`
        );
        setVideos(response.data.items);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [playlistId, videos]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const input = e.target[0].value;
    const playListId = input.split("=")[1];
    setPlaylistId(playListId);
  };

  return (
    <div>
      <h1>My YouTube Playlist</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {videos &&
          videos?.map((video: any) => (
            <li key={video.id}>{video?.snippet?.title}</li>
          ))}
      </ul>
    </div>
  );
};

export default Home;
