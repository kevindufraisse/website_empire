import { ReactNode } from 'react'

// Page vidéo : rien ne doit détourner du lecteur et des deux boutons.
// Pas de bulle WhatsApp (le setter n'est pas le chemin voulu ici), pas de
// popups ni de barre collante.
export default function VslLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-chrome="sticky-bar"],
        [data-chrome="popups"],
        [data-chrome="whatsapp"] { display: none !important; }
      `,
        }}
      />
      {children}
    </>
  )
}
