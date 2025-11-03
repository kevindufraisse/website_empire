'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function VidalyticsPlayer() {
  const { lang } = useLanguage()
  
  // IDs différents pour EN et FR
  const videoIds = {
    en: {
      embedId: 'vidalytics_embed_8p1SsPHAYkWadRPI',
      videoId: '8p1SsPHAYkWadRPI',
    },
    fr: {
      embedId: 'vidalytics_embed_PHRjqrj4u4nDqnAq',
      videoId: 'PHRjqrj4u4nDqnAq',
    }
  }

  const currentVideo = videoIds[lang]

  useEffect(() => {
    // Nettoyer l'ancien player si existe
    const oldContainer = document.getElementById(videoIds.en.embedId)
    const oldContainerFr = document.getElementById(videoIds.fr.embedId)
    if (oldContainer) oldContainer.innerHTML = ''
    if (oldContainerFr) oldContainerFr.innerHTML = ''

    // Charger le script Vidalytics
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
  }, [lang, currentVideo.embedId, currentVideo.videoId])

  return (
    <div 
      id={currentVideo.embedId}
      style={{ width: '100%', position: 'relative', paddingTop: '56.25%' }}
    />
  )
}


