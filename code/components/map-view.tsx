"use client"

import { useEffect, useState, useRef } from "react"
import { EVENT_COLORS } from "@/lib/map-styles"
import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"
import Link from "next/link"
import { EventPopup } from "./event-popup"

declare global {
  interface Window {
    mapboxgl: any
  }
}

interface Event {
  id: string
  title: string
  type: "activity" | "transport" | "event" | "space" | "opportunity"
  location: {
    lat: number
    lng: number
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

export function MapView({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])
  const [filters, setFilters] = useState({
    activity: true,
    transport: true,
    event: true,
    space: true,
    opportunity: true,
  })

  useEffect(() => {
    const checkMapbox = setInterval(() => {
      if (window.mapboxgl) {
        setMapLoaded(true)
        clearInterval(checkMapbox)
      }
    }, 100)

    return () => clearInterval(checkMapbox)
  }, [])

  useEffect(() => {
    if (!mapLoaded || map || !mapContainerRef.current) return

    window.mapboxgl.accessToken =
      "pk.eyJ1IjoiYXN0cmFscHJvdG9jb2wiLCJhIjoiY21odzZvZXByMDNzZzJtcHIyYWpuYWcyNSJ9.hho_T34oUvGXehi_2dCHzA"

    const mapInstance = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-71.35081791015435, -40.154861871362385],
      zoom: 12,
    })

    mapInstance.on("load", () => {
      setMap(mapInstance)
    })

    return () => {
      mapInstance.remove()
    }
  }, [mapLoaded, map])

  useEffect(() => {
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    events.forEach((event) => {
      if (!filters[event.type]) return

      const el = document.createElement("div")
      el.className = "marker"
      el.style.width = "32px"
      el.style.height = "32px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = EVENT_COLORS[event.type]
      el.style.border = "3px solid rgba(255, 255, 255, 0.9)"
      el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)"
      el.style.cursor = "pointer"
      el.style.transition = "transform 0.2s"

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)"
      })
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)"
      })

      const marker = new window.mapboxgl.Marker(el).setLngLat([event.location.lng, event.location.lat]).addTo(map)

      el.addEventListener("click", () => {
        setSelectedEvent(event)
      })

      markersRef.current.push(marker)
    })
  }, [events, filters, map])

  const toggleFilter = (type: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Patagonia Events</h1>
          <div className="flex gap-2">
            <Link href="/create">
              <Button className="bg-white text-black hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
            <Link href="/profile/diego">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute top-24 left-4 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <h3 className="text-sm font-medium text-white mb-3">Filter by Type</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(filters).map(([type, enabled]) => (
            <button
              key={type}
              onClick={() => toggleFilter(type as keyof typeof filters)}
              className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
              style={{ opacity: enabled ? 1 : 0.4 }}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white/50"
                style={{ backgroundColor: EVENT_COLORS[type as keyof typeof EVENT_COLORS] }}
              />
              <span className="text-white capitalize">{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={mapContainerRef} id="map" className="w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4" />
            <div>Loading map...</div>
          </div>
        </div>
      )}

      {selectedEvent && <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  )
}
