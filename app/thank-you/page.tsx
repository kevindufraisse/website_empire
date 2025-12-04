import { CheckCircle2, Calendar, Zap } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0f0f0f] to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      <div className="container py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-empire/20 border-4 border-empire flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(218,252,104,0.3)]">
            <CheckCircle2 className="text-empire" size={48} />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            You're In! 🎉
          </h1>
          
          <p className="text-xl text-neutral-300 mb-6">
            Your meeting is booked
          </p>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex -space-x-2">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gradient-to-br from-empire/30 to-empire/10 flex items-center justify-center text-sm font-bold text-white">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-300">
              You're one of <span className="text-empire font-bold">12 creators</span> who joined this week
            </p>
          </div>

          {/* What's Next */}
          <div className="space-y-4 mb-12">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-empire" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Check your email</p>
                  <p className="text-sm text-neutral-400">
                    You'll receive the Zoom link + calendar invite within 2 minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-empire/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="text-empire" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Prepare your questions</p>
                  <p className="text-sm text-neutral-400">
                    We'll show you real examples, answer everything, and help you decide if Empire is right for you
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bonus */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/30">
            <p className="text-empire font-bold mb-3">🎁 Early Bird Bonus</p>
            <p className="text-white mb-2">Since you registered early, you get:</p>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>✓ Priority onboarding (start next week)</li>
              <li>✓ Free content audit (€500 value)</li>
              <li>✓ 10 bonus posts first month</li>
            </ul>
          </div>

          <p className="text-sm text-neutral-500 mt-8">
            See you at the meeting! 👋
          </p>
        </div>
      </div>
    </main>
  )
}

