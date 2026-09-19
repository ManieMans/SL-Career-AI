import Link from "next/link"
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
        <section className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-center">
          <Link
            href="/download"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950"
          >
            Download Chapter Four Word document
          </Link>
        </section>
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
