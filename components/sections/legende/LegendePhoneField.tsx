'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { getCountries, getCountryCallingCode, getExampleNumber, type CountryCode, type Examples } from 'libphonenumber-js/min'
import { countryPhone } from '@/lib/legende-phone'
import styles from './legende-form.module.css'

const flag = (code: string) => String.fromCodePoint(...Array.from(code, char => 127397 + char.charCodeAt(0)))
const simplify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const frequent: CountryCode[] = ['FR', 'BE', 'CH', 'CA', 'PT', 'IT', 'US', 'GB']

type Props = {
  lang: 'fr' | 'en'
  country: CountryCode
  value: string
  invalid: boolean
  onInvalid: () => void
  onChange: (country: CountryCode, value: string) => void
}

export default function LegendePhoneField({ lang, country, value, invalid, onInvalid, onChange }: Props) {
  const fr = lang === 'fr'
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [examples, setExamples] = useState<Examples>()
  useEffect(() => { import('libphonenumber-js/examples.mobile.json').then(m => setExamples(m.default as Examples)) }, [])
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) {
      dialog.current.showModal()
      dialog.current.querySelector('input')?.focus({ preventScroll: true })
    }
  }, [open])
  const countries = useMemo(() => {
    const names = new Intl.DisplayNames([lang], { type: 'region' })
    return getCountries().map(iso => {
      const name = names.of(iso) || iso
      return { iso, name, search: simplify(name), dial: '+' + getCountryCallingCode(iso) }
    }).sort((a, b) => {
      const left = frequent.indexOf(a.iso), right = frequent.indexOf(b.iso)
      return (left < 0 ? frequent.length : left) - (right < 0 ? frequent.length : right) || a.name.localeCompare(b.name, lang)
    })
  }, [lang])
  const selected = countries.find(row => row.iso === country)!
  const term = simplify(query)
  const filtered = countries.filter(row => row.search.includes(term) || row.iso.toLowerCase() === term || row.dial.startsWith(term.startsWith('+') ? term : '+' + term))
  const example = examples && getExampleNumber(country, examples)?.formatNational()

  function update(iso: CountryCode, number: string) {
    input.current?.setCustomValidity('')
    onChange(iso, number)
  }
  function choose(iso: CountryCode) {
    update(iso, value)
    dialog.current?.close()
    requestAnimationFrame(() => input.current?.focus())
  }
  function formatNumber() {
    const parsed = countryPhone(value, country)
    if (!parsed || !value.trim()) return
    if (/^(\+|00)/.test(value.trim()) && parsed.country) update(parsed.country, parsed.formatNational())
    else if (parsed.countryCallingCode === getCountryCallingCode(country)) update(country, parsed.formatNational())
  }

  return <div>
    <label htmlFor="legende-phone" className={styles.label}>{fr ? 'Téléphone' : 'Phone number'}</label>
    <div className={styles.phone} data-invalid={invalid || undefined}>
      <button type="button" className={styles.countryTrigger} aria-haspopup="dialog" aria-expanded={open}
        aria-label={(fr ? 'Choisir le pays' : 'Choose country') + ' · ' + selected.name + ' ' + selected.dial}
        onClick={() => { setQuery(''); setOpen(true) }}>
        <span aria-hidden="true">{flag(country)}</span><span>{selected.dial}</span><ChevronDown size={15} aria-hidden />
      </button>
      <input id="legende-phone" ref={input} type="tel" inputMode="tel" autoComplete="tel" required name="phone" maxLength={40}
        value={value} placeholder={example} aria-invalid={invalid || undefined} aria-describedby={invalid ? 'legende-phone-error' : undefined}
        onInvalid={event => { event.preventDefault(); onInvalid(); input.current?.focus() }} onBlur={formatNumber}
        onChange={event => {
          const raw = event.target.value
          const pasted = /^(\+|00)/.test(raw.trim()) ? countryPhone(raw, country) : null
          if (pasted?.country && (event.nativeEvent as InputEvent).inputType === 'insertFromPaste') update(pasted.country, pasted.formatNational())
          else update(country, raw)
        }} />
    </div>
    {invalid && <p id="legende-phone-error" role="alert" className={styles.error}>{fr ? 'Vérifie le pays et le numéro saisi.' : 'Check the selected country and phone number.'}</p>}
    {open && createPortal(<dialog className={styles.dialog} ref={dialog}
      aria-labelledby="legende-country-title" onClose={() => setOpen(false)}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dialog.current?.close() }
      }}
      onClick={event => { if (event.target === dialog.current) dialog.current.close() }}>
      <div className={styles.dialogInner}>
        <div className={styles.dialogHeader}>
          <h3 id="legende-country-title">{fr ? 'Choisir un pays' : 'Choose a country'}</h3>
          <button type="button" aria-label={fr ? 'Fermer' : 'Close'} className={styles.close} onClick={() => dialog.current?.close()}><X size={20} /></button>
        </div>
        <label className={styles.search}>
          <Search size={17} aria-hidden />
          <input type="search" autoFocus autoComplete="off" placeholder={fr ? 'Pays ou indicatif' : 'Country or calling code'}
            aria-label={fr ? 'Rechercher un pays ou un indicatif' : 'Search country or calling code'} value={query}
            onChange={e => { setQuery(e.target.value); list.current?.scrollTo(0, 0) }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); list.current?.querySelector('button')?.focus() }
              if (e.key === 'Enter') {
                e.preventDefault()
                if (filtered.length === 1) choose(filtered[0].iso)
                else list.current?.querySelector('button')?.focus()
              }
            }} />
        </label>
        <div ref={list} className={styles.countryList} onKeyDown={e => {
          const row = e.target as HTMLButtonElement
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            const next = e.key === 'ArrowDown' ? row.nextElementSibling : row.previousElementSibling
            if (next instanceof HTMLButtonElement) next.focus()
          }
        }}>
          {filtered.map(row => <button key={row.iso} type="button" aria-pressed={country === row.iso}
            className={styles.countryRow} onClick={() => choose(row.iso)}>
            <span aria-hidden="true">{flag(row.iso)}</span><span>{row.name}</span><small>{row.dial}</small>
            {row.iso === country && <Check size={15} aria-hidden />}
          </button>)}
          {!filtered.length && <p role="status">{fr ? 'Aucun pays trouvé.' : 'No matching countries.'}</p>}
        </div>
      </div>
    </dialog>, document.body)}
  </div>
}
