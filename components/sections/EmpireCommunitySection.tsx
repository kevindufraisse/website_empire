const TEAM_SPRITE = 'https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/content-team.webp'

function Member({ name, role, index }: { name: string; role: string; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5">
      <span
        role="img"
        aria-label={name}
        className="h-9 w-9 shrink-0 rounded-md bg-cover"
        style={{
          backgroundImage: `url(${TEAM_SPRITE})`,
          backgroundSize: '300% 200%',
          backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%`,
        }}
      />
      <span className="min-w-0">
        <b className="block truncate text-xs text-neutral-100">{name}</b>
        <small className="block truncate text-[10px] text-neutral-500">{role}</small>
      </span>
      <i className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
    </div>
  )
}

export default function EmpireCommunitySection() {
  return (
    <section className="bg-[#090909] px-4 py-16 text-white sm:px-6 md:py-24" aria-labelledby="empire-community-title">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-5 md:mb-10 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#dafc68]">Communauté &amp; lives</p>
            <h2 id="empire-community-title" className="mt-3 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">
              Des créateurs qui partagent.<br className="hidden sm:block" /> Des experts qui vous répondent.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Une communauté active, des conseils de l’équipe et un live chaque semaine pour avancer avec les autres créateurs.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <img src="https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/kevin-portrait-v13.png" alt="" className="h-12 w-12 rounded-full object-cover" />
            <span><b className="block text-sm text-white">Kevin Dufraisse</b>Fondateur · en direct chaque semaine</span>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-[#5d3b5e] bg-white shadow-[0_18px_65px_#0007]">
          <div className="flex h-12 items-center gap-3 bg-[#350d36] px-4 text-white">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-lg font-bold text-[#350d36]">#</span>
            <b className="text-sm">Empire</b>
            <span className="mx-auto hidden max-w-md flex-1 rounded-md border border-[#755376] bg-[#5b3c5d] px-3 py-1 text-center text-[10px] text-[#e8dfea] sm:block">Rechercher dans Empire</span>
            <span className="flex -space-x-2">
              {[0,1,2,3].map(i => <span key={i} className="h-7 w-7 rounded-md border-2 border-[#350d36] bg-cover" style={{ backgroundImage: `url(${TEAM_SPRITE})`, backgroundSize: '300% 200%', backgroundPosition: `${(i % 3) * 50}% ${Math.floor(i / 3) * 100}%` }} />)}
            </span>
          </div>

          <div className="grid min-h-[450px] md:grid-cols-[210px_minmax(0,1fr)]">
            <aside className="hidden bg-[#3f0e40] p-4 text-[#d8c9da] md:block">
              <b className="text-sm text-white">Empire · espace créateurs</b>
              <p className="mt-2 text-[10px] leading-relaxed text-[#c8b4cb]">Vos idées, vos questions et les retours de l’équipe au même endroit.</p>
              <small className="mb-2 mt-6 block text-[9px] uppercase tracking-wider text-[#a98aad]">Canaux</small>
              <div className="rounded bg-[#1164a3] px-2 py-2 text-xs font-semibold text-white"># annonces</div>
              <div className="mt-1 rounded px-2 py-2 text-xs"># vos-contenus</div>
              <div className="mt-1 rounded px-2 py-2 text-xs"># questions</div>
              <div className="mt-1 rounded px-2 py-2 text-xs"># entraide</div>
              <small className="mb-2 mt-6 block text-[9px] uppercase tracking-wider text-[#a98aad]">Équipe Empire</small>
              {['Maya','Karim','Nina','Thomas'].map((name,i) => <Member key={name} name={name} role={['Stratégie','Diffusion','Montage','Copywriting'][i]} index={i} />)}
            </aside>

            <div className="flex min-w-0 flex-col text-[#222]">
              <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4">
                <span className="text-sm font-semibold"># vos-contenus</span>
                <span className="text-right text-[10px] text-neutral-500">Conseils de l’équipe et retours des créateurs</span>
              </div>
              <div className="grid flex-1 gap-5 p-4 md:grid-cols-[minmax(0,1fr)_minmax(210px,.8fr)] md:p-6">
                <div className="space-y-5">
                  <p className="text-center text-[10px] text-neutral-400">Aujourd’hui</p>
                  <div className="flex gap-3">
                    <span className="h-9 w-9 shrink-0 rounded-md bg-cover" style={{ backgroundImage: `url(${TEAM_SPRITE})`, backgroundSize: '300% 200%', backgroundPosition: '0% 0%' }} />
                    <p className="text-xs leading-relaxed text-neutral-700"><b className="mr-2 text-neutral-900">Maya</b>J’ai publié ma première vidéo sur trois réseaux. Vous pouvez me dire ce que vous en pensez ?<span className="mt-3 block rounded-lg border border-neutral-200 bg-neutral-50 p-3"><b className="block text-[11px]">Ma tier list des créateurs business</b><small className="mt-1 block text-neutral-500">Instagram · YouTube · TikTok</small><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#1264a3]">↗ Voir la publication</span></span><span className="mt-2 block text-[10px] text-neutral-500">♡ 4 &nbsp; 👀 3 réponses</span></p>
                  </div>
                  <div className="flex gap-3">
                    <span className="h-9 w-9 shrink-0 rounded-md bg-cover" style={{ backgroundImage: `url(${TEAM_SPRITE})`, backgroundSize: '300% 200%', backgroundPosition: '50% 0%' }} />
                    <p className="text-xs leading-relaxed text-neutral-700"><b className="mr-2 text-neutral-900">Karim · Équipe Empire</b>Le format est clair. Essaie de commencer par la question qui revient le plus souvent chez tes clients.<span className="mt-2 block text-[10px] text-neutral-500">Réponse dans # vos-contenus · il y a 12 min</span></p>
                  </div>
                  <div className="rounded-lg border border-neutral-200 p-3 text-[10px] text-neutral-400">Écrire un message…</div>
                </div>
                <div className="rounded-lg bg-[#1a1d21] p-3 text-white">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[11px]"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Live Empire <small className="ml-auto text-neutral-400">4 participants</small></div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[0,1,2,3].map((i) => <div key={i} className="relative aspect-video overflow-hidden rounded-md bg-neutral-700"><img src={i===0 ? "https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/kevin-portrait-v13.png" : TEAM_SPRITE} alt={i===0 ? "Kevin, en direct" : `Créateur participant au live ${i}`} className="h-full w-full object-cover" style={i===0?{}:{objectPosition:`${((i-1)%3)*50}% ${Math.floor((i-1)/3)*100}%`,objectFit:'cover'}}/><span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-1 text-[9px]"> {i===0 ? 'Kevin' : ['Maya','Karim','Nina'][i-1]}</span></div>)}
                  </div>
                  <p className="mt-3 text-[10px] text-neutral-300">Le live de la semaine · Questions et retours sur vos contenus</p>
                  <div className="mt-3 flex justify-center gap-2"><span className="rounded-full bg-neutral-700 px-3 py-1.5 text-xs">🎙</span><span className="rounded-full bg-neutral-700 px-3 py-1.5 text-xs">◉</span><span className="rounded-full bg-red-600 px-3 py-1.5 text-xs">Quitter</span></div>
                </div>
              </div>
              <div className="border-t border-neutral-200 px-4 py-3 text-center text-[10px] text-neutral-500">Une question dans Slack. Un retour de l’équipe. Un live chaque semaine.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
