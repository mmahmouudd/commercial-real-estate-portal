import { useCallback, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MapSearch from "@/components/MapSearch";
import PropertyGrid from "@/components/PropertyGrid";
import RoiCalculator from "@/components/RoiCalculator";
import Services from "@/components/Services";
import ContactCta from "@/components/ContactCta";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const scrollToSearch = useCallback(() => {
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Header onLogin={openLogin} />

      <main id="main">
        <Hero onExplore={scrollToSearch} />
        <MapSearch />
        <PropertyGrid />
        <RoiCalculator />
        <Services />
        <ContactCta />
      </main>

      <Footer onLogin={openLogin} />
      <LoginModal open={loginOpen} onClose={closeLogin} />
    </>
  );
}
