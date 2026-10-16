import { ReactNode } from 'react'

// Page de pub : la vidéo, puis l'inscription. Ni popups ni barre Cal.
export default function PortesOuvertesLayout({ children }: { children: ReactNode }) {
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
