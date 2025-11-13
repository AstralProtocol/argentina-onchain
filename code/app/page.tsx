"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { ChatMapView } from "@/components/chat-map-view"
import events from "@/data/events.json"
import services from "@/data/services.json"

export default function Home() {
  const [highlightedServices, setHighlightedServices] = useState<string[]>([])

  return (
    <div className="flex h-screen bg-black">
      {/* Left Panel: Chat */}
      <div className="w-[38%] border-r border-white/10 flex flex-col">
        <ChatInterface onHighlightServices={setHighlightedServices} />
      </div>

      {/* Right Panel: Map */}
      <div className="flex-1">
        <ChatMapView events={events} services={services} highlightedServices={highlightedServices} />
      </div>
    </div>
  )
}
