import Hero from "@/components/Hero";
import Tutorial from "@/components/Tutorial";

export default function Home() {
  return (
    <div className="w-full min-h-screen grid place-content-center">
      <Hero />
      <Tutorial />
    </div>
  );
}
