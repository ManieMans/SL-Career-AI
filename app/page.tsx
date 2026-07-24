import { SiteHeader } from "@/components/marketing/site-header"
import { SiteFooter } from "@/components/marketing/site-footer"
import {
  Hero,
  Stats,
  HowItWorks,
  Features,
  CareersPreview,
  Testimonials,
  Faq,
  CtaBanner,
} from "@/components/marketing/landing-sections"

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <CareersPreview />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  )
}
