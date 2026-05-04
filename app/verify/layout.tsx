import { ReactNode } from 'react'

export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        [data-chrome] { display: none !important; }
      `}</style>
      {children}
    </>
  )
}
