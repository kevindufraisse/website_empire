'use client'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CalCalendar() {
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const namespace = 'empire-demo'
    const containerId = 'my-cal-inline-empire-demo'
    const calLink = 'jules-bernard-g7tpow/empire-demo'

    // Nettoyer le conteneur
    containerRef.current.innerHTML = `<div style="width:100%;height:100%;overflow:scroll" id="${containerId}"></div>`

    // Attendre un peu avant de charger le script
    const timer = setTimeout(() => {
      const scriptId = `cal-script-${namespace}`
      let script = document.getElementById(scriptId) as HTMLScriptElement
      
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.type = 'text/javascript'
        document.head.appendChild(script)
      }

      script.innerHTML = `
        (function (C, A, L) { 
          let p = function (a, ar) { a.q.push(ar); }; 
          let d = C.document; 
          C.Cal = C.Cal || function () { 
            let cal = C.Cal; 
            let ar = arguments; 
            if (!cal.loaded) { 
              cal.ns = {}; 
              cal.q = cal.q || []; 
              d.head.appendChild(d.createElement("script")).src = A; 
              cal.loaded = true; 
            } 
            if (ar[0] === L) { 
              const api = function () { p(api, arguments); }; 
              const namespace = ar[1]; 
              api.q = api.q || []; 
              if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); 
              return;
            } 
            p(cal, ar); 
          }; 
        })(window, "https://app.cal.com/embed/embed.js", "init");
        
        Cal("init", "${namespace}", {origin:"https://app.cal.com"});
        
        Cal.ns["${namespace}"]("inline", {
          elementOrSelector:"#${containerId}",
          config: {"layout":"month_view","theme":"light"},
          calLink: "${calLink}",
        });
        
        ${lang === 'fr' 
          ? `Cal.ns["${namespace}"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});`
          : `Cal.ns["${namespace}"]("ui", {"theme":"light","cssVarsPerTheme":{"light":{"cal-brand":"#dafc68"},"dark":{"cal-brand":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});`
        }
        
        // Redirect to thank-you page after booking (for reliable tracking)
        Cal.ns["${namespace}"]("on", {
          action: "bookingSuccessful",
          callback: function(e) {
            console.log('Cal.com booking successful!', e);
            // Redirect to thank-you page where FB Pixel will fire
            window.location.href = '/demo/thank-you';
          }
        });
      `

      // Attendre que le calendrier soit chargé
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [lang])

  return (
    <div className="w-full min-h-[500px] md:min-h-[600px] relative" style={{ maxWidth: '100%' }}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 rounded-xl backdrop-blur-sm z-10">
          {/* Skeleton calendar */}
          <div className="w-full max-w-md px-6 mb-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
            {/* Days skeleton */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
            {/* Calendar grid skeleton */}
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-10 bg-white/5 rounded animate-pulse"
                  style={{ animationDelay: `${i * 20}ms` }}
                />
              ))}
            </div>
          </div>
          {/* Loading text */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-empire/30 border-t-empire rounded-full animate-spin" />
            <p className="text-neutral-400 text-sm">
              {lang === 'fr' ? 'Chargement du calendrier...' : 'Loading calendar...'}
            </p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full min-h-[500px] md:min-h-[600px]" />
    </div>
  )
}
