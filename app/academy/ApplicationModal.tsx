'use client'

import { useEffect, useRef } from 'react'
import ApplicationForm from './ApplicationForm'

export default function ApplicationModal() {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    let previousOverflow = ''
    let trigger: HTMLElement | null = null
    const open = () => {
      if (!dialog.current || dialog.current.open) return
      trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
      previousOverflow = document.body.style.overflow
      dialog.current.showModal()
      document.body.style.overflow = 'hidden'
    }
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href="#candidature"]') : null
      if (link) { event.preventDefault(); open() }
    }
    const hash = () => { if (window.location.hash === '#candidature') open() }
    const close = () => {
      document.body.style.overflow = previousOverflow
      if (window.location.hash === '#candidature') history.replaceState(null, '', window.location.pathname + window.location.search)
      trigger?.focus()
    }
    const el = dialog.current
    document.addEventListener('click', click)
    window.addEventListener('hashchange', hash)
    el?.addEventListener('close', close)
    hash()
    return () => { document.removeEventListener('click', click); window.removeEventListener('hashchange', hash); el?.removeEventListener('close', close); document.body.style.overflow = previousOverflow }
  }, [])
  return <dialog ref={dialog} aria-label="Candidature Head of Content" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_24px)] max-w-xl overflow-y-auto rounded-[20px] border border-white/20 bg-[#111] p-0 text-white backdrop:bg-black/80">
    <div className="flex justify-end px-5 pt-3"><button type="button" onClick={() => dialog.current?.close()} className="min-h-11 px-3 text-sm text-neutral-300">Fermer</button></div>
    <ApplicationForm />
  </dialog>
}
