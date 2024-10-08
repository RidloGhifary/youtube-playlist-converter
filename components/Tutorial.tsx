"use client";

import Button from "./Button";
import Container from "./Container";
import Header from "./Header";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";

export default function Tutorial() {
  const router = useRouter();

  const onClick = () => {
    router.push("#convert");
  };

  return (
    <div
      className="w-full min-h-screen grid place-content-center"
      id="tutorial">
      <Container>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-x-10">
          <ReactPlayer
            url="/video-tutorial.mp4"
            controls
            light={true}
            width={"100%"}
            height={"300px"}
          />
          <div className="space-y-4">
            <Header
              title="Watch this tutorial to get step by step"
              subtitle="Learn how to use this amazing application, it's easy and fun! Following the steps in this video, you'll be able to convert your favorite songs from YouTube to Spotify. You can also share it with your friends and listen to them together. This application is really simple and yet powerful, so don't hesitate to give it a try. You'll love it!"
            />
            <Button onClick={onClick}>Start converting!</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
