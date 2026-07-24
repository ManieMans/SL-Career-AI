import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Brain,
  Compass,
  LineChart,
  MessageSquare,
  Sparkles,
  Target,
  BookOpen,
  Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { KEY_STATS } from "@/lib/data/labour-market"
import { CAREERS } from "@/lib/data/careers"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <Badge variant="secondary" className="mb-5 gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built for Sierra Leone
          </Badge>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Discover the right career path with AI
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Take a personality assessment, explore careers with real local salary data, and get personalized
            AI recommendations matched to Sierra Leone&apos;s growing job market.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start your free assessment
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to use. No experience needed. Guidance for every stage.
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-xl">
            <Image
              src="/images/hero-students.png"
              alt="Confident young Sierra Leonean students and graduates"
              fill
              priority
              className="object-cover"
            />
          </div>
          <Card className="absolute -bottom-5 -left-4 hidden items-center gap-3 p-3 shadow-lg sm:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">92% match</p>
              <p className="text-xs text-muted-foreground">Software Developer</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function Stats() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
        {KEY_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-serif text-3xl font-semibold text-primary md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm font-medium">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const STEPS = [
  {
    icon: Brain,
    title: "Take the assessment",
    body: "Answer a short, science-based interest questionnaire to reveal your strengths and personality type.",
  },
  {
    icon: Sparkles,
    title: "Get AI recommendations",
    body: "Our AI matches your profile to careers that fit you and are in demand across Sierra Leone.",
  },
  {
    icon: Compass,
    title: "Explore & plan",
    body: "Dive into career details, salary ranges, required skills, and learning resources to get started.",
  },
  {
    icon: MessageSquare,
    title: "Chat with your advisor",
    body: "Ask the AI career advisor anything — from study paths to how to break into a field.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Your path to the right career, in four steps
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          CareerAI combines a proven interest assessment with AI and local labour-market data.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <Card key={step.title} className="relative p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="h-6 w-6" />
            </span>
            <span className="absolute right-5 top-5 font-serif text-2xl font-semibold text-muted-foreground/30">
              0{i + 1}
            </span>
            <h3 className="mt-4 font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: LineChart,
    title: "Labour-market intelligence",
    body: "See which sectors and roles are growing, in-demand skills, and regional opportunities across the country.",
  },
  {
    icon: Target,
    title: "Skills gap analysis",
    body: "Compare your current skills to your target career and get a clear plan to close the gap.",
  },
  {
    icon: BookOpen,
    title: "Curated learning",
    body: "Discover courses, certifications, and scholarships — many free — to build the skills you need.",
  },
]

export function Features() {
  return (
    <section id="insights" className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CareersPreview() {
  const preview = CAREERS.slice(0, 6)
  return (
    <section id="careers" className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Explore careers that matter here
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From technology and health to agriculture and renewable energy — with real salary ranges in Leones.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/sign-up">
            View all careers
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {preview.map((c) => (
          <Card key={c.id} className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{c.category}</Badge>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary"
              >
                {c.demand} demand
              </Badge>
            </div>
            <h3 className="mt-4 font-semibold">{c.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
            <p className="mt-4 text-sm font-medium text-foreground">{c.salaryRange}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

const TESTIMONIALS = [
  {
    quote:
      "I had no idea what to study after WASSCE. The assessment showed me I'd love data work, and the salary data made it real.",
    name: "Aminata K.",
    role: "Student, Freetown",
  },
  {
    quote:
      "The AI advisor explained exactly how to move from teaching into public health. I'm now enrolled in a program.",
    name: "Mohamed S.",
    role: "Graduate, Bo",
  },
  {
    quote:
      "As a career counsellor, I use CareerAI with my students. The local labour-market data is what sets it apart.",
    name: "Fatmata J.",
    role: "School Counsellor, Makeni",
  },
]

export function Testimonials() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Trusted by young Sierra Leoneans
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6">
              <Quote className="h-7 w-7 text-primary/40" />
              <p className="mt-4 text-pretty leading-relaxed">{t.quote}</p>
              <div className="mt-5">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "Is CareerAI really free?",
    a: "Yes. Creating an account, taking the assessment, exploring careers, and using the AI advisor are all free.",
  },
  {
    q: "Do I need work experience?",
    a: "Not at all. CareerAI is designed for students, fresh graduates, and job seekers at any stage.",
  },
  {
    q: "How accurate are the salary figures?",
    a: "Salary ranges are indicative estimates in Sierra Leonean Leone, meant to guide expectations rather than guarantee pay.",
  },
  {
    q: "How does the AI make recommendations?",
    a: "It combines your assessment results with each career's interest profile and current demand in Sierra Leone.",
  },
  {
    q: "Can counsellors and schools use it?",
    a: "Absolutely. Counsellors use CareerAI to guide students with data-backed, locally relevant advice.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
      <div className="text-center">
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Frequently asked questions
        </h2>
      </div>
      <Accordion className="mt-10">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24">
      <Card className="overflow-hidden bg-primary p-10 text-center text-primary-foreground md:p-16">
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Your future starts with one step
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/90">
          Join thousands of young Sierra Leoneans discovering careers that fit who they are and where the
          opportunities truly are.
        </p>
        <Button size="lg" variant="secondary" className="mt-8" asChild>
          <Link href="/sign-up">
            Create your free account
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </Card>
    </section>
  )
}
