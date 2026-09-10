'use client'

/**
 * WhatsAppBubble - remplace le chat Crisp. Le bouton ouvre une conversation
 * WhatsApp avec le numéro du setter (+33 6 52 81 54 96, celui que ManyChat
 * écoute), présenté comme « l'équipe en ligne » : c'est Kevin qui répond, en
 * première personne, via le setter. Pas le 06 65 42 74 70 de la page merci -
 * ce numéro-là n'entre jamais dans le setter.
 *
 * Le message prérempli porte la page d'origine, pour que la première bulle
 * du prospect dise d'où il vient sans qu'on lui demande.
 */

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const SETTER_PHONE = '33652815496'

export default function WhatsAppBubble() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [href, setHref] = useState(`https://wa.me/${SETTER_PHONE}`)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const page = typeof window !== 'undefined' ? window.location.pathname : '/'
    const text = fr
      ? `Salut Kevin, je suis sur empireinternet.com${page === '/' ? '' : page} et j'ai une question`
      : `Hi Kevin, I'm on empireinternet.com${page === '/' ? '' : page} and I have a question`
    setHref(`https://wa.me/${SETTER_PHONE}?text=${encodeURIComponent(text)}`)
    const t = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(t)
  }, [fr])

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={fr ? 'Parler à l\'équipe sur WhatsApp' : 'Talk to the team on WhatsApp'}
      className={`fixed bottom-4 right-4 z-[60] flex items-center gap-3 rounded-full border border-white/10 bg-[#111] p-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] transition-all hover:scale-[1.03] hover:bg-[#161616] sm:py-2 sm:pl-2 sm:pr-4 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] sm:h-10 sm:w-10">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white sm:h-5 sm:w-5" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-[#111] bg-emerald-400 sm:h-3 sm:w-3" />
        </span>
      </span>
      <span className="hidden text-left sm:block">
        <span className="block text-[13px] font-bold leading-tight text-white">{fr ? 'Parler à l\'équipe' : 'Talk to the team'}</span>
        <span className="block text-[11px] leading-tight text-emerald-400">{fr ? 'En ligne · réponse en direct' : 'Online · live reply'}</span>
      </span>
    </a>
  )
}
