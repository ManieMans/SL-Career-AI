import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"

export async function GET() {
  const filePath = join(process.cwd(), "public", "Chapter_Four-ready-to-submit.docx")
  const file = await readFile(filePath)

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="Chapter_Four-ready-to-submit.docx"',
      "Cache-Control": "private, no-store",
    },
  })
}
