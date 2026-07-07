import { ReactNode } from 'react'

export const metadata = {
  robots: { index: false, follow: false },
}

export default function BetaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
