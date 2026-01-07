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

// FAQ selon le variant (contextuelles)
const getFAQs = (t: any, variant: string = 'all') => {
  const allFAQs = t.faqItems || []
  
  // FAQ HOME : Top questions essentielles + nouvelles FAQs spécifiques
  const homeFAQs = [
    t.faq?.specific?.howManyPosts, // Nouvelle FAQ spécifique
    allFAQs[0], // How do I get started?
    allFAQs[1], // How much time do I need to invest?
    allFAQs[2], // What if the content doesn't sound like me?
    t.faq?.specific?.whatIfDontLike, // Nouvelle FAQ spécifique
    allFAQs[3], // How quickly will I see results?
    allFAQs[4], // What makes this different from hiring an agency?
    allFAQs[5], // Can I cancel anytime?
  ].filter(Boolean)
  
  // FAQ PRICING : Questions sur prix/achat + nouvelles FAQs spécifiques
  const pricingFAQs = [
    t.faq?.specific?.howManyPosts, // Nouvelle FAQ spécifique
    allFAQs[5], // Can I cancel anytime?
    allFAQs[6], // Why no free trial or money-back guarantee?
    allFAQs[4], // What makes this different from hiring an agency?
    t.faq?.specific?.canRequestChanges, // Nouvelle FAQ spécifique
    allFAQs[7], // What platforms do you publish to?
    allFAQs[8], // Why are there only a few testimonials?
    allFAQs[11], // Is the AI Setter included or extra?
  ].filter(Boolean)
  
  // FAQ FORMATS : Questions sur les méthodes d'enregistrement
  const formatsFAQs = [
    { 
      question: t.faqFormats?.q1?.question || 'Which format should I choose?',
      answer: t.faqFormats?.q1?.answer || 'There\'s no wrong choice. Most clients start with Free-Flow Interview (easiest, no prep) or Themed Interview (more structured). You can switch formats anytime or mix them.'
    },
    { 
      question: t.faqFormats?.q2?.question || 'Can I mix different formats?',
      answer: t.faqFormats?.q2?.answer || 'Absolutely! You can do a Free-Flow Interview one week, then a Screenrecording the next. Flexibility is key.'
    },
    { 
      question: t.faqFormats?.q3?.question || 'Do I need to prepare anything?',
      answer: t.faqFormats?.q3?.answer || 'For Free-Flow Interview: Zero prep. For Themed Interview: We send questions beforehand. For Bulletpoint: Just your notes. For Screenrecording: Have your screen ready.'
    },
    { 
      question: t.faqFormats?.q4?.question || 'What if I\'m camera shy?',
      answer: t.faqFormats?.q4?.answer || 'Perfect! Most formats don\'t require camera. We use audio-only interviews, screenrecordings, or just your voice. No face required.'
    },
    { 
      question: t.faqFormats?.q5?.question || 'Can I use my existing content?',
      answer: t.faqFormats?.q5?.answer || 'Yes! With the API format, you can upload existing videos, podcasts, or documents and we\'ll transform them into multi-platform content.'
    },
    allFAQs[1], // How much time do I need to invest?
  ].filter(Boolean)
  
  // Retourner selon le variant
  if (variant === 'home') return homeFAQs
  if (variant === 'pricing') return pricingFAQs
  if (variant === 'formats') return formatsFAQs
  
  return allFAQs
}

const getFAQsOld = (t: any) => t.faqItems || [
  {
    question: 'How do I get started?',
    answer: 'Book a one-to-one meeting to discover everything and choose the plan that fits you best. Your first content is ready within 24 hours of your interview.',
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
    answer: 'Your first batch of content is ready within 24-48 hours of your first interview. Most clients see their first engagement spike within 2 weeks, and significant growth by month 2-3.',
  },
  {
    question: 'What makes this different from hiring a content agency?',
    answer: 'Speed, cost, and quality. Agencies cost €5K-15K/month, take weeks to deliver, and often miss your voice. Empire delivers 132 pieces/month with human QA on everything.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. No long-term contract. You can cancel with 30 days notice. But most clients stay because they see the results and love getting their time back.',
  },
  {
    question: 'Why no free trial or money-back guarantee?',
    answer: 'We have a real team working on your content from day 1 — writers, editors, QA specialists. A free trial would mean they work for free, which isn\'t sustainable. Instead, we offer monthly payment and cancel anytime. You see the quality immediately without long-term commitment.',
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

export default function FAQSection({ variant = 'all' }: { variant?: 'all' | 'home' | 'pricing' | 'formats' }) {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const faqs = getFAQs(t, variant)

  return (
    <section id="faq" className="relative w-full py-12 md:py-32 bg-gradient-to-b from-black via-[#0f0f0f] to-black overflow-hidden">
      <div className="container">
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Title */}
          <FadeInBlock>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.faq.title}
            </h2>
            <p className="text-base md:text-xl text-neutral-300">
              {t.faq.subtitle}
            </p>
          </div>
          </FadeInBlock>

          {/* FAQ Accordion */}
          <FadeInBlock delay={0.1}>
            <div className="space-y-2 md:space-y-3">
              {faqs.map((faq: any, index: number) => {
                const isOpen = openIndex === index

                return (
                  <div
                    key={index}
                    className={cn(
                      'rounded-lg md:rounded-xl border transition-all overflow-hidden',
                      isOpen
                        ? 'bg-gradient-to-br from-white/10 to-white/[0.02] border-empire/30'
                        : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                    )}
                  >
                    {/* Question */}
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full p-4 md:p-5 flex items-center justify-between text-left group min-h-[44px]"
                    >
                      <h3 className={cn(
                        'text-base md:text-lg font-semibold transition-colors pr-2',
                        isOpen ? 'text-empire' : 'text-white group-hover:text-empire'
                      )}>
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={cn(
                          'text-neutral-400 transition-all duration-300 flex-shrink-0',
                          isOpen ? 'rotate-180 text-empire' : 'group-hover:text-empire'
                        )}
                        size={18}
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
                      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 border-t border-white/10">
                        <p className="text-sm md:text-base text-neutral-300 leading-relaxed pt-3 md:pt-4">
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

