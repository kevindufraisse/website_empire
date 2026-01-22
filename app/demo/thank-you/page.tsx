'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { CheckCircle2, MessageCircle, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DemoThankYouPage() {
  const { lang } = useLanguage()
  
  // Facebook Pixel tracking - fire Schedule event on page load
  useEffect(() => {
    // Via GTM dataLayer
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'event': 'cal_booking_confirmed'
      });
      
      // Direct fbq call
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Schedule');
        console.log('Facebook Pixel: Schedule event fired on thank-you page');
      }
    }
  }, [])

  // Vidalytics video IDs
  const videoIds = {
    en: {
      embedId: 'vidalytics_embed_eC6wQ0IBC0XGwMad',
      videoId: 'eC6wQ0IBC0XGwMad',
    },
    fr: {
      embedId: 'vidalytics_embed_3Gl33E2MRH9oof9_',
      videoId: '3Gl33E2MRH9oof9_',
    }
  }

  const currentVideo = videoIds[lang]

  // Load Vidalytics script
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      (function (v, i, d, a, l, y, t, c, s) {
        y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
        if (!vsl){vsl=function(u,cb){
          if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
          if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
          i.getElementsByTagName("head")[0].appendChild(s);
        };}
        vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
      })(window, document, 'Vidalytics', '${currentVideo.embedId}', 'https://fast.vidalytics.com/embeds/ydq0TH7p/${currentVideo.videoId}/');
    `
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [currentVideo.embedId, currentVideo.videoId])
  
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />
      
      <div className="container py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-empire/20 border-4 border-empire flex items-center justify-center mx-auto mb-4 shadow-[0_0_50px_rgba(218,252,104,0.3)]"
            >
              <CheckCircle2 className="text-empire" size={40} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
            >
              {lang === 'fr' ? 'Rendez-vous confirmé !' : 'Appointment confirmed!'}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-neutral-300"
            >
              {lang === 'fr' 
                ? 'En attendant, découvrez comment Empire fonctionne 👇'
                : 'In the meantime, discover how Empire works 👇'}
            </motion.p>
          </div>

          {/* Video Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <div 
                id={currentVideo.embedId}
                style={{ width: '100%', position: 'relative', paddingTop: '64.86%' }}
              />
            </div>
          </motion.div>

          {/* WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-neutral-400 mb-4">
              {lang === 'fr' ? 'Des questions avant le rendez-vous ?' : 'Questions before the meeting?'}
            </p>
            <a
              href="https://wa.me/33665427470"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold group-hover:text-[#25D366] transition-colors">
                  {lang === 'fr' ? 'Contactez-nous sur WhatsApp' : 'Contact us on WhatsApp'}
                </p>
                <p className="text-sm text-neutral-400">+33 6 65 42 74 70</p>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
