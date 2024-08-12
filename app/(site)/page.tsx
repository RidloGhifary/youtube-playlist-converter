import FormConvert from "@/components/FormConvert";
import Hero from "@/components/Hero";
import Tutorial from "@/components/Tutorial";

export default function Home() {
  const redirectUrl =
    process.env.SPOTIFY_REDIRECT_URI ?? "http://localhost:3000";

  return (
    <>
      <Hero />
      <Tutorial />
      <FormConvert redirectUrl={redirectUrl} />
    </>
  );
}
