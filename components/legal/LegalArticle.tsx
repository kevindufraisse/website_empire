import Link from 'next/link'
import type { ReactNode } from 'react'

type LegalArticleProps = {
  title: string
  date: string
  lang?: string
  children: ReactNode
}

export function LegalArticle({ title, date, lang = 'fr', children }: LegalArticleProps) {
  return (
    <main className="min-h-screen bg-black text-neutral-300 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-empire transition-colors mb-8 inline-block"
        >
          ← Retour au site
        </Link>
        <article lang={lang}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white border-b border-white/10 pb-4 mb-2">
            {title}
          </h1>
          <p className="text-sm text-neutral-400 mb-10">{date}</p>
          <div className="space-y-1 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:my-3 [&_p]:leading-relaxed [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-empire hover:[&_a]:text-empire/90 [&_a]:underline [&_a]:underline-offset-2">
            {children}
          </div>
        </article>
      </div>
    </main>
  )
}
