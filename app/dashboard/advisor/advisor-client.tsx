"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { MessageSquare, Send, Sparkles, Trash2, User, Bot, Loader2 } from "lucide-react"
import { sendChatMessage, clearChatHistory } from "@/app/actions/advisor"
import type { SessionUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const STARTER_PROMPTS = [
  "What careers pay best in Freetown?",
  "How do I become a Software Developer in Sierra Leone?",
  "What public health opportunities exist in the provinces?",
  "How can I transition into Agribusiness with no experience?",
]

export function AdvisorChatClient({
  user,
  initialHistory,
}: {
  user: SessionUser
  initialHistory: Array<{ id: number; role: string; content: string; createdAt: Date }>
}) {
  const [messages, setMessages] = useState(initialHistory)
  const [input, setInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isPending])

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim()
    if (!prompt || isPending) return

    // Optimistically update UI
    const tempUserMsg = { id: Date.now(), role: "user", content: prompt, createdAt: new Date() }
    setMessages((prev) => [...prev, tempUserMsg])
    setInput("")

    startTransition(async () => {
      try {
        const res = await sendChatMessage(prompt)
        if (res.error) {
          toast.error(res.error)
          return
        }
        // Render the real assistant reply returned by the server action.
        const aiMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: res.reply ?? "I'm having trouble responding right now. Please try again.",
          createdAt: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])
      } catch (err: any) {
        toast.error("Failed to send message")
      }
    })
  }

  const handleClear = () => {
    startTransition(async () => {
      await clearChatHistory()
      setMessages([])
      toast.success("Chat history cleared")
    })
  }

  return (
    <div className="container max-w-4xl space-y-6 p-4 py-8 md:p-8 flex flex-col h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Sierra Leone Career AI Advisor
            </Badge>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight mt-1">Ask Your Career Advisor</h1>
        </div>

        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} disabled={isPending}>
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Chat Messages Window */}
      <Card className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 border shadow-sm">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-10 w-10" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="font-serif text-2xl font-bold">Hello, {user.name}!</h3>
              <p className="text-sm text-muted-foreground">
                I am your AI Career Advisor. Ask me anything about skills, salary expectations, study paths, or job opportunities in Sierra Leone.
              </p>
            </div>

            {/* Starter Prompts */}
            <div className="grid gap-2 w-full max-w-lg text-left">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Questions</p>
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-xl border p-3 text-sm text-left hover:bg-muted transition-colors font-medium flex items-center justify-between"
                >
                  <span>"{prompt}"</span>
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user"
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={isUser ? "bg-primary text-primary-foreground text-xs" : "bg-muted text-foreground text-xs"}>
                    {isUser ? user.name[0]?.toUpperCase() : <Bot className="h-4 w-4 text-primary" />}
                  </AvatarFallback>
                </Avatar>

                <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground border"}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`block text-[10px] mt-2 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )
          })
        )}

        {isPending && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-muted text-foreground">
                <Bot className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-2xl border bg-muted/60 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-2"
      >
        <Input
          placeholder="Ask a question about careers, salaries, or study paths in Sierra Leone..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending || !input.trim()}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}


