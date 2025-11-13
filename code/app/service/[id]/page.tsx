import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, ExternalLink, Shield, MapPin, CheckCircle } from "lucide-react"
import services from "@/data/services.json"

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = services.find((s) => s.id === id)

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to map
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
            {service.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{service.name}</h1>
              <a
                href={`https://etherscan.io/address/${service.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/60 hover:text-white/80 flex items-center gap-1"
              >
                {service.address}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-white/60 mb-4">{service.category}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {service.reputation.verifiedJobs} verified jobs in {service.reputation.location}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/60 mt-2">
              Onchain identity since {service.onchainSince} • {service.globalHistory}
            </p>
          </div>
        </div>

        {"verifiedAccounts" in service && service.verifiedAccounts && (
          <div>
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-3">Verified Accounts</h2>
            <div className="flex gap-3">
              {service.verifiedAccounts.map((account) => (
                <a
                  key={account.platform}
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">{account.platform}</span>
                  <span className="text-xs text-white/60">{account.handle}</span>
                  <ExternalLink className="w-3 h-3 text-white/40" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div>
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {service.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-3">About</h2>
          <p className="text-white/80 leading-relaxed">{service.description}</p>
        </div>

        {"pastJobs" in service && service.pastJobs && (
          <div>
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">Past Jobs & Reviews</h2>
            <div className="space-y-4">
              {service.pastJobs.map((job) => (
                <div key={job.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-white">{job.description}</p>
                      <p className="text-sm text-white/60 mt-1">
                        {job.date} • {job.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: job.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-3">{job.review}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {job.client.name[0]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80">{job.client.name}</span>
                      {job.client.verified && <CheckCircle className="w-3 h-3 text-green-400" />}
                      <a
                        href={`https://etherscan.io/address/${job.client.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1"
                      >
                        {job.client.address}
                        <ExternalLink className="w-2 h-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Map */}
        <div>
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-3">Service Area</h2>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{service.location.name}</span>
            </div>
            <p className="text-sm text-white/60">Service radius: {service.location.serviceRadius}km</p>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-3">Pricing</h2>
          <div className="text-2xl font-bold">
            {service.pricing.from.toLocaleString()} {service.pricing.currency}
            <span className="text-lg text-white/60 font-normal ml-2">{service.pricing.unit}</span>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Verified on Ethereum Attestation Service</h3>
              <a
                href={`https://easscan.org/attestation/view/${service.attestationId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View attestation on EASscan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Link href="/?from=service&reserved=true" className="flex-1">
            <Button className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-medium">
              Reserve with COTEPAY (escrow)
            </Button>
          </Link>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 bg-transparent">
            Message provider
          </Button>
        </div>
      </div>
    </div>
  )
}
