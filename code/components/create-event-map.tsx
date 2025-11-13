"use client"

import { useEffect, useState, useRef } from "react"

declare global {
  interface Window {
    mapboxgl: any
  }
}

interface CreateEventMapProps {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation: { lat: number; lng: number; name: string }
}

export function CreateEventMap({ onLocationSelect, selectedLocation }: CreateEventMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
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
      center: [-71.35081791015435, -40.154861871362385],
      zoom: 12,
    })

    mapInstance.on("load", () => {
      mapInstance.on("click", (e: any) => {
        onLocationSelect(e.lngLat.lat, e.lngLat.lng)
      })

      setMap(mapInstance)
    })

    return () => {
      mapInstance.remove()
    }
  }, [mapLoaded, map, onLocationSelect])

  useEffect(() => {
    if (!map) return

    if (marker) {
      marker.remove()
    }

    const el = document.createElement("div")
    el.style.width = "32px"
    el.style.height = "32px"
    el.style.borderRadius = "50%"
    el.style.backgroundColor = "#F97316"
    el.style.border = "3px solid rgba(255, 255, 255, 0.9)"
    el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)"
    el.style.cursor = "grab"

    const newMarker = new window.mapboxgl.Marker({
      element: el,
      draggable: true,
    })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .addTo(map)

    newMarker.on("dragend", () => {
      const lngLat = newMarker.getLngLat()
      onLocationSelect(lngLat.lat, lngLat.lng)
    })

    setMarker(newMarker)
  }, [selectedLocation, map, onLocationSelect])

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-[600px] relative">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <div className="text-white text-sm">Loading map...</div>
          </div>
        )}
      </div>
      <div className="bg-white/5 p-3 text-xs text-white/60 text-center">
        Click or drag the pin to set the event location
      </div>
    </div>
  )
}
