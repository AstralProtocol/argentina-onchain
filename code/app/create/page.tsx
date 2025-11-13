"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Calendar, Clock } from "lucide-react"
import { CreateEventMap } from "@/components/create-event-map"

export default function CreatePage() {
  const [formData, setFormData] = useState({
    title: "",
    type: "activity",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: { lat: -40.1548, lng: -71.3508, name: "" },
  })

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat, lng, name: `${lat.toFixed(4)}, ${lng.toFixed(4)}` },
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <Link href="/" className="text-white/60 hover:text-white text-sm mb-6 inline-block">
          ← Back to map
        </Link>

        <h1 className="text-4xl font-bold mb-8">Create New Event</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="event">Event</option>
                <option value="activity">Activity</option>
                <option value="space">Space</option>
                <option value="transport">Transport</option>
                <option value="opportunity">Opportunity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Name your event..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your event..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white/60" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/60" />
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/60" />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <MapPin className="w-5 h-5 text-white/60" />
                <span className="text-sm text-white/70">
                  {formData.location.name || "Click on the map to select location"}
                </span>
              </div>
            </div>

            <Button className="w-full bg-white text-black hover:bg-white/90 h-12">Create Event & Attest on EAS</Button>

            <div className="text-xs text-white/60 text-center">
              This will create an attestation on the Ethereum Attestation Service and submit a transaction to the
              blockchain.
            </div>
          </div>

          <div className="md:sticky md:top-6 h-fit">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Location</h3>
              <p className="text-sm text-white/60">Click anywhere on the map to place your event pin</p>
            </div>
            <CreateEventMap onLocationSelect={handleLocationSelect} selectedLocation={formData.location} />
          </div>
        </div>
      </div>
    </div>
  )
}
