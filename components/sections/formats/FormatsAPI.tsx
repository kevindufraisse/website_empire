'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Code, Zap, Workflow, CheckCircle2 } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'

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

export default function FormatsAPI() {
  const { t } = useLanguage()

  const apiFeatures = [
    { icon: Zap, text: t.formats?.api?.features?.[0] || 'Connect your tools (Notion, Airtable, Google Drive)' },
    { icon: Workflow, text: t.formats?.api?.features?.[1] || 'Automate content workflows' },
    { icon: Code, text: t.formats?.api?.features?.[2] || 'Custom integrations available' },
  ]

  return (
    <section className="container section-spacing">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 p-8 md:p-16">
            <BorderBeam size={300} duration={12} delay={0} />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-empire/10 border border-empire/30 text-empire text-xs font-semibold mb-4">
                    {t.formats?.api?.badge || 'Advanced'}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    {t.formats?.api?.title || 'API & Automations'}
                  </h2>
                  <p className="text-lg text-neutral-300 mb-8">
                    {t.formats?.api?.description || 'For power users: Connect Empire to your existing workflows. Automate everything.'}
                  </p>

                  <div className="space-y-4 mb-8">
                    {apiFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-empire/10 border border-empire/30 flex items-center justify-center flex-shrink-0">
                          <feature.icon className="text-empire" size={20} />
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-neutral-200">{feature.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-empire/20 to-empire/5 border border-empire/30">
                    <p className="text-sm font-semibold text-empire mb-2">
                      ⚡ {t.formats?.api?.example?.title || 'Example:'}
                    </p>
                    <p className="text-sm text-neutral-300">
                      {t.formats?.api?.example?.text || 'Upload to Dropbox → Empire processes → Content published to all platforms → Notifications sent to Slack'}
                    </p>
                  </div>
                </div>

                {/* Right: Visual Placeholder */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-empire/5 to-transparent p-8">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <Code className="mx-auto mb-4 text-empire" size={80} />
                      <p className="text-sm text-neutral-500 font-mono">api-workflow-diagram.png</p>
                      <p className="text-xs text-neutral-600 mt-2">API flowchart visual here</p>
                      <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-3 h-3 rounded-full bg-empire/30" />
                          <span>Notion → Empire</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-3 h-3 rounded-full bg-empire/50" />
                          <span>Empire → LinkedIn, YouTube</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <div className="w-3 h-3 rounded-full bg-empire/70" />
                          <span>Slack notifications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

