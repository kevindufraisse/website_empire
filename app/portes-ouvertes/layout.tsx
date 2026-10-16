import { ReactNode } from 'react'

// Page de pub : la vidéo, puis l'inscription. Ni header, ni footer du site, ni popups, ni barre Cal.
export default function PortesOuvertesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-chrome="header"],
        [data-chrome="footer"],
        [data-chrome="sticky-bar"],
        [data-chrome="popups"] { display: none !important; }
      `,
        }}
      />
      {children}
    </>
  )
}
