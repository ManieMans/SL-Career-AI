import Link from "next/link"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AI-powered career guidance and labour-market intelligence built for the students, graduates, and job
              seekers of Sierra Leone.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sign-up" className="hover:text-foreground">
                  Take the assessment
                </Link>
              </li>
              <li>
                <a href="#careers" className="hover:text-foreground">
                  Explore careers
                </a>
              </li>
              <li>
                <a href="#insights" className="hover:text-foreground">
                  Labour market
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground">
                  How it works
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CareerAI Sierra Leone. Empowering the next generation.</p>
        </div>
      </div>
    </footer>
  )
}
