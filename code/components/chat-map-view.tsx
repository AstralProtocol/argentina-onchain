"use client"

import { useEffect, useState, useRef } from "react"
import { EVENT_COLORS } from "@/lib/map-styles"

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
}

interface Service {
  id: string
  name: string
  type: string
  location: {
    lat: number
    lng: number
    name: string
  }
}

interface ChatMapViewProps {
  events: Event[]
  services: Service[]
  highlightedServices?: string[]
}

export function ChatMapView({ events, services, highlightedServices = [] }: ChatMapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])

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

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add event markers
    events.forEach((event) => {
      const el = document.createElement("div")
      el.style.width = "24px"
      el.style.height = "24px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = EVENT_COLORS[event.type]
      el.style.border = "2px solid rgba(255, 255, 255, 0.6)"
      el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)"
      el.style.cursor = "pointer"

      const marker = new window.mapboxgl.Marker(el).setLngLat([event.location.lng, event.location.lat]).addTo(map)

      markersRef.current.push(marker)
    })

    // Add service markers (cooks)
    services.forEach((service) => {
      const isHighlighted = highlightedServices.includes(service.id)
      const el = document.createElement("div")
      el.style.width = isHighlighted ? "32px" : "24px"
      el.style.height = isHighlighted ? "32px" : "24px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = "#10b981" // green for services
      el.style.border = isHighlighted ? "3px solid #fff" : "2px solid rgba(255, 255, 255, 0.6)"
      el.style.boxShadow = isHighlighted ? "0 4px 16px rgba(16, 185, 129, 0.6)" : "0 2px 8px rgba(0, 0, 0, 0.3)"
      el.style.cursor = "pointer"
      el.style.transition = "all 0.3s"

      if (isHighlighted) {
        el.style.animation = "pulse 2s infinite"
      }

      const marker = new window.mapboxgl.Marker(el).setLngLat([service.location.lng, service.location.lat]).addTo(map)

      markersRef.current.push(marker)
    })
  }, [events, services, highlightedServices, map])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4" />
            <div>Loading map...</div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
