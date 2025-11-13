"use client"

import { useEffect, useState, useRef } from "react"

declare global {
  interface Window {
    mapboxgl: any
  }
}

export function EventMap({ lat, lng, name, color }: { lat: number; lng: number; name: string; color: string }) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

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
      center: [lng, lat],
      zoom: 14,
    })

    mapInstance.on("load", () => {
      const el = document.createElement("div")
      el.style.width = "32px"
      el.style.height = "32px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = color
      el.style.border = "3px solid rgba(255, 255, 255, 0.9)"
      el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)"

      new window.mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(mapInstance)

      setMap(mapInstance)
    })

    return () => {
      mapInstance.remove()
    }
  }, [lat, lng, color, mapLoaded, map])

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl relative">
      <div ref={mapContainerRef} className="w-full h-[600px]" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-white text-sm">Loading map...</div>
        </div>
      )}
    </div>
  )
}
