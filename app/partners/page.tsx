'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  DollarSign, 
  Gift, 
  Rocket, 
  Trophy, 
  Wrench, 
  TrendingUp, 
  Lightbulb, 
  Award,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Mail,
  MessageSquare,
  Video,
  FileText,
  Play,
  Phone
} from 'lucide-react'

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

const benefits = [
  {
    icon: DollarSign,
    title: 'Revenu Récurrent',
    titleEn: 'Recurring Revenue',
    description: 'Commission de 10% — tant que le client reste abonné. Revenu prévisible, non lié au temps travaillé.',
    descriptionEn: '10% commission — as long as the client stays subscribed. Predictable income, not tied to hours worked.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Gift,
    title: 'Avantage Exclusif Clients',
    titleEn: 'Exclusive Client Benefit',
    description: '-500€/mois de remise pour vos clients. Vous devenez "l\'accès privilégié". Vos clients vous voient comme le héros.',
    descriptionEn: '€500/month discount for your clients. You become "the exclusive access". Your clients see you as the hero.',
    color: 'text-empire',
    bgColor: 'bg-empire/10',
  },
  {
    icon: Rocket,
    title: 'Augmentez Votre Valeur',
    titleEn: 'Increase Your Value',
    description: 'Votre service devient plus complet (stratégie + machine à contenu). Retenez vos clients plus longtemps. Augmentez vos prix.',
    descriptionEn: 'Your service becomes more complete (strategy + content machine). Retain clients longer. Increase your prices.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Trophy,
    title: 'Autorité & Crédibilité',
    titleEn: 'Authority & Credibility',
    description: '"On travaille avec Empire Internet." Positionnement : partenaire stratégique, pas simple prestataire.',
    descriptionEn: '"We work with Empire Internet." Positioning: strategic partner, not just a vendor.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Wrench,
    title: 'Zéro Charge Opérationnelle',
    titleEn: 'Zero Operational Load',
    description: 'On close. On produit. On supporte. Vous recommandez — et c\'est tout.',
    descriptionEn: 'We close. We produce. We support. You recommend — that\'s it.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Croissance Scalable',
    titleEn: 'Scalable Growth',
    description: 'Pas besoin de recruter une équipe contenu. Pas d\'outils complexes. Un nouveau flux de revenus simple.',
    descriptionEn: 'No need to hire a content team. No complex tools. A simple new revenue stream.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Opportunités d\'Upsell',
    titleEn: 'Upsell Opportunities',
    description: 'Grâce au contenu généré : coaching, consulting, stratégie marketing, accompagnements premium.',
    descriptionEn: 'Thanks to the content generated: coaching, consulting, marketing strategy, premium support.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Award,
    title: 'Programme Partenaire',
    titleEn: 'Partner Program',
    description: 'Tableau de bord commissions, support prioritaire, ressources prêtes, bonus par paliers, webinaires privés.',
    descriptionEn: 'Commission dashboard, priority support, ready resources, tier bonuses, private webinars.',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
]

const partnerResources = [
  { icon: FileText, name: 'Scripts de vente', nameEn: 'Sales scripts' },
  { icon: Mail, name: 'Emails prêts à envoyer', nameEn: 'Ready-to-send emails' },
  { icon: MessageSquare, name: 'Messages DM', nameEn: 'DM messages' },
  { icon: Video, name: 'Vidéos de démonstration', nameEn: 'Demo videos' },
]

export default function PartnersPage() {
  const { lang } = useLanguage()
  
  // Charger le script Systeme.io pour le popup
  useEffect(() => {
    // Vérifier si le script existe déjà
    if (document.getElementById('form-script-tag-5606340')) return
    
    // Créer et ajouter le script
    const script = document.createElement('script')
    script.id = 'form-script-tag-5606340'
    script.src = 'https://www.join.empire-internet.com/public/remote/page/335981536ebd00244294d1b1d2e7ef2cee0ed0dc.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      // Cleanup si nécessaire
      const existingScript = document.getElementById('form-script-tag-5606340')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  const whatsappLink = 'https://wa.me/33665427470'
  const loomDemoUrl = 'https://www.loom.com/share/90e64db2f5454c94b50b1c8cdbcbcc11'
  const loomEmbedUrl = 'https://www.loom.com/embed/90e64db2f5454c94b50b1c8cdbcbcc11'

  return (
    <main className="relative min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.1),transparent)]" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInBlock>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/10 border border-empire/30 mb-6">
                <Users className="text-empire" size={16} />
                <span className="text-sm font-bold text-empire">
                  {lang === 'fr' ? 'PROGRAMME PARTENAIRE' : 'PARTNER PROGRAM'}
                </span>
              </div>
            </FadeInBlock>
            
            <FadeInBlock delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                {lang === 'fr' ? (
                  <>Gagnez <span className="text-empire">10%</span> de commission récurrente</>
                ) : (
                  <>Earn <span className="text-empire">10%</span> recurring commission</>
                )}
              </h1>
            </FadeInBlock>
            
            <FadeInBlock delay={0.2}>
              <p className="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto">
                {lang === 'fr' 
                  ? 'Recommandez Empire Internet à vos clients et partenaires. Gagnez des commissions tant qu\'ils restent abonnés — sans travail supplémentaire.'
                  : 'Recommend Empire Internet to your clients and partners. Earn commissions as long as they stay subscribed — no extra work.'}
              </p>
            </FadeInBlock>
            
            <FadeInBlock delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  className="systeme-show-popup-5606340 px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  {lang === 'fr' ? 'Obtenir mon lien' : 'Get my sharable link'} <ArrowRight size={20} />
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-2"
                >
                  <Phone size={18} />
                  WhatsApp
                </a>
              </div>
            </FadeInBlock>
            
            {/* Trust badges */}
            <FadeInBlock delay={0.4}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Shield className="text-green-400" size={16} />
                  <span>{lang === 'fr' ? 'Cookie 180 jours' : '180-day cookie'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="text-empire" size={16} />
                  <span>{lang === 'fr' ? 'Paiement mensuel' : 'Monthly payouts'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={16} />
                  <span>{lang === 'fr' ? 'Ressources gratuites' : 'Free resources'}</span>
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="container py-16">
        <FadeInBlock>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold mb-4">
                <Play size={14} />
                {lang === 'fr' ? 'DÉMO PRODUIT' : 'PRODUCT DEMO'}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {lang === 'fr' ? 'Découvrez Empire Internet en Action' : 'See Empire Internet in Action'}
              </h2>
              <p className="text-neutral-400">
                {lang === 'fr' ? 'Regardez comment fonctionne notre machine à contenu' : 'Watch how our content machine works'}
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={loomEmbedUrl}
                  frameBorder="0"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <a
                href={loomDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 hover:text-empire transition-colors"
              >
                {lang === 'fr' ? 'Ouvrir dans Loom →' : 'Open in Loom →'}
              </a>
            </div>
          </div>
        </FadeInBlock>
      </section>


      {/* Benefits Grid */}
      <section className="container py-20">
        <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {lang === 'fr' ? 'Pourquoi Devenir Partenaire ?' : 'Why Become a Partner?'}
            </h2>
            <p className="text-xl text-neutral-300">
              {lang === 'fr' ? 'Bien plus que des commissions' : 'Much more than commissions'}
            </p>
          </div>
        </FadeInBlock>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <FadeInBlock key={benefit.title} delay={0.05 * i}>
              <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all group">
                <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className={benefit.color} size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {lang === 'fr' ? benefit.title : benefit.titleEn}
                </h3>
                <p className="text-sm text-neutral-400">
                  {lang === 'fr' ? benefit.description : benefit.descriptionEn}
                </p>
              </div>
            </FadeInBlock>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {lang === 'fr' ? 'Comment Ça Marche ?' : 'How Does It Work?'}
            </h2>
          </div>
        </FadeInBlock>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-empire/50 to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: lang === 'fr' ? 'Inscrivez-vous' : 'Sign Up',
                  desc: lang === 'fr' ? 'Remplissez le formulaire. Recevez vos liens affiliés.' : 'Fill out the form. Receive your affiliate links.',
                },
                {
                  step: '2',
                  title: lang === 'fr' ? 'Partagez' : 'Share',
                  desc: lang === 'fr' ? 'Emails, DMs, YouTube, LinkedIn, newsletters... où vous voulez.' : 'Emails, DMs, YouTube, LinkedIn, newsletters... wherever you want.',
                },
                {
                  step: '3',
                  title: lang === 'fr' ? 'Gagnez' : 'Earn',
                  desc: lang === 'fr' ? 'Cookie 180 jours. Commission versée chaque mois.' : '180-day cookie. Commission paid monthly.',
                },
              ].map((item, i) => (
                <FadeInBlock key={item.step} delay={0.1 * i}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-empire to-empire/60 border-4 border-black shadow-[0_0_30px_rgba(218,252,104,0.3)] flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-black font-black text-2xl">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-400">{item.desc}</p>
                  </div>
                </FadeInBlock>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Resources */}
      <section className="container py-20">
        <FadeInBlock>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {lang === 'fr' ? 'Ressources Partenaire' : 'Partner Resources'}
              </h2>
              <p className="text-neutral-300">
                {lang === 'fr' ? 'Tout ce qu\'il vous faut pour promouvoir Empire' : 'Everything you need to promote Empire'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {partnerResources.map((resource, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <resource.icon className="text-empire mx-auto mb-2" size={24} />
                  <p className="text-sm font-semibold text-white">
                    {lang === 'fr' ? resource.name : resource.nameEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeInBlock>
      </section>

      {/* Final CTA */}
      <section className="container py-20">
        <FadeInBlock>
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(218,252,104,0.1),transparent)] animate-pulse" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                {lang === 'fr' ? 'Prêt à Rejoindre le Programme ?' : 'Ready to Join the Program?'}
              </h2>
              <p className="text-lg text-neutral-300 mb-8">
                {lang === 'fr' 
                  ? 'Inscrivez-vous maintenant et recevez vos liens affiliés + ressources.'
                  : 'Sign up now and receive your affiliate links + resources.'}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  className="systeme-show-popup-5606340 px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <Users size={20} />
                  {lang === 'fr' ? 'Obtenir mon lien' : 'Get my sharable link'}
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-2"
                >
                  <Phone size={18} />
                  WhatsApp
                </a>
              </div>
              
              <p className="mt-6 text-sm text-neutral-400">
                {lang === 'fr' 
                  ? '✓ Inscription gratuite · ✓ Commissions récurrentes · ✓ Ressources offertes'
                  : '✓ Free signup · ✓ Recurring commissions · ✓ Free resources'}
              </p>
            </div>
          </div>
        </FadeInBlock>
      </section>
    </main>
  )
}
