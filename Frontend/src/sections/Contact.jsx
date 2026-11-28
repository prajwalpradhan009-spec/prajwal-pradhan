import React, { useEffect, useState } from 'react'
import { Mail, Send, CornerLeftUp } from 'lucide-react'
import { SiFacebook, SiGithub, SiInstagram, SiLinkedin, SiWhatsapp } from 'react-icons/si'
import { profile } from '../data/profile'
import { apiBase } from '../api'

const socialLogos = {
  GitHub: <SiGithub size={17} color="#000000" aria-hidden="true" />,
  LinkedIn: <SiLinkedin size={17} color="#0A66C2" aria-hidden="true" />,
  Instagram: (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="contact-instagram" cx="22%" cy="100%" r="120%">
          <stop stopColor="#FFDC80" />
          <stop offset=".28" stopColor="#FCAF45" />
          <stop offset=".52" stopColor="#F56040" />
          <stop offset=".75" stopColor="#C13584" />
          <stop offset="1" stopColor="#5851DB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#contact-instagram)" />
      <SiInstagram x="3" y="3" size={18} color="#FFFFFF" />
    </svg>
  ),
  Facebook: <SiFacebook size={17} color="#1877F2" aria-hidden="true" />,
}

function whatsappLink(number) {
  const digits = (number || '').replace(/[\s()-]/g, '')
  const match = digits.match(/^(?:(?:\+|00)?91|0)?([1-9]\d{9})$/)
  if (!match) return null
  const message = 'Hello! I visited your portfolio and would like to connect with you.'
  return 'https://wa.me/91' + match[1] + '?text=' + encodeURIComponent(message)
}

const whatsapp = whatsappLink(import.meta.env.VITE_WHATSAPP_NUMBER)
const contactMotion = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

function ContactButton({ href, className = '', children }) {
  const follow = (event) => {
    if (event.pointerType !== 'mouse' || !matchMedia(contactMotion).matches) return
    const link = event.currentTarget
    const bounds = link.getBoundingClientRect()
    link.style.setProperty('--contact-x', ((event.clientX - bounds.left) / bounds.width - 0.5) * 8 + 'px')
    link.style.setProperty('--contact-y', ((event.clientY - bounds.top) / bounds.height - 0.5) * 5 + 'px')
  }
  const reset = (event) => {
    event.currentTarget.style.removeProperty('--contact-x')
    event.currentTarget.style.removeProperty('--contact-y')
  }
  return (
    <a
      href={href}
      className={('contact-button ' + className).trim()}
      target="_blank"
      rel="noreferrer"
      onPointerMove={follow}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </a>
  )
}

function LocalTime() {
  const [date, setDate] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setDate(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  return (
    <time dateTime={date.toISOString()}>
      {new Intl.DateTimeFormat('en-GB', {
        timeZone: profile.timeZone,
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)}{' '}
      IST
    </time>
  )
}

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const body = Object.fromEntries(new FormData(form))
    if (Object.values(body).some((v) => !v.trim())) {
      setError('Please complete each field.')
      setStatus('error')
      return
    }
    setStatus('sending')
    const id = import.meta.env.VITE_FORMSPREE_ID
    try {
      const response = await fetch(
        id ? 'https://formspree.io/f/' + encodeURIComponent(id) : apiBase + '/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(20000),
        }
      )
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json'))
        throw new Error()
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      setError('Your message couldn’t be sent. Try again or use the email link.')
    }
  }
  return (
    <section id="contact" className="contact">
      <div className="section-wrap contact-inner">
        <div className="kicker">
          <i className="signal" />
          Contact
        </div>
        <h2 className="section-title contact-title" aria-label="Let’s work together">
          {['Let’s work', 'together.'].map((line) => (
            <span key={line} aria-hidden="true">
              {[...line].map((c, i) => (
                <b key={i}>{c === ' ' ? '\u00a0' : c}</b>
              ))}
            </span>
          ))}
        </h2>
        <div className="contact-grid">
          <form
            onSubmit={submit}
            onChange={() => {
              if (status !== 'sending') setStatus('idle')
            }}
          >
            {[
              ['name', 'Name', 'text'],
              ['email', 'Email', 'email'],
              ['subject', 'Subject', 'text'],
              ['message', 'Message', 'textarea'],
            ].map(([name, label, type]) => (
              <label className={'field field-' + name} key={name}>
                {type === 'textarea' ? (
                  <textarea name={name} required maxLength={5000} placeholder=" " rows="4" />
                ) : (
                  <input
                    type={type}
                    name={name}
                    placeholder=" "
                    required
                    autoComplete={name === 'name' || name === 'email' ? name : 'off'}
                    maxLength={160}
                  />
                )}
                <span>{label}</span>
              </label>
            ))}
            <button className="pill" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
              <Send size={15} />
            </button>
            <p className="form-status" role="status">
              {status === 'sent'
                ? 'Thank you. Your message was received.'
                : status === 'error'
                ? error
                : ''}
            </p>
          </form>
          <div className="contact-info">
            <div>
              <p className="mono">Email</p>
              <a href={'mailto:' + profile.email}>
                <Mail size={17} />
                {profile.email}
              </a>
            </div>
            {whatsapp && (
              <div>
                <p className="mono">WhatsApp</p>
                <ContactButton href={whatsapp} className="pill whatsapp-button">
                  <SiWhatsapp size={20} color="#FFFFFF" aria-hidden="true" />
                  Chat on WhatsApp
                </ContactButton>
              </div>
            )}
            <div>
              <p className="mono">Location</p>
              <p>
                {profile.location} <span>/</span> <LocalTime />
              </p>
            </div>
            <div>
              <p className="mono">Elsewhere</p>
              <div className="socials">
                {Object.entries(profile.socials).map(([label, url]) => (
                  <ContactButton href={url} key={label}>
                    {socialLogos[label]}
                    {label}
                  </ContactButton>
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="footer mono">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a href="#home">
            <CornerLeftUp size={15} />
            Back to top
          </a>
        </footer>
      </div>
    </section>
  )
}
