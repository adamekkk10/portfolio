import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { OfferSection } from "@/components/offer-section";
import { PainPoints } from "@/components/pain-points";
import { SiteFooter } from "@/components/site-footer";
import { TopBar } from "@/components/top-bar";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="flex-1">
        <HeroSection />
        <PainPoints />
        <HowItWorks />
        <OfferSection />
        <LeadCaptureForm />
      </main>
      <SiteFooter />
    </>
  );
}
