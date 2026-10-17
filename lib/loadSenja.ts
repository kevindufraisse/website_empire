// Un widget Senja bloque le fil principal 0,5 à 1,2 s au moment où il se
// construit. Chargé à l'entrée dans l'écran, ce blocage tombait pile pendant
// le scroll. On le lance bien avant (marge large) et pendant un temps mort du
// navigateur, pour que le travail soit fini quand le visiteur arrive.

const loaded = new Set<string>()

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

export function loadSenjaWhenNear(el: Element, widgetId: string, rootMargin = '1200px'): () => void {
  if (loaded.has(widgetId) || document.querySelector(`script[src*="senja.io/widget/${widgetId}"]`)) {
    return () => {}
  }
  const w = window as IdleWindow
  let idleId: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const inject = () => {
    if (loaded.has(widgetId)) return
    loaded.add(widgetId)
    const script = document.createElement('script')
    script.src = `https://widget.senja.io/widget/${widgetId}/platform.js`
    script.async = true
    document.body.appendChild(script)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return
      observer.disconnect()
      // Délai long exprès : un délai court forçait le chargement en plein scroll.
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(inject, { timeout: 10000 })
      else timeoutId = setTimeout(inject, 300)
    },
    { rootMargin },
  )
  observer.observe(el)

  return () => {
    observer.disconnect()
    if (idleId !== null) w.cancelIdleCallback?.(idleId)
    if (timeoutId !== null) clearTimeout(timeoutId)
  }
}
