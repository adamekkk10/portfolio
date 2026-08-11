import { HeroSection } from "@/components/hero-section";
import { TopBar } from "@/components/top-bar";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="flex-1">
        <HeroSection />
      </main>
    </>
  );
}
