// Pied de page des pages vidéo (pub Meta) : le header et le footer du site y sont masqués.
export default function AdPageFooter() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-4 pb-8 pt-12 text-center text-[11px] leading-relaxed text-neutral-500">
      <p>© {new Date().getFullYear()} - Empire-Internet.com - Tous droits réservés.</p>
      <p className="mt-2">
        <a href="/" className="hover:text-neutral-300">Page D&apos;Accueil</a>
        {' | '}
        <a href="/privacy" className="hover:text-neutral-300">Politique de confidentialité</a>
        {' | '}
        <a href="/terms" className="hover:text-neutral-300">Conditions Générales De Ventes</a>
        {' | '}
        <a href="mailto:kevin@empire-internet.com" className="hover:text-neutral-300">Support</a>
      </p>
      <p className="mt-4">
        Ce site ne fait pas partie du site Web de Facebook ou de Facebook Inc. De plus, ce site n&apos;est en aucun cas
        approuvé par Facebook. FACEBOOK est une marque commerciale de FACEBOOK, Inc.
      </p>
      <p className="mt-3">
        * Vos résultats peuvent varier. Les témoignages et exemples utilisés sont des résultats exceptionnels et ne sont
        pas destinés à garantir, promettre, représenter et / ou assurer que quiconque obtiendra des résultats identiques
        ou similaires.
      </p>
    </footer>
  )
}
