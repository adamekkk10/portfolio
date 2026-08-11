import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { PainPoints } from "@/components/pain-points";
import { TopBar } from "@/components/top-bar";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="flex-1">
        <HeroSection />
        <PainPoints />
        <HowItWorks />
      </main>
    </>
  );
}
