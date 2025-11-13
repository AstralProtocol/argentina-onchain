"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import { EVENT_COLORS } from "@/lib/map-styles"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: Date
  cards?: ServiceCard[]
}

interface ServiceCard {
  id: string
  name: string
  category: string
  avatar: string
  reputation: string
  globalHistory: string
  pricing: string
  address: string
}

interface ChatInterfaceProps {
  onHighlightServices?: (serviceIds: string[]) => void
}

export function ChatInterface({ onHighlightServices }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("chat-messages")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Welcome to San Martín, John. I can help you find local places and people who offer services. What are you looking for?",
        timestamp: new Date(),
      },
    ]
  })
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const [hasShownBabysitter, setHasShownBabysitter] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("has-shown-babysitter") === "true"
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("chat-messages", JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    const returnedFrom = searchParams.get("from")
    const hasReserved = searchParams.get("reserved") === "true"

    if (returnedFrom === "service" && hasReserved && !hasShownBabysitter) {
      setHasShownBabysitter(true)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("has-shown-babysitter", "true")
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Good news — we found a babysitter! Here's her profile.",
            timestamp: new Date(),
            cards: [
              {
                id: "maria-babysitter",
                name: "María",
                category: "Babysitter",
                avatar: "/profiles/maria.jpg",
                reputation: "15 verified jobs in San Martín",
                globalHistory: "Also active in Buenos Aires, Bariloche",
                pricing: "From 5k ARS per hour",
                address: "0x9fE2...8a1C",
              },
            ],
          },
        ])

        if (onHighlightServices) {
          onHighlightServices(["maria-babysitter"])
        }
      }, 1500)
    }
  }, [searchParams, onHighlightServices, hasShownBabysitter])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes("babysitter") || lowerInput.includes("baby")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Looking for babysitters near you…",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content:
                "Right now there are no babysitters listed. I've asked the local network, and I'll notify you if someone becomes available.",
              timestamp: new Date(),
            },
          ])

          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content: "Anything else you need help with?",
                timestamp: new Date(),
              },
            ])
          }, 1000)
        }, 1500)
      }, 500)
    } else if (lowerInput.includes("cook") || lowerInput.includes("dinner") || lowerInput.includes("chef")) {
      setTimeout(() => {
        const serviceCards: ServiceCard[] = [
          {
            id: "ana-cook",
            name: "Ana",
            category: "Home Cook",
            avatar: "/profiles/ana.jpg",
            reputation: "12 verified jobs in San Martín",
            globalHistory: "Also active in London, CDMX",
            pricing: "From 30k ARS per dinner",
            address: "0x2c75...5c23",
          },
          {
            id: "carlos-cook",
            name: "Carlos",
            category: "Home Cook",
            avatar: "/profiles/carlos.jpg",
            reputation: "18 verified jobs in San Martín",
            globalHistory: "Also active in Buenos Aires, Mendoza",
            pricing: "From 35k ARS per dinner",
            address: "0x5aAe...eAed",
          },
          {
            id: "lucia-cook",
            name: "Lucía",
            category: "Home Cook",
            avatar: "/profiles/lucia.jpg",
            reputation: "9 verified jobs in San Martín",
            globalHistory: "Also active in Barcelona, Lima",
            pricing: "From 28k ARS per dinner",
            address: "0x71C7...976F",
          },
        ]

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "I found 3 local home cooks who serve your area.",
            timestamp: new Date(),
            cards: serviceCards,
          },
        ])
        setIsTyping(false)

        if (onHighlightServices) {
          onHighlightServices(["ana-cook", "carlos-cook", "lucia-cook"])
        }
      }, 1000)
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "I can help you find local services like home cooks, babysitters, tour guides, and more. What would you like to find?",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 800)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    simulateResponse(input)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">San Martín Onchain</h1>
        <p className="text-sm text-white/60 mt-1">Invited by your host in San Martín de los Andes.</p>
      </div>

      <div className="p-4 border-b border-white/10">
        <h3 className="text-xs font-medium text-white/60 uppercase tracking-wide mb-3">Map Legend</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(EVENT_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-white/80 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${message.role === "user" ? "bg-blue-600" : "bg-white/10"} rounded-2xl p-4`}>
              <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>

              {message.cards && (
                <div className="mt-4 space-y-3">
                  {message.cards.map((card) => (
                    <div key={card.id} className="bg-black/40 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                          {card.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{card.name}</h4>
                            <span className="text-xs text-white/60">{card.address}</span>
                          </div>
                          <p className="text-xs text-white/60 mt-1">{card.category}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-white/80">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{card.reputation}</span>
                          </div>
                          <p className="text-xs text-white/60 mt-1">{card.globalHistory}</p>
                          <p className="text-sm text-white font-medium mt-2">{card.pricing}</p>
                          <Link href={`/service/${card.id}`}>
                            <Button size="sm" className="mt-3 w-full bg-white text-black hover:bg-white/90">
                              View profile
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
