import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import RatesTeaser from "@/components/RatesTeaser";
import EligibilityBanner from "@/components/EligibilityBanner";
import FeatureSection from "@/components/FeatureSection";
import SecurityCallout from "@/components/SecurityCallout";
import AdviceSection from "@/components/AdviceSection";
import { brand } from "@/content/site";

export const metadata = {
  title: `${brand.name} — Banking Built on Trust`,
  description:
    "Guardian Trust Federal Credit Union is a member-owned, not-for-profit financial institution offering checking, savings, auto loans, mortgages, credit cards, and digital banking — built for you.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <RatesTeaser />
      <EligibilityBanner />
      <FeatureSection />
      <SecurityCallout />
      <AdviceSection />
    </>
  );
}
