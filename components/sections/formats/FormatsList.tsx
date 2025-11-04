'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import { Mic, Target, FileText, MonitorPlay, Copy, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

interface FormatCardProps {
  icon: React.ElementType
  badge: string
  title: string
  description: string
  benefits: string[]
  outputs: {
    title: string
    items: Array<{ icon: React.ReactNode; text: string }>
  }
  extraInfo?: string
  useCase: {
    title: string
    text: string
  }
  imageSrc: string
  reverse?: boolean
}

function FormatCard({ icon: Icon, badge, title, description, benefits, outputs, extraInfo, useCase, imageSrc, reverse }: FormatCardProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-start ${reverse ? 'md:grid-flow-dense' : ''}`}>
      {/* Content */}
      <div className={reverse ? 'md:col-start-2' : ''}>
        <div className="inline-block px-3 py-1 rounded-full bg-empire/10 border border-empire/30 text-empire text-xs font-semibold mb-4">
          {badge}
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">{title}</h3>
        <p className="text-lg text-neutral-300 mb-6">{description}</p>
        
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
              <span className="text-neutral-200">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Outputs */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 mb-4">
          <p className="text-sm font-semibold text-blue-400 mb-3">📦 {outputs.title}</p>
          <div className="grid grid-cols-2 gap-3">
            {outputs.items.map((output: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                {output.icon}
                <span className="text-neutral-300 text-xs">{output.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extra info if exists */}
        {extraInfo && (
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-4">
            <p className="text-xs text-purple-300">
              💡 {extraInfo}
            </p>
          </div>
        )}

        <div className="p-4 rounded-lg bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
          <p className="text-sm font-semibold text-empire mb-1 flex items-center gap-2">
            <Sparkles size={14} />
            {useCase.title}
          </p>
          <p className="text-sm text-neutral-300">{useCase.text}</p>
        </div>
      </div>

      {/* Visual */}
      <div className={reverse ? 'md:col-start-1 md:row-start-1' : ''}>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <Image
            src={imageSrc}
            alt={title}
            width={3564}
            height={2430}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default function FormatsList() {
  const { t, lang } = useLanguage()
  
  const getOutputs = (type: 'long' | 'short' | 'longWithVideo') => {
    const outputsTitle = lang === 'fr' ? 'Par session vous obtenez :' : 'You get per session:'
    
    if (type === 'longWithVideo') {
      return {
        title: outputsTitle,
        items: [
          { icon: <div className="scale-75"><SocialIcons.linkedin /></div>, text: lang === 'fr' ? '7 posts' : '7 posts' },
          { icon: <div className="scale-75"><SocialIcons.video /></div>, text: lang === 'fr' ? '7 reels' : '7 reels' },
          { icon: <div className="scale-75"><SocialIcons.instagram /></div>, text: lang === 'fr' ? '7 posts' : '7 posts' },
          { icon: <div className="scale-75"><SocialIcons.newsletter /></div>, text: lang === 'fr' ? '7 newsletters' : '7 newsletters' },
          { icon: <CheckCircle2 className="text-empire" size={16} />, text: lang === 'fr' ? '1 carrousel' : '1 carousel' },
          { icon: <CheckCircle2 className="text-empire" size={16} />, text: lang === 'fr' ? '1 vidéo longue' : '1 long video' },
          { icon: <CheckCircle2 className="text-empire" size={16} />, text: lang === 'fr' ? '1 fichier MP3' : '1 MP3 file' },
        ]
      }
    }
    
    if (type === 'long') {
      return {
        title: outputsTitle,
        items: [
          { icon: <div className="scale-75"><SocialIcons.linkedin /></div>, text: lang === 'fr' ? '7 posts' : '7 posts' },
          { icon: <div className="scale-75"><SocialIcons.video /></div>, text: lang === 'fr' ? '7 reels' : '7 reels' },
          { icon: <div className="scale-75"><SocialIcons.instagram /></div>, text: lang === 'fr' ? '7 posts' : '7 posts' },
          { icon: <div className="scale-75"><SocialIcons.newsletter /></div>, text: lang === 'fr' ? '7 newsletters' : '7 newsletters' },
          { icon: <CheckCircle2 className="text-empire" size={16} />, text: lang === 'fr' ? '1 carrousel' : '1 carousel' },
        ]
      }
    }
    
    return {
      title: outputsTitle,
      items: [
        { icon: <div className="scale-75"><SocialIcons.linkedin /></div>, text: lang === 'fr' ? '1 post' : '1 post' },
        { icon: <div className="scale-75"><SocialIcons.video /></div>, text: lang === 'fr' ? '1 reel' : '1 reel' },
        { icon: <div className="scale-75"><SocialIcons.newsletter /></div>, text: lang === 'fr' ? '1 newsletter' : '1 newsletter' },
      ]
    }
  }

  const formats = [
    {
      icon: Mic,
      badge: t.formats?.formats?.[0]?.badge || 'Interview',
      title: t.formats?.formats?.[0]?.title || 'Format Interview Libre',
      description: t.formats?.formats?.[0]?.description || 'Speak naturally for 15-30 minutes like you\'re on a podcast. No preparation needed.',
      benefits: [
        t.formats?.formats?.[0]?.benefits?.[0] || 'Zero preparation required',
        t.formats?.formats?.[0]?.benefits?.[1] || 'Natural conversation flow',
        t.formats?.formats?.[0]?.benefits?.[2] || 'AI extracts the best quotes',
      ],
      outputs: getOutputs('long'),
      useCase: {
        title: lang === 'fr' ? '✨ Parfait pour :' : '✨ Perfect for:',
        text: t.formats?.formats?.[0]?.useCase || 'Storytelling, sharing experience, thought leadership'
      },
      imageSrc: 'https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd17418ba_1.png',
    },
    {
      icon: Target,
      badge: t.formats?.formats?.[1]?.badge || 'Structured',
      title: t.formats?.formats?.[1]?.title || 'Format Interview à Thème',
      description: t.formats?.formats?.[1]?.description || 'Answer pre-written questions. We guide you through specific topics.',
      benefits: [
        t.formats?.formats?.[1]?.benefits?.[0] || 'Structured approach',
        t.formats?.formats?.[1]?.benefits?.[1] || 'Cover all key points',
        t.formats?.formats?.[1]?.benefits?.[2] || 'Perfect for complex topics',
      ],
      outputs: getOutputs('long'),
      extraInfo: lang === 'fr'
        ? 'Donnez-nous des transcripts YouTube ou liens Instagram viraux, l\'IA réécrit le contenu pour surfer sur les tendances'
        : 'Give us YouTube transcripts or viral Instagram links, AI rewrites the content to ride the trends',
      useCase: {
        title: lang === 'fr' ? 'Parfait pour :' : 'Perfect for:',
        text: t.formats?.formats?.[1]?.useCase || 'Educational content, tutorials, deep-dives'
      },
      imageSrc: 'https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd29b3084_2.png',
      reverse: true,
    },
    {
      icon: FileText,
      badge: t.formats?.formats?.[2]?.badge || 'Notes',
      title: t.formats?.formats?.[2]?.title || 'Format Improvisation Bulletpoint',
      description: t.formats?.formats?.[2]?.description || 'Follow your notes, improvise the rest. Perfect for organized minds.',
      benefits: [
        t.formats?.formats?.[2]?.benefits?.[0] || 'Use your existing notes',
        t.formats?.formats?.[2]?.benefits?.[1] || 'Stay on track',
        t.formats?.formats?.[2]?.benefits?.[2] || 'Natural delivery',
      ],
      outputs: getOutputs('longWithVideo'),
      extraInfo: lang === 'fr'
        ? 'Ajoutez une vidéo virale longue, l\'IA réécrit le contenu, vous le relisez. Ou faites le vôtre.'
        : 'Add a long viral video, AI rewrites the content, you read it. Or do your own.',
      useCase: {
        title: lang === 'fr' ? 'Parfait pour :' : 'Perfect for:',
        text: t.formats?.formats?.[2]?.useCase || 'Process explanations, frameworks, step-by-step guides'
      },
      imageSrc: 'https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd3a34b27_3.png',
    },
    {
      icon: MonitorPlay,
      badge: t.formats?.formats?.[3]?.badge || 'Screen',
      title: t.formats?.formats?.[3]?.title || 'Format Improvisation Screenrecording',
      description: t.formats?.formats?.[3]?.description || 'Show and explain. Record your screen while you walk through anything.',
      benefits: [
        t.formats?.formats?.[3]?.benefits?.[0] || 'Visual demonstrations',
        t.formats?.formats?.[3]?.benefits?.[1] || 'Live walk-throughs',
        t.formats?.formats?.[3]?.benefits?.[2] || 'Software/tool explanations',
      ],
      outputs: getOutputs('longWithVideo'),
      extraInfo: lang === 'fr'
        ? 'Ajoutez une vidéo virale longue, l\'IA réécrit le contenu, vous le relisez. Ou faites le vôtre.'
        : 'Add a long viral video, AI rewrites the content, you read it. Or do your own.',
      useCase: {
        title: lang === 'fr' ? 'Parfait pour :' : 'Perfect for:',
        text: t.formats?.formats?.[3]?.useCase || 'Tutorials, software demos, case studies'
      },
      imageSrc: 'https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd49b76df_4.png',
      reverse: true,
    },
    {
      icon: Copy,
      badge: t.formats?.formats?.[4]?.badge || 'Proven',
      title: t.formats?.formats?.[4]?.title || 'Format Copier Scripts de Reels',
      description: t.formats?.formats?.[4]?.description || 'Copy viral scripts that work. Adapt them to your niche. We transform them.',
      benefits: [
        t.formats?.formats?.[4]?.benefits?.[0] || 'Proven viral formats',
        t.formats?.formats?.[4]?.benefits?.[1] || 'Adapted to your voice',
        t.formats?.formats?.[4]?.benefits?.[2] || 'Fast content creation',
      ],
      outputs: getOutputs('short'),
      extraInfo: lang === 'fr'
        ? 'Donnez un lien reel/vidéo virale, l\'IA réécrit le script, vous le lisez, on monte tout automatiquement'
        : 'Give a reel/viral video link, AI rewrites the script, you read it, we edit everything automatically',
      useCase: {
        title: lang === 'fr' ? 'Parfait pour :' : 'Perfect for:',
        text: t.formats?.formats?.[4]?.useCase || 'Quick wins, trending content, engagement boosters'
      },
      imageSrc: 'https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd5b662e5_5.png',
    },
    {
      icon: Lightbulb,
      badge: t.formats?.formats?.[5]?.badge || 'Inspired',
      title: t.formats?.formats?.[5]?.title || 'Format Inspirations Reels',
      description: t.formats?.formats?.[5]?.description || 'Send us videos you like. We edit them for you and rewrite the scripts with your voice.',
      benefits: [
        t.formats?.formats?.[5]?.benefits?.[0] || 'We do the editing for you',
        t.formats?.formats?.[5]?.benefits?.[1] || 'Scripts rewritten in your style',
        t.formats?.formats?.[5]?.benefits?.[2] || 'Fast turnaround',
      ],
      outputs: getOutputs('short'),
      extraInfo: lang === 'fr'
        ? 'Donnez un lien reel/vidéo, l\'IA réécrit le script à votre façon, vous lisez, on monte'
        : 'Give a reel/video link, AI rewrites script your way, you read it, we edit',
      useCase: {
        title: lang === 'fr' ? 'Parfait pour :' : 'Perfect for:',
        text: t.formats?.formats?.[5]?.useCase || 'Trending content, viral formats, quick content creation'
      },
      imageSrc: 'https://d1yei2z3i6k35z.cloudfront.net/3647172/6909dd68e1cdd_6.png',
      reverse: true,
    },
  ]

  return (
    <section className="container section-spacing">
      <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
        {formats.map((format, i) => (
          <FadeInBlock key={i} delay={i * 0.1}>
            <FormatCard {...format} />
          </FadeInBlock>
        ))}
      </div>
    </section>
  )
}

