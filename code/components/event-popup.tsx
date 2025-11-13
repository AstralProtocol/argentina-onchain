"use client"

import { X, MapPin, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EVENT_COLORS } from "@/lib/map-styles"

interface Event {
  id: string
  title: string
  type: string
  location: {
    name: string
  }
  date: string
  pricing: {
    total: number
  }
  host: {
    name: string
  }
}

export function EventPopup({ event, onClose }: { event: Event; onClose: () => void }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
      <div className="bg-black/95 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="h-2" style={{ backgroundColor: EVENT_COLORS[event.type as keyof typeof EVENT_COLORS] }} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wider mb-1">{event.type}</div>
              <h3 className="text-xl font-bold text-white">{event.title}</h3>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <MapPin className="w-4 h-4 text-white/60" />
              {event.location.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Calendar className="w-4 h-4 text-white/60" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <DollarSign className="w-4 h-4 text-white/60" />${event.pricing.total} USDC
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Hosted by <span className="text-white">{event.host.name}</span>
            </div>
            <Link href={`/event/${event.id}`}>
              <Button className="bg-white text-black hover:bg-white/90">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
