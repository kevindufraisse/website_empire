'use client'
import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

declare global {
  interface Window {
    Cal?: any
  }
}

export default function CalFloatingButton() {
  const { lang } = useLanguage()

  useEffect(() => {
    const namespace = lang === 'fr' ? 'empire-request-fr' : 'empire-request'
    const scriptId = `cal-floating-script-${namespace}`

    // Fonction pour initialiser le bouton flottant
    const initFloatingButton = () => {
      // Supprimer l'ancien script s'il existe
      const oldScript = document.getElementById(scriptId)
      if (oldScript) {
        oldScript.remove()
      }

      // Vérifier si Cal.com est déjà chargé
      const checkCalLoaded = () => {
        if (window.Cal && window.Cal.ns && window.Cal.ns[namespace]) {
          // Le namespace existe déjà, utiliser directement
          try {
            if (lang === 'fr') {
              window.Cal.ns[namespace]('floatingButton', {
                calLink: 'kevin-dufraisse-private/empire-request-fr',
                config: { layout: 'month_view', theme: 'auto' },
                buttonColor: '#dafc68',
                buttonTextColor: '#000000',
                hideButtonIcon: false,
                buttonPosition: 'bottom-right'
              })
              window.Cal.ns[namespace]('ui', {
                hideEventTypeDetails: false,
                layout: 'month_view',
              })
            } else {
              window.Cal.ns[namespace]('floatingButton', {
                calLink: 'kevin-dufraisse-private/empire-request',
                config: { layout: 'month_view' },
                buttonColor: '#dafc68',
                buttonTextColor: '#000000',
                hideButtonIcon: false,
                buttonPosition: 'bottom-right'
              })
              window.Cal.ns[namespace]('ui', {
                hideEventTypeDetails: false,
                layout: 'month_view',
              })
            }
          } catch (e) {
            console.log('Cal.com floating button init:', e)
          }
        } else if (window.Cal) {
          // Cal est chargé mais le namespace n'existe pas encore
          setTimeout(checkCalLoaded, 200)
        } else {
          // Cal n'est pas encore chargé, créer le script
          const script = document.createElement('script')
          script.id = scriptId
          script.type = 'text/javascript'

          if (lang === 'fr') {
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
              
              Cal("init", "empire-request-fr", {origin:"https://app.cal.com"});
              
              setTimeout(function() {
                if (Cal.ns && Cal.ns["empire-request-fr"]) {
                  Cal.ns["empire-request-fr"]("floatingButton", {"calLink":"kevin-dufraisse-private/empire-request-fr","config":{"layout":"month_view","theme":"auto"},"buttonColor":"#dafc68","buttonTextColor":"#000000","hideButtonIcon":false,"buttonPosition":"bottom-right"}); 
                  Cal.ns["empire-request-fr"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
                }
              }, 1000);
            `
          } else {
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
              
              Cal("init", "empire-request", {origin:"https://app.cal.com"});
              
              setTimeout(function() {
                if (Cal.ns && Cal.ns["empire-request"]) {
                  Cal.ns["empire-request"]("floatingButton", {"calLink":"kevin-dufraisse-private/empire-request","config":{"layout":"month_view"},"buttonColor":"#dafc68","buttonTextColor":"#000000","hideButtonIcon":false,"buttonPosition":"bottom-right"}); 
                  Cal.ns["empire-request"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
                }
              }, 1000);
            `
          }

          document.head.appendChild(script)
        }
      }

      checkCalLoaded()
    }

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initFloatingButton, 1000)
      })
    } else {
      setTimeout(initFloatingButton, 1000)
    }

    return () => {
      const scriptToRemove = document.getElementById(scriptId)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [lang])

  return null
}
