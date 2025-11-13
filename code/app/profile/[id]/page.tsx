import { notFound } from "next/navigation"
import events from "@/data/events.json"
import { ExternalLink, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

const profiles = {
  diego: {
    id: "diego",
    name: "Diego",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    badges: 138,
    bio: "Mountain guide and outdoor enthusiast. Leading adventures in Patagonia for over 10 years.",
    socials: {
      twitter: "diego_patagonia",
      instagram: "diego.mountains",
    },
  },
  maria: {
    id: "maria",
    name: "María",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    badges: 67,
    bio: "Local transportation provider. Safe and reliable rides throughout San Martín.",
    socials: {},
  },
  carlos: {
    id: "carlos",
    name: "Carlos",
    address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    badges: 92,
    bio: "Event organizer and community builder. Bringing people together since 2018.",
    socials: {},
  },
  lucia: {
    id: "lucia",
    name: "Lucía",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    badges: 45,
    bio: "Yoga instructor and wellness coach. Helping people find balance in nature.",
    socials: {},
  },
  pablo: {
    id: "pablo",
    name: "Pablo",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    badges: 103,
    bio: "Coworking space owner. Supporting remote workers and digital nomads.",
    socials: {},
  },
  ana: {
    id: "ana",
    name: "Ana",
    address: "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23",
    badges: 78,
    bio: "Environmental activist and trail builder. Protecting Patagonia for future generations.",
    socials: {},
  },
}

export function generateStaticParams() {
  return Object.keys(profiles).map((id) => ({
    id,
  }))
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = profiles[id as keyof typeof profiles]

  if (!profile) {
    notFound()
  }

  const userEvents = events.filter((e) => e.host.id === id)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        <Link href="/" className="text-white/60 hover:text-white text-sm mb-6 inline-block">
          ← Back to map
        </Link>

        <div className="bg-white/5 rounded-lg border border-white/10 p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {profile.name[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <div className="flex items-center gap-2 text-white/60 font-mono text-sm mb-3">
                <span>{profile.address}</span>
                <a
                  href={`https://etherscan.io/address/${profile.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
                <span className="text-2xl font-bold text-yellow-500">{profile.badges}</span>
                <span className="text-sm text-yellow-500">Event Badges</span>
              </div>
            </div>
          </div>

          <p className="text-white/70 leading-relaxed mb-6">{profile.bio}</p>

          {Object.keys(profile.socials).length > 0 && (
            <div className="flex gap-3">
              {profile.socials.twitter && (
                <a
                  href={`https://twitter.com/${profile.socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  @{profile.socials.twitter}
                </a>
              )}
              {profile.socials.instagram && (
                <a
                  href={`https://instagram.com/${profile.socials.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pink-400 hover:text-pink-300"
                >
                  @{profile.socials.instagram}
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Event History</h2>
          <div className="space-y-3">
            {userEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="block bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${event.pricing.total}</div>
                    <div className="text-xs text-white/60">USDC</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
