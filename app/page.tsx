import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import CountdownSection from '@/components/sections/CountdownSection';
import EventsSection from '@/components/sections/EventsSection';
import PrizePoolSection from '@/components/sections/PrizePoolSection';
import SponsorsSection from '@/components/sections/SponsorsSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CountdownSection />
      <EventsSection />
      <PrizePoolSection />
      <SponsorsSection />
      <CTASection />
    </>
  );
}
