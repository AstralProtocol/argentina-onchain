import { notFound } from "next/navigation"
import events from "@/data/events.json"
import { MapPin, Calendar, Clock, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EVENT_COLORS } from "@/lib/map-styles"
import { EventMap } from "@/components/event-map"

export function generateStaticParams() {
  return events.map((event) => ({
    id: event.id,
  }))
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = events.find((e) => e.id === id)

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <Link href="/" className="text-white/60 hover:text-white text-sm mb-6 inline-block">
          ← Back to map
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-3"
                style={{
                  backgroundColor: EVENT_COLORS[event.type as keyof typeof EVENT_COLORS],
                  color: "white",
                }}
              >
                {event.type}
              </div>
              <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-white/70 leading-relaxed">{event.description}</p>
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-6 space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm text-white/60">Location</div>
                  <div className="font-medium">{event.location.name}</div>
                  <a
                    href={`https://www.google.com/maps?q=${event.location.lat},${event.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                  >
                    View on map <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm text-white/60">Date</div>
                  <div className="font-medium">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm text-white/60">Time</div>
                  <div className="font-medium">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-white/60 mt-0.5" />
                <div>
                  <div className="text-sm text-white/60">Attendees</div>
                  <div className="font-medium">
                    {event.attendees} / {event.maxAttendees} spots filled
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg border border-white/10 p-6 mb-6">
              <h3 className="font-semibold mb-4">Pricing Breakdown</h3>
              <div className="space-y-3">
                {event.pricing.transportation > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Transportation</span>
                    <span className="font-medium">${event.pricing.transportation}</span>
                  </div>
                )}
                {event.pricing.equipment > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Equipment</span>
                    <span className="font-medium">${event.pricing.equipment}</span>
                  </div>
                )}
                {event.pricing.tickets > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Tickets</span>
                    <span className="font-medium">${event.pricing.tickets}</span>
                  </div>
                )}
                {event.pricing.accommodation > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Accommodation</span>
                    <span className="font-medium">${event.pricing.accommodation}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${event.pricing.total} USDC</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-white text-black hover:bg-white/90 h-12">Pay with COTEPAY</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 bg-transparent">
                Show Interest
              </Button>
            </div>

            <div className="mt-6 bg-white/5 rounded-lg border border-white/10 p-6">
              <h3 className="font-semibold mb-4">Host</h3>
              <Link
                href={`/profile/${event.host.id}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                  {event.host.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.host.name}</div>
                  <div className="text-sm text-white/60 font-mono">
                    {event.host.address.slice(0, 6)}...{event.host.address.slice(-4)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{event.host.badges}</div>
                  <div className="text-xs text-white/60">badges</div>
                </div>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-xs text-blue-400 font-mono bg-blue-500/20 px-2 py-1 rounded mt-0.5">EAS</div>
                <div className="flex-1">
                  <div className="text-sm text-white/80 mb-1">Verified on Ethereum Attestation Service</div>
                  <a
                    href={`https://easscan.org/attestation/view/${event.attestationId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                  >
                    {event.attestationId} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:sticky md:top-6 h-fit">
            <EventMap
              lat={event.location.lat}
              lng={event.location.lng}
              name={event.location.name}
              color={EVENT_COLORS[event.type as keyof typeof EVENT_COLORS]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
