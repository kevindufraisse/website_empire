import { ReactNode } from 'react'

// Page vidéo : rien ne doit détourner du lecteur et des deux boutons.
// Pas de popups ni de barre collante. La bulle WhatsApp reste, pour les
// questions.
export default function VslLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-chrome="sticky-bar"],
        [data-chrome="popups"] { display: none !important; }
      `,
        }}
      />
      {children}
    </>
  )
}
