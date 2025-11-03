'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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

// FAQ sera chargée depuis les traductions
const getFAQs = (t: any) => t.faqItems || [
  {
    question: 'How do I get started?',
    answer: 'Two ways: 1) Join our live Q&A session (Tuesday 1PM or Thursday 1PM CET) to see everything and ask questions, OR 2) Skip the demo and start immediately at join.empire-internet.com/bdc-empire. Either way, your first content is ready in 7 days.',
  },
  {
    question: 'How much time do I need to invest?',
    answer: 'Just 15 minutes per week for the interview call. That\'s it. We handle everything else — content creation, editing, scheduling, and distribution across all platforms.',
  },
  {
    question: 'What if the content doesn\'t sound like me?',
    answer: 'We train custom AI prompts on your unique tone, voice, and style. Plus, a real human reviews and polishes every piece before it goes live. If something feels off, we revise it until it\'s perfect.',
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Your first batch of content is ready within 7 days of your first interview. Most clients see their first engagement spike within 2 weeks, and significant growth by month 2-3.',
  },
  {
    question: 'What makes this different from hiring a content agency?',
    answer: 'Speed, cost, and quality. Agencies cost €5K-15K/month, take weeks to deliver, and often miss your voice. We deliver 30+ pieces in 7 days for €1K/month, with human QA on everything.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. No long-term contract. You can cancel with 30 days notice. But most clients stay because they see the results and love getting their time back.',
  },
  {
    question: 'Why no free trial or money-back guarantee?',
    answer: 'We have a real team working on your content from day 1 — writers, editors, QA specialists. A free trial would mean they work for free, which isn\'t sustainable. Instead, we offer weekly payment (test for 1 week) and cancel anytime. You see the quality immediately without long-term commitment.',
  },
  {
    question: 'What platforms do you publish to?',
    answer: 'We cover all major platforms: LinkedIn, YouTube, Instagram, Twitter/X, Threads, and email newsletters. You can choose which ones you want to focus on.',
  },
  {
    question: 'Why are there only a few testimonials?',
    answer: 'Empire Internet launched less than 2 months ago. We\'re intentionally keeping it small — maximum 100 clients total — to maintain quality and personal attention. Current clients are already seeing results, and we\'re collecting testimonials as we grow.',
  },
  {
    question: 'Do I need to be on camera or have video equipment?',
    answer: 'No camera needed for the interview. We record the audio and create video content using b-roll, stock footage, and professional editing. You just need to talk.',
  },
  {
    question: 'Do you write in languages other than English?',
    answer: 'Yes! With the API bonus, you get auto-translation to 10+ languages including French, Spanish, German, and more. Perfect for expanding your international reach.',
  },
  {
    question: 'Is the AI Setter included or extra?',
    answer: 'It\'s included as a bonus (€800/mo value). The AI engages with prospects on LinkedIn, qualifies leads, and hands them off to you when they\'re ready to talk.',
  },
]

export default function FAQSection() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const faqs = getFAQs(t)

  return (
    <section id="faq" className="relative w-full py-20 md:py-32 bg-gradient-to-b from-black via-[#0f0f0f] to-black overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Title */}
          <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t.faq.title}
            </h2>
            <p className="text-xl text-neutral-300">
              {t.faq.subtitle}
            </p>
          </div>
          </FadeInBlock>

          {/* FAQ Accordion */}
          <FadeInBlock delay={0.1}>
            <div className="space-y-3">
              {faqs.map((faq: any, index: number) => {
                const isOpen = openIndex === index

                return (
                  <div
                    key={index}
                    className={cn(
                      'rounded-xl border transition-all overflow-hidden',
                      isOpen
                        ? 'bg-gradient-to-br from-white/10 to-white/[0.02] border-empire/30'
                        : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                    )}
                  >
                    {/* Question */}
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left group"
                    >
                      <h3 className={cn(
                        'text-lg font-semibold transition-colors',
                        isOpen ? 'text-empire' : 'text-white group-hover:text-empire'
                      )}>
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={cn(
                          'text-neutral-400 transition-all duration-300 flex-shrink-0',
                          isOpen ? 'rotate-180 text-empire' : 'group-hover:text-empire'
                        )}
                        size={20}
                      />
                    </button>

                    {/* Answer */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? 'auto' : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-white/10">
                        <p className="text-neutral-300 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}

