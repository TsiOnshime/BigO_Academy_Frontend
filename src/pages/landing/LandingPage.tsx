import { useState } from "react";
import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "../../components/landing/HeroSection";
import CurriculumPreview from "../../components/landing/CurriculumPreview";
import FeatureGrid from "../../components/landing/FeatureGrid";
import ContestShowcase from "../../components/landing/ContestShowcase";
import FAQSection from "../../components/landing/FAQSection";
import CallToAction from "../../components/landing/CallToAction";
import LandingFooter from "../../components/landing/LandingFooter";
import ApplicationModal from "../../components/landing/ApplicationModal";

export default function LandingPage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // If you have an open application URL (e.g. Google Form or external link), set it here.
  // When null/empty, clicking Apply displays the "Applications Are Not Open Yet" waitlist modal.
  const applicationUrl = import.meta.env.VITE_APPLICATION_URL || null;

  const handleOpenApplyModal = () => {
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-red-500 selection:text-white transition-colors duration-200">
      {/* Sticky Navigation */}
      <LandingNavbar onOpenApplyModal={handleOpenApplyModal} />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection onOpenApplyModal={handleOpenApplyModal} />

        {/* 2. Interactive 4-Phase Curriculum & Problem Sets */}
        <CurriculumPreview onOpenApplyModal={handleOpenApplyModal} />

        {/* 4. Core Pillars Bento Grid */}
        <FeatureGrid />

        {/* 5. Rated Contests Arena & Schedule */}
        <ContestShowcase onOpenApplyModal={handleOpenApplyModal} />

        {/* 6. Frequently Asked Questions Accordion */}
        <FAQSection />

        {/* 7. Call To Action Banner */}
        <CallToAction onOpenApplyModal={handleOpenApplyModal} />
      </main>

      {/* Footer */}
      <LandingFooter onOpenApplyModal={handleOpenApplyModal} />

      {/* Application Status / Waitlist Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        applicationUrl={applicationUrl}
      />
    </div>
  );
}
