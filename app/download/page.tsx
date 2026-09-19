import { Download, FileText } from "lucide-react"

export default function ChapterDownloadPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
          <FileText className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">CareerAI dissertation</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Chapter Four Word Document</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-300">
          Download the prepared Chapter Four document directly. The file is served from the project&apos;s public download route.
        </p>
        <a
          href="/api/chapter-four"
          download="Chapter_Four-ready-to-submit.docx"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download Word document
        </a>
        <p className="mt-5 text-xs text-slate-400">DOCX · Chapter_Four-ready-to-submit.docx</p>
      </section>
    </main>
  )
}
