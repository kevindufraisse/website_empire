'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Link2, Check } from 'lucide-react'
import { getLocalizedArchetype, type ArchetypeId } from '@/lib/quiz-data'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  archetype: ArchetypeId
  score: number
}

export default function QuizShareButtons({ archetype, score }: Props) {
  const { lang } = useLanguage()
  const [copied, setCopied] = useState(false)
  const profile = getLocalizedArchetype(archetype, lang)

  function getShareUrl(): string {
    if (typeof window === 'undefined') return ''
    const url = new URL('/quiz', window.location.origin)
    url.searchParams.set('ref', 'share')
    url.searchParams.set('a', archetype)
    return url.toString()
  }

  const shareText = lang === 'fr'
    ? `Mon archétype de Creator selon Empire : ${profile.emoji} ${profile.name} (${score}/100). Et vous, vous êtes lequel ?`
    : `My Creator archetype according to Empire: ${profile.emoji} ${profile.name} (${score}/100). What's yours?`

  function shareTwitter() {
    const url = getShareUrl()
    const tweetUrl = new URL('https://twitter.com/intent/tweet')
    tweetUrl.searchParams.set('text', shareText)
    tweetUrl.searchParams.set('url', url)
    window.open(tweetUrl.toString(), '_blank', 'noopener,noreferrer,width=600,height=500')
  }

  function shareLinkedIn() {
    const url = getShareUrl()
    const liUrl = new URL('https://www.linkedin.com/sharing/share-offsite/')
    liUrl.searchParams.set('url', url)
    window.open(liUrl.toString(), '_blank', 'noopener,noreferrer,width=600,height=500')
  }

  async function copyLink() {
    const url = getShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt(lang === 'fr' ? 'Copiez ce lien :' : 'Copy this link:', url)
    }
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/10 mt-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-empire font-bold mb-2">
        {lang === 'fr'
          ? 'Vous connaissez quelqu\u2019un qui a besoin de ce test ?'
          : 'Know someone who needs this quiz?'}
      </p>
      <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
        {lang === 'fr'
          ? 'Partagez votre archétype et invitez-le à découvrir le sien.'
          : 'Share your archetype and invite them to discover theirs.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareTwitter}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition"
        >
          <Twitter size={15} />
          {lang === 'fr' ? 'Partager sur X' : 'Share on X'}
        </button>
        <button
          onClick={shareLinkedIn}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition"
        >
          <Linkedin size={15} />
          {lang === 'fr' ? 'Partager sur LinkedIn' : 'Share on LinkedIn'}
        </button>
        <button
          onClick={copyLink}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
            copied
              ? 'bg-empire/15 border-empire text-empire'
              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white'
          }`}
        >
          {copied ? <Check size={15} /> : <Link2 size={15} />}
          {copied
            ? (lang === 'fr' ? 'Lien copié !' : 'Link copied!')
            : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}
        </button>
      </div>
    </div>
  )
}
