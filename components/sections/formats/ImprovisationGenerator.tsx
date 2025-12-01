'use client'
import Image from 'next/image'
import { CheckCircle2, Sparkles } from 'lucide-react'

interface ImprovisationGeneratorProps {
  lang: 'en' | 'fr'
}

export default function ImprovisationGenerator({ lang }: ImprovisationGeneratorProps) {
  const t = {
    fr: {
      title: 'Générateur de Plan Improvisation',
      subtitle: 'IA crée votre structure de vidéo en 2 étapes',
    },
    en: {
      title: 'Improvisation Plan Generator',
      subtitle: 'AI creates your video structure in 2 steps',
    }
  }

  const text = t[lang]

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      {/* Left side - Content */}
      <div>
        <div className="inline-block px-3 py-1 rounded-full bg-empire/10 border border-empire/30 text-empire text-xs font-semibold mb-4">
          🎯 {lang === 'fr' ? 'IMPROVISATION' : 'IMPROVISATION'}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">{text.title}</h3>
        <p className="text-lg text-neutral-300 mb-6">{text.subtitle}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
            <span className="text-neutral-200">
              {lang === 'fr' ? 'IA génère 7 questions personnalisées' : 'AI generates 7 personalized questions'}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
            <span className="text-neutral-200">
              {lang === 'fr' ? 'Répondez par texte ou vocalement' : 'Answer via text or voice'}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
            <span className="text-neutral-200">
              {lang === 'fr' ? 'Obtenez mindmap + fiche tournage' : 'Get mindmap + shooting guide'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
          <p className="text-sm font-semibold text-empire mb-1 flex items-center gap-2">
            <Sparkles size={14} />
            {lang === 'fr' ? '✨ Parfait pour :' : '✨ Perfect for:'}
          </p>
          <p className="text-sm text-neutral-300">
            {lang === 'fr' 
              ? 'Créateurs qui veulent une structure claire avant de filmer'
              : 'Creators who want a clear structure before filming'}
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <Image
            src="https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd3a34b27_3.png"
            alt={text.title}
            width={3564}
            height={2430}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}





