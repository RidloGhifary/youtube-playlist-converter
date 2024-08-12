import Button from "@/components/Button";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Image from "next/image";

export default function Hero() {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center">
        <div className="w-full sm:max-w-[80%] md:w-full">
          <Header
            title=" Convert your youtube playlist into Spotify easily"
            subtitle="Here, you can convert your youtube playlist into Spotify playlist
          just by entering the link of your youtube playlist. We will grab
          all the songs from the youtube playlist and upload them into your
              Spotify account. The songs will be added to a new playlist, which
              will be named after the original youtube playlist name."
          />
        </div>
        <div className="relative hidden md:block">
          <Image
            alt="spotify-logo"
            src="/spotify-logo.webp"
            width={500}
            height={500}
            priority
            className="aspect-square md:w-[200px] lg:w-[300px] absolute left-5 bottom-[50%] translate-y-[60%]"
          />
          <Image
            alt="youtube-logo"
            src="/youtube-logo.webp"
            width={500}
            height={500}
            priority
            className="aspect-square md:w-[200px] lg:w-[300px] absolute left-[45%] bottom-[50%] translate-y-[40%]"
          />
        </div>
      </div>

      <Button className="absolute bottom-16 left-1/2 translate-x-[-50%]">
        How to?
      </Button>
    </Container>
  );
}
