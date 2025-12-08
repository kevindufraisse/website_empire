'use client'
import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CalCalendar() {
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const namespace = lang === 'fr' ? 'empire-request-fr' : 'empire-request'
    const containerId = lang === 'fr' ? 'my-cal-inline-empire-request-fr' : 'my-cal-inline-empire-request'
    const calLink = lang === 'fr' ? 'kevin-dufraisse-private/empire-request-fr' : 'kevin-dufraisse-private/empire-request'

    // Nettoyer le conteneur
    containerRef.current.innerHTML = `<div style="width:100%;height:100%;overflow:scroll" id="${containerId}"></div>`

    // Créer le script avec le code exact fourni par Cal.com
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
    `

    return () => {
      // Cleanup si nécessaire
    }
  }, [lang])

  return (
    <div className="w-full min-h-[600px]" style={{ maxWidth: '100%' }}>
      <div ref={containerRef} className="w-full min-h-[600px]" />
    </div>
  )
}
