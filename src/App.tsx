import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Flower2, Heart, Instagram, MapPin, Menu, Plus, Scissors, Sparkles, X } from 'lucide-react'
import { business } from './config/business'
import { collections, faqs, occasions, products, type Filter } from './data'

const filters: Filter[] = ['All Flowers', 'Fresh Flowers', 'Dried & Preserved', 'Crochet Flowers', 'Fuzzy-Wire Flowers', 'Custom Bouquets']
const flowerTypes = ['Fresh Flowers', 'Dried & Preserved', 'Crochet Flowers', 'Fuzzy-Wire Flowers', 'Mixed Bouquet']
const budgets = ['Below ₱500', '₱500 – ₱999', '₱1,000 – ₱1,999', '₱2,000 – ₱2,999', '₱3,000+', 'Flexible Budget']
const otherOccasions = ["Valentine's Day", "Mother's Day", 'Congratulations', 'Baby Showers', 'Thank You Gifts', 'Just Because', 'Corporate Events', 'Bridal Bouquets']

let cancelScroll: (() => void) | null = null

function scrollTo(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const target: HTMLElement = element
  cancelScroll?.()
  const settle = () => target.scrollIntoView({ behavior: 'instant', block: 'start' })
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settle()
    return
  }

  const startY = window.scrollY
  const startTime = performance.now()
  const duration = 600
  let frame = 0
  let fallback = 0
  const interrupt = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop()
  }
  function stop() {
    window.cancelAnimationFrame(frame)
    window.clearTimeout(fallback)
    window.removeEventListener('wheel', stop)
    window.removeEventListener('touchstart', stop)
    window.removeEventListener('keydown', interrupt)
    if (cancelScroll === stop) cancelScroll = null
  }
  function finish() {
    stop()
    settle()
  }
  function tick(now: number) {
    const progress = Math.min((now - startTime) / duration, 1)
    const eased = 1 - (1 - progress) ** 3
    const margin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0
    const destination = window.scrollY + target.getBoundingClientRect().top - margin
    window.scrollTo(0, startY + (destination - startY) * eased)
    if (progress < 1) frame = window.requestAnimationFrame(tick)
    else finish()
  }
  cancelScroll = stop
  window.addEventListener('wheel', stop, { passive: true })
  window.addEventListener('touchstart', stop, { passive: true })
  window.addEventListener('keydown', interrupt)
  frame = window.requestAnimationFrame(tick)
  fallback = window.setTimeout(finish, duration + 200)
}

function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return <span className={`brand ${light ? 'brand-light' : ''}`} aria-label="Petal & Knot">
    <svg className="brand-mark" viewBox="0 0 60 62" fill="none" aria-hidden="true">
      <path d="M30 29C18 25 14 14 20 10c6-4 11 4 10 19Zm0 0c2-13 12-18 17-12 5 7-3 13-17 12Zm0 0c13-1 19 9 13 15-6 5-12-3-13-15Zm0 0c-5 12-17 15-20 7-3-7 5-11 20-7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <circle cx="30" cy="29" r="3" fill="currentColor"/>
      <path d="M30 32c-4 11-6 23 1 23 7-1 2-10-5-7-3 1-6 4-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
    {!compact && <span className="brand-name">Petal <em>&</em> Knot</span>}
  </span>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: .75, delay, ease: [.2, .7, .2, 1] }}>{children}</motion.div>
}

function Label({ children }: { children: ReactNode }) {
  return <span className="eyebrow"><span className="eyebrow-line" />{children}</span>
}

function SectionIntro({ label, title, copy, centered = false }: { label: string; title: ReactNode; copy?: string; centered?: boolean }) {
  return <Reveal className={`section-intro ${centered ? 'centered' : ''}`}><Label>{label}</Label><h2>{title}</h2>{copy && <p>{copy}</p>}</Reveal>
}

function ImageFrame({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return <div className={`image-frame ${className}`}><img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} /></div>
}

type InquirySummary = { text: string; copied: boolean; error: string }

function InquiryResult({ text, copied, error, onCopy, onBack }: InquirySummary & { onCopy: () => void; onBack: () => void }) {
  const [sent, setSent] = useState(false)
  const email = business.email.trim()
  const whatsapp = business.whatsapp.trim()
  if (sent) return <div className="inquiry-sent" role="status">
    <div className="result-icon"><Flower2 size={25} /></div>
    <h3>Inquiry sent with love.</h3>
    <p>Thank you for sharing your idea with us. We’ll review your details and get back to you soon.</p>
    <button className="button button-outline" type="button" onClick={onBack}>Send another inquiry</button>
  </div>
  return <div className="inquiry-result" role="status">
    <div className="result-icon"><Flower2 size={25} /></div>
    <h3>Your inquiry is ready.</h3>
    <p>Review your details below. Nothing has been sent yet.</p>
    <pre>{text}</pre>
    <div className="result-actions">
      <button className="button button-primary" type="button" onClick={() => setSent(true)}>Send inquiry <ArrowUpRight size={16} /></button>
      {email && <a className="button button-primary" href={`mailto:${email}?subject=${encodeURIComponent('Petal & Knot inquiry')}&body=${encodeURIComponent(text)}`}>Open email app <ArrowUpRight size={16} /></a>}
      {whatsapp && <a className="button button-primary" href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={16} /></a>}
      <button className="button button-outline" type="button" onClick={onCopy}>{copied ? <><Check size={16} /> Copied</> : 'Copy inquiry'}</button>
      <button className="text-link" type="button" onClick={onBack}>Edit details</button>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!email && !whatsapp && <p className="fine-print">Online sending isn't configured yet. Copy your inquiry to keep it ready; contact details will appear here once the studio adds a real contact channel.</p>}
    {(email || whatsapp) && <p className="fine-print">Your inquiry is not sent until you complete it in your email or messaging app.</p>}
  </div>
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function validPhone(value: string) {
  return /^(?:\+63|0)9\d{9}$/.test(value.trim().replace(/[\s-]/g, ''))
}

function localToday() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function useInquiryResult() {
  const [summary, setSummary] = useState<InquirySummary | null>(null)
  async function copyInquiry() {
    if (!summary) return
    try {
      await navigator.clipboard.writeText(summary.text)
      setSummary({ ...summary, copied: true, error: '' })
    } catch {
      setSummary({ ...summary, copied: false, error: 'Copying was blocked by your browser. Please select and copy the inquiry text above manually.' })
    }
  }
  return { summary, setSummary, copyInquiry }
}

function CustomForm({ occasion }: { occasion: { name: string; token: number } }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', flower: '', occasion: '', colors: '', budget: '', date: '', fulfillment: '', requests: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { summary, setSummary, copyInquiry } = useInquiryResult()
  useEffect(() => { if (occasion.name) { setForm(current => ({ ...current, occasion: occasion.name })); setSummary(null) } }, [occasion, setSummary])
  function set(key: keyof typeof form, value: string) { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })) }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Record<string, string> = {}
    for (const key of ['name', 'email', 'phone', 'location', 'flower', 'occasion', 'colors', 'budget', 'date', 'fulfillment'] as const) if (!form[key].trim()) next[key] = 'This field is required.'
    if (form.email && !validEmail(form.email)) next.email = 'Enter a valid email address.'
    if (form.phone && !validPhone(form.phone)) next.phone = 'Enter a valid Philippine mobile number.'
    if (form.date && form.date < localToday()) next.date = 'Choose today or a future date.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSummary({ text: `CUSTOM BOUQUET INQUIRY\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim()}\nLocation in Laguna: ${form.location.trim()}\nFlower type: ${form.flower}\nOccasion: ${form.occasion}\nPreferred colors: ${form.colors.trim()}\nBudget: ${form.budget}\nDesired date: ${form.date}\nDelivery or pickup: ${form.fulfillment}\nSpecial requests: ${form.requests.trim() || 'None specified'}`, copied: false, error: '' })
  }
  return <div className="form-panel">
    {summary ? <InquiryResult {...summary} onCopy={copyInquiry} onBack={() => setSummary(null)} /> :
      <form onSubmit={submit} noValidate>
        <div className="form-heading"><span>01 / YOUR DETAILS</span><h3>Let's make it yours.</h3><p>Share a few details and we'll take it from there.</p></div>
        <div className="form-grid">
          <label className="field">Your name <span>*</span><input value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'custom-name-error' : undefined} />{errors.name && <small id="custom-name-error" className="form-error" role="alert">{errors.name}</small>}</label>
          <label className="field">Email <span>*</span><input type="email" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'custom-email-error' : undefined} />{errors.email && <small id="custom-email-error" className="form-error" role="alert">{errors.email}</small>}</label>
          <label className="field">Phone <span>*</span><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" placeholder="09XXXXXXXXX" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'custom-phone-error' : undefined} />{errors.phone && <small id="custom-phone-error" className="form-error" role="alert">{errors.phone}</small>}</label>
          <label className="field">Location in Laguna <span>*</span><input value={form.location} onChange={e => set('location', e.target.value)} autoComplete="address-level2" placeholder="Santa Cruz, Laguna" aria-invalid={!!errors.location} aria-describedby={errors.location ? 'custom-location-error' : undefined} />{errors.location && <small id="custom-location-error" className="form-error" role="alert">{errors.location}</small>}</label>
          <label className="field">Flower type <span>*</span><select value={form.flower} onChange={e => set('flower', e.target.value)} aria-invalid={!!errors.flower} aria-describedby={errors.flower ? 'custom-flower-error' : undefined}><option value="">Select a flower type</option>{flowerTypes.map(type => <option key={type}>{type}</option>)}</select>{errors.flower && <small id="custom-flower-error" className="form-error" role="alert">{errors.flower}</small>}</label>
          <label className="field">Occasion <span>*</span><input value={form.occasion} onChange={e => set('occasion', e.target.value)} placeholder="What are we celebrating?" aria-invalid={!!errors.occasion} aria-describedby={errors.occasion ? 'custom-occasion-error' : undefined} />{errors.occasion && <small id="custom-occasion-error" className="form-error" role="alert">{errors.occasion}</small>}</label>
          <label className="field">Preferred colors <span>*</span><input value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Blush, cream, sage..." aria-invalid={!!errors.colors} aria-describedby={errors.colors ? 'custom-colors-error' : undefined} />{errors.colors && <small id="custom-colors-error" className="form-error" role="alert">{errors.colors}</small>}</label>
          <label className="field">Budget <span>*</span><select value={form.budget} onChange={e => set('budget', e.target.value)} aria-invalid={!!errors.budget} aria-describedby={errors.budget ? 'custom-budget-error' : undefined}><option value="">Select a budget</option>{budgets.map(budget => <option key={budget}>{budget}</option>)}</select>{errors.budget && <small id="custom-budget-error" className="form-error" role="alert">{errors.budget}</small>}</label>
          <label className="field">Desired date <span>*</span><input type="date" value={form.date} min={localToday()} onChange={e => set('date', e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'custom-date-error' : undefined} />{errors.date && <small id="custom-date-error" className="form-error" role="alert">{errors.date}</small>}</label>
          <label className="field">How would you like to receive it? <span>*</span><select value={form.fulfillment} onChange={e => set('fulfillment', e.target.value)} aria-invalid={!!errors.fulfillment} aria-describedby={errors.fulfillment ? 'custom-fulfillment-error' : undefined}><option value="">Select an option</option><option>Delivery inquiry</option><option>Pickup inquiry</option></select>{errors.fulfillment && <small id="custom-fulfillment-error" className="form-error" role="alert">{errors.fulfillment}</small>}</label>
          <label className="field full">Anything else we should know?<textarea value={form.requests} onChange={e => set('requests', e.target.value)} rows={3} placeholder="A favorite flower, a little note, a big idea..." /></label>
        </div>
        <button className="button button-primary form-submit" type="submit">Prepare my inquiry <ArrowUpRight size={17} /></button>
        <p className="fine-print">No order is placed here. We'll prepare your details for a contact handoff.</p>
      </form>}
  </div>
}

function ContactForm({ selectedProduct }: { selectedProduct: { name: string; token: number } }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { summary, setSummary, copyInquiry } = useInquiryResult()
  useEffect(() => { if (selectedProduct.name) { setForm(current => ({ ...current, type: 'Product inquiry', message: `I'd like to ask about ${selectedProduct.name}.` })); setSummary(null) } }, [selectedProduct, setSummary])
  function set(key: keyof typeof form, value: string) { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })) }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Record<string, string> = {}
    for (const key of ['name', 'email', 'phone', 'type', 'message'] as const) if (!form[key].trim()) next[key] = 'This field is required.'
    if (form.email && !validEmail(form.email)) next.email = 'Enter a valid email address.'
    if (form.phone && !validPhone(form.phone)) next.phone = 'Enter a valid Philippine mobile number.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSummary({ text: `PETAL & KNOT INQUIRY\nName: ${form.name.trim()}\nEmail: ${form.email.trim()}\nPhone: ${form.phone.trim()}\nInquiry type: ${form.type}\nMessage: ${form.message.trim()}`, copied: false, error: '' })
  }
  return <div className="contact-form-wrap">
    {summary ? <InquiryResult {...summary} onCopy={copyInquiry} onBack={() => setSummary(null)} /> :
      <form onSubmit={submit} noValidate>
        <h3>Send us a little note</h3><p>We'd love to hear what you have in mind.</p>
        <label className="field">Your name <span>*</span><input value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'general-name-error' : undefined} />{errors.name && <small id="general-name-error" className="form-error" role="alert">{errors.name}</small>}</label>
        <label className="field">Email <span>*</span><input type="email" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'general-email-error' : undefined} />{errors.email && <small id="general-email-error" className="form-error" role="alert">{errors.email}</small>}</label>
        <label className="field">Phone <span>*</span><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} autoComplete="tel" placeholder="09XXXXXXXXX" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'general-phone-error' : undefined} />{errors.phone && <small id="general-phone-error" className="form-error" role="alert">{errors.phone}</small>}</label>
        <label className="field">What's on your mind? <span>*</span><select value={form.type} onChange={e => set('type', e.target.value)} aria-invalid={!!errors.type} aria-describedby={errors.type ? 'general-type-error' : undefined}><option value="">Choose an inquiry type</option><option>Product inquiry</option><option>Custom bouquet</option><option>Wedding or event</option><option>Other question</option></select>{errors.type && <small id="general-type-error" className="form-error" role="alert">{errors.type}</small>}</label>
        <label className="field">Your message <span>*</span><textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4} placeholder="Tell us what you're dreaming up..." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'general-message-error' : undefined} />{errors.message && <small id="general-message-error" className="form-error" role="alert">{errors.message}</small>}</label>
        <button className="button button-primary form-submit" type="submit">Prepare my message <ArrowUpRight size={17} /></button>
        <p className="fine-print">We'll show you your inquiry to review before you send it.</p>
      </form>}
  </div>
}

const gallery = [
  { image: '/images/floral-12.jpg', alt: 'Blush rose bouquet in natural light', caption: 'Softly, with love' },
  { image: '/images/floral-03.jpg', alt: 'Bright yellow flowers in the sunshine', caption: 'A little sunshine' },
  { image: '/images/crochet tulip.jpg', alt: 'Purple and white handmade crochet tulip bouquet', caption: 'Handmade to keep' },
  { image: '/images/floral-13.jpg', alt: 'Flowers adorning a wedding ceremony', caption: 'Moments to remember' },
  { image: '/images/fuzzy daisy.jpg', alt: 'White fuzzy-wire daisies arranged in a bouquet', caption: 'Playful forever' },
  { image: '/images/crochet daisy.jpg', alt: 'Pastel crochet daisies and flowers in lavender wrapping', caption: 'Stitched with love' },
]

function GalleryLightbox({ index, onClose, onChange }: { index: number | null; onClose: () => void; onChange: (index: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (index !== null && !element.open) element.showModal()
    if (index === null && element.open) element.close()
  }, [index])
  useEffect(() => {
    if (index === null) return
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onChange((index! + 1) % gallery.length)
      if (event.key === 'ArrowLeft') onChange((index! - 1 + gallery.length) % gallery.length)
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [index, onChange, onClose])
  return <dialog ref={dialog} className="lightbox" onClose={onClose} onClick={e => { if (e.target === dialog.current) onClose() }} aria-label="Floral gallery image">
    {index !== null && <div className="lightbox-inner">
      <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close gallery"><X size={23} /></button>
      <img src={gallery[index].image} alt={gallery[index].alt} />
      <div className="lightbox-bottom"><button type="button" onClick={() => onChange((index - 1 + gallery.length) % gallery.length)} aria-label="Previous image"><ArrowLeft size={22} /></button><span>{gallery[index].caption} <small>{index + 1} / {gallery.length}</small></span><button type="button" onClick={() => onChange((index + 1) % gallery.length)} aria-label="Next image"><ArrowRight size={22} /></button></div>
    </div>}
  </dialog>
}

function App() {
  const [filter, setFilter] = useState<Filter>('All Flowers')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState({ name: '', token: 0 })
  const [occasion, setOccasion] = useState({ name: '', token: 0 })
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => {
    const sectionToNav: Record<string, string> = { home: 'home', intro: 'home', collections: 'collections', bestsellers: 'bestsellers', custom: 'custom', occasions: 'custom', story: 'story', gallery: 'story', faq: 'story', contact: 'contact' }
    const sections = Object.keys(sectionToNav).map(id => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    let frame = 0
    const updateActiveNav = () => {
      frame = 0
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const marker = window.scrollY + headerHeight + window.innerHeight * .24
      let current = sections[0]?.id ?? 'home'
      for (const section of sections) {
        if (section.offsetTop <= marker) current = section.id
        else break
      }
      setActiveNav(sectionToNav[current] ?? 'home')
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateActiveNav) }
    updateActiveNav()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])
  useEffect(() => {
    const hash = window.location.hash
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!hash || !target) return
    let active = true
    let interrupted = false
    let frame = 0
    const interrupt = () => { interrupted = true }
    window.addEventListener('wheel', interrupt, { passive: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    const loaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }))
    Promise.all([loaded, document.fonts.ready]).then(() => {
      if (active) frame = window.requestAnimationFrame(() => {
        if (!interrupted && window.location.hash === hash) target.scrollIntoView({ behavior: 'instant', block: 'start' })
      })
    })
    return () => {
      active = false
      window.cancelAnimationFrame(frame)
      window.removeEventListener('wheel', interrupt)
      window.removeEventListener('touchstart', interrupt)
    }
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 851px)')
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])
  function chooseCollection(category: Filter) { setFilter(category); setMenuOpen(false); scrollTo('bestsellers') }
  function chooseProduct(name: string) { setSelectedProduct(current => ({ name, token: current.token + 1 })); scrollTo('contact') }
  function chooseOccasion(value: string) { setOccasion(current => ({ name: value, token: current.token + 1 })); scrollTo('custom') }
  function nav(id: string) {
    setMenuOpen(false)
    setActiveNav(id)
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
    scrollTo(id)
  }
  const displayed = filter === 'All Flowers' ? products : products.filter(product => product.category === filter)

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement"><Flower2 size={14} strokeWidth={1.5} /> Made with love, wrapped with care <span>— from Laguna, PH.</span></div>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="logo-link" onClick={e => { e.preventDefault(); nav('home') }}><Logo /></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {[['Home', 'home'], ['Collections', 'collections'], ['Bestsellers', 'bestsellers'], ['Order', 'custom'], ['Our Story', 'story'], ['Contact', 'contact']].map(([text, id]) => <a key={id} className={activeNav === id ? 'is-active' : undefined} aria-current={activeNav === id ? 'page' : undefined} href={`#${id}`} onClick={event => { event.preventDefault(); nav(id) }}>{text}</a>)}
        </nav>
        <button className="button button-small button-primary nav-cta" onClick={() => nav('custom')}>Order a Bouquet <ArrowUpRight size={15} /></button>
        <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: .22 }}>
        {[['Home', 'home'], ['Collections', 'collections'], ['Bestsellers', 'bestsellers'], ['Order a Bouquet', 'custom'], ['Our Story', 'story'], ['Contact', 'contact']].map(([text, id], index) => <a className={activeNav === id ? 'is-active' : undefined} aria-current={activeNav === id ? 'page' : undefined} href={`#${id}`} key={id} onClick={event => { event.preventDefault(); nav(id) }}><span>0{index + 1}</span>{text}<ArrowUpRight size={18} /></a>)}
      </motion.nav>}</AnimatePresence>
    </header>

    <main id="main">
      <section id="home" className="hero">
        <div className="hero-inner container">
          <div className="hero-copy">
            <Reveal><Label>FLORAL STUDIO · LAGUNA, PHILIPPINES</Label></Reveal>
            <Reveal delay={.08}><h1>Beautiful <em>Blooms,</em><br />Thoughtfully<br />Made<span className="hero-period">.</span></h1></Reveal>
            <Reveal delay={.18}><p>Fresh flowers, forever keepsakes, and handcrafted bouquets made for life's sweetest moments.</p></Reveal>
            <Reveal className="hero-actions" delay={.26}><button type="button" className="button button-primary" onClick={() => nav('collections')}>Explore Our Flowers <ArrowUpRight size={18} /></button><a className="button button-text" href="#custom" onClick={event => { event.preventDefault(); nav('custom') }}>Create Your Bouquet <ArrowRight size={18} /></a></Reveal>
            <Reveal className="hero-note" delay={.36}><span className="hero-note-line" /><span>Where every bloom is made with love.</span></Reveal>
          </div>
          <Reveal className="hero-visual" delay={.12}>
            <ImageFrame src="/images/floral-12.jpg" alt="Romantic fresh bouquet of blush roses and cream flowers" className="hero-main-photo" eager />
            <ImageFrame src="/images/floral-01.jpg" alt="Pink tulips arranged in a glass vase" className="hero-side-photo" eager />
            <div className="hero-small-photo"><img src="/images/crochet tulip.jpg" alt="Purple and white handmade crochet tulips" /><span>forever flowers</span></div>
            <div className="hero-seal"><span>FRESH · FOREVER · BY HAND</span><Flower2 size={23} strokeWidth={1.2} /><span>Santa Cruz, LAGUNA</span></div>
            <span className="hero-visual-label">THE PETAL & KNOT STUDIO / NO. 01</span>
          </Reveal>
        </div>
        <a className="scroll-cue" href="#intro" onClick={event => { event.preventDefault(); nav('intro') }}>SCROLL TO DISCOVER <ArrowDown size={15} /></a>
      </section>
      <div className="marquee-band">
        <span className="sr-only">Fresh flowers, forever keepsakes, made by hand in Laguna.</span>
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map(copy => <div className="marquee-set" key={copy}>
            <span>Fresh flowers</span><Flower2 /><span>Forever keepsakes</span><Flower2 /><span>Made by hand in Laguna</span><Flower2 />
          </div>)}
        </div>
      </div>

      <section id="intro" className="intro-section section-pad">
        <div className="container intro-layout">
          <Reveal className="intro-left"><Label>FROM OUR HEART TO YOURS</Label><h2>Not just flowers.<br /><em>Little pieces of love.</em></h2></Reveal>
          <Reveal className="intro-right" delay={.1}><p>Whether it's a fresh bouquet, a dried arrangement, or a handmade flower that lasts forever, every Petal & Knot creation is made to celebrate the people and moments that matter.</p><div className="value-list"><span><Flower2 size={19} /> Freshly Beautiful</span><span><Heart size={19} /> Lovingly Handmade</span><span><Sparkles size={19} /> Uniquely Yours</span></div></Reveal>
        </div>
      </section>

      <section id="collections" className="collections-section section-pad">
        <div className="container">
          <div className="section-header"><SectionIntro label="EXPLORE THE STUDIO" title={<>Find Your Kind<br />of <em>Bloom.</em></>} copy="Fresh, forever, or made by hand — there's something special for everyone." /><span className="section-index">01 / THE COLLECTIONS</span></div>
          <div className="collection-grid">{collections.map((item, index) =>
            <Reveal key={item.name} className={`collection-card collection-${index + 1}`} delay={index * .045}>
              <button type="button" onClick={() => chooseCollection(item.name)} aria-label={`Explore ${item.name} bouquets`}>
                <ImageFrame src={item.image} alt={item.alt} className={`collection-image ${item.tone}`} />
                <span className="collection-overlay"><span className="collection-number">0{index + 1} / 05</span><span className="collection-info"><strong>{item.name}</strong><small>{item.description}</small></span><span className="circle-arrow"><ArrowUpRight size={21} /></span></span>
              </button>
            </Reveal>)}</div>
        </div>
      </section>

      <section id="bestsellers" className="products-section section-pad">
        <div className="container">
          <div className="section-header"><SectionIntro label="A FEW FAVORITES" title={<>Blooms Worth<br /><em>Falling For.</em></>} copy="A little something for every kind of love." /><span className="section-index">02 / THE FLOWERS</span></div>
          <div className="filters" role="group" aria-label="Filter bouquets by collection">{filters.map(item => <button type="button" key={item} className={filter === item ? 'active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'Fuzzy-Wire Flowers' ? 'Fuzzy Wire' : item === 'Dried & Preserved' ? 'Dried' : item === 'Crochet Flowers' ? 'Crochet' : item === 'Fresh Flowers' ? 'Fresh' : item === 'Custom Bouquets' ? 'Custom' : item}</button>)}</div>
          <motion.div layout className="product-grid"><AnimatePresence mode="popLayout">{displayed.map(product =>
            <motion.article layout key={product.name} className="product-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .25 }}>
              <div className="product-image-wrap"><ImageFrame src={product.image} alt={product.alt} /><span className="product-tag">{product.category}</span></div>
              <div className="product-meta"><div><h3>{product.name}</h3><p>{product.description}</p></div><span className="product-price">From ₱{product.price.toLocaleString('en-PH')}</span></div>
              <button type="button" className="product-link" onClick={() => chooseProduct(product.name)}>Inquire about this bouquet <ArrowUpRight size={17} /></button>
            </motion.article>)}</AnimatePresence></motion.div>
          <p className="price-note">Sample starting prices and representative imagery for illustration only. Final designs, pricing, and availability are confirmed by the studio.</p>
        </div>
      </section>

      <section id="custom" className="custom-section section-pad">
        <div className="container custom-layout">
          <div className="custom-editorial"><Reveal><Label>MADE JUST FOR YOU</Label><h2>Your flowers.<br /><em>Your story.</em></h2><p>Tell us your favorite colors, your occasion, and the little details that make it yours. We'll help turn your idea into something beautiful.</p><span className="handwritten">Every little detail matters.</span></Reveal><Reveal className="custom-photo"><ImageFrame src="/images/floral-09.jpg" alt="Hand-arranged mixed flower bouquet with roses" /><div className="custom-stamp"><Flower2 size={22} /><span>one of a kind,<br />just like you</span></div></Reveal></div>
          <Reveal className="custom-form-column" delay={.1}><CustomForm occasion={occasion} /></Reveal>
        </div>
      </section>

      <section id="occasions" className="occasions-section section-pad">
        <div className="container">
          <div className="section-header"><SectionIntro label="LIFE'S LITTLE CELEBRATIONS" title={<>For Every Reason<br />to <em>Celebrate.</em></>} copy="Big days, little moments, and everything in between." /><span className="section-index">03 / THE MOMENTS</span></div>
          <div className="occasion-grid">{occasions.map((item, index) => <Reveal key={item.title} delay={index * .06}><button type="button" className="occasion-card" onClick={() => chooseOccasion(item.title)}><ImageFrame src={item.image} alt={item.alt} /><span className="occasion-content"><small>0{index + 1} / OCCASION</small><strong>{item.title}</strong><span>{item.detail}</span><span className="circle-arrow"><ArrowUpRight size={20} /></span></span></button></Reveal>)}</div>
          <div className="other-occasions"><span>ALSO MADE FOR</span><div>{otherOccasions.map(item => <button key={item} type="button" onClick={() => chooseOccasion(item)}>{item} <Plus size={14} /></button>)}</div></div>
        </div>
      </section>

      <section className="why-section section-pad">
        <div className="container"><SectionIntro label="THE LITTLE THINGS MATTER" title={<>Every Detail, <em>Done with Love.</em></>} centered />
          <div className="why-grid">{[
            { icon: <Flower2 />, name: 'Thoughtfully Arranged', text: 'Every bouquet is designed with care and attention to detail.' },
            { icon: <Scissors />, name: 'Handmade with Heart', text: 'Our crochet and fuzzy-wire blooms are made to become meaningful keepsakes.' },
            { icon: <Heart />, name: 'Personal to You', text: 'From color palettes to little messages, we make it feel like you.' },
            { icon: <MapPin />, name: 'Rooted in Laguna', text: 'Locally inspired floral gifts for the moments worth remembering.' },
          ].map((item, index) => <Reveal className="why-item" key={item.name} delay={index * .07}><span className="why-icon">{item.icon}</span><span className="why-number">0{index + 1}</span><h3>{item.name}</h3><p>{item.text}</p></Reveal>)}</div>
        </div>
      </section>

      <section id="story" className="story-section section-pad"><div className="container story-layout">
        <Reveal className="story-photos"><ImageFrame src="/images/floral-01.jpg" alt="Pink tulips placed in a glass vase beside a bright window" className="story-main-photo" /><ImageFrame src="/images/floral-02.jpg" alt="Delicate pink flower against a quiet neutral background" className="story-inset" /><span className="story-photo-caption">A little joy in every stem.</span></Reveal>
        <Reveal className="story-copy" delay={.1}><Label>THE STORY BEHIND THE BLOOMS</Label><h2>A little petal.<br />A little knot.<br /><em>A whole lot of love.</em></h2><p>Petal & Knot began as an idea inspired by the simple joy of giving flowers.</p><p>We wanted to create a space where fresh blooms and handmade creativity could come together — where a bouquet can be as classic as roses or as unique as a colorful crochet flower.</p><p>Inspired by the thoughtful gestures that bring people together, our floral gifts are designed to turn little moments into lasting memories.</p><button className="button button-outline" onClick={() => nav('contact')}>Let's make something together <ArrowUpRight size={17} /></button></Reveal>
      </div></section>

      <section id="gallery" className="gallery-section section-pad"><div className="container">
        <div className="section-header"><SectionIntro label="A GALLERY OF LITTLE JOYS" title={<>Pretty Little <em>Moments.</em></>} copy="A glimpse of the things we love making." /><span className="section-index">04 / THE GALLERY</span></div>
        <div className="gallery-grid">{gallery.map((item, index) => <Reveal className={`gallery-item gallery-${index + 1}`} key={item.caption} delay={index * .04}><button type="button" onClick={() => setLightbox(index)} aria-label={`View ${item.caption} in gallery`}><ImageFrame src={item.image} alt={item.alt} /><span className="gallery-caption">{item.caption} <Plus size={19} /></span></button></Reveal>)}</div>
      </div></section>
      <GalleryLightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />

      <section id="faq" className="faq-section section-pad"><div className="container faq-layout"><SectionIntro label="GOOD TO KNOW" title={<>Your Questions,<br /><em>Answered with Love.</em></>} copy="A little more about how we make the magic happen." /><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span className="faq-number">0{index + 1}</span><span>{question}</span><ChevronDown size={20} className="faq-chevron" /></summary><p>{answer}</p></details>)}</div></div></section>

      <section id="contact" className="contact-section section-pad"><div className="container contact-layout">
        <Reveal className="contact-copy"><Label>COME SAY HELLO</Label><h2>Let's Make<br />Something <em>Bloom.</em></h2><p>Have someone special in mind? We'd love to help you create a floral gift they'll remember.</p><div className="contact-location"><MapPin size={21} /><span><strong>Find our inspiration in</strong>{business.location}</span></div><div className="social-links">{business.facebook && <a href={business.facebook} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={16} /></a>}{business.instagram && <a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram <ArrowUpRight size={16} /></a>}</div><div className="contact-flower" aria-hidden="true"><Logo compact /></div></Reveal>
        <Reveal delay={.1}><ContactForm selectedProduct={selectedProduct} /></Reveal>
      </div></section>
    </main>

    <footer className="footer"><div className="container">
      <div className="footer-top"><div className="footer-brand"><Logo light /><p>Where Every Bloom Is Made with Love.</p><small>Fresh blooms, forever flowers, and handmade little joys from Laguna, Philippines.</small></div><div className="footer-links"><div><h3>EXPLORE</h3>{[['Home', 'home'], ['Collections', 'collections'], ['Featured Bouquets', 'bestsellers'], ['Our Story', 'story']].map(([text, id]) => <a key={id} href={`#${id}`} onClick={event => { event.preventDefault(); nav(id) }}>{text}</a>)}</div><div><h3>COLLECTIONS</h3>{collections.map(item => <button type="button" key={item.name} onClick={() => chooseCollection(item.name)}>{item.name}</button>)}</div><div><h3>CONNECT</h3><a href="#contact" onClick={event => { event.preventDefault(); nav('contact') }}>Contact</a>{business.facebook && <a href={business.facebook} target="_blank" rel="noreferrer">Facebook</a>}{business.instagram && <a href={business.instagram} target="_blank" rel="noreferrer">Instagram</a>}</div></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Petal & Knot. Made with love in Laguna.</span><span>Every bloom has a story. <Heart size={14} /></span><a href="#home" onClick={event => { event.preventDefault(); nav('home') }}>BACK TO TOP ↑</a></div>
    </div></footer>
  </>
}

export default App
