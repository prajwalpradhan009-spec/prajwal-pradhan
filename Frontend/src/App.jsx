import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Preloader, Cursor, ScrollProgress } from './components/Chrome'
import Chatbot from './components/Chatbot/Chatbot'
import Hero from './sections/Hero'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import About from './sections/About'
import GithubLive from './sections/GithubLive'
import Contact from './sections/Contact'
import { sections } from './data/profile'
import { usePageMotion } from './hooks/usePageMotion'

const aliases = {
  learning: 'about',
  education: 'about',
  profile: 'about',
  services: 'skills',
  stats: 'home',
}
export default function App() {
  const page = useRef(null)
  const [active, setActive] = useState('home')
  usePageMotion(page)
  useEffect(() => {
    const elements = sections.map(([id]) => document.getElementById(id))
    const update = () => {
      const top = window.innerHeight * 0.38
      const visible = elements.filter((el) => el.getBoundingClientRect().top <= top)
      setActive(visible.at(-1)?.id || 'home')
    }
    const goToEntry = () => {
      const entry = location.hash.slice(1) || location.pathname.split('/').filter(Boolean)[0]
      const id = aliases[entry] || entry
      if (id && elements.some((el) => el.id === id))
        document.getElementById(id).scrollIntoView({ behavior: 'instant' })
      update()
    }
    let alive = true
    document.fonts.ready.then(() => {
      if (alive) goToEntry()
    })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('hashchange', goToEntry)
    return () => {
      alive = false
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('hashchange', goToEntry)
    }
  }, [])
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Preloader />
      <ScrollProgress />
      <Navbar active={active} />
      <main id="main" ref={page}>
        <Hero />
        <Skills />
        <Projects />
        <About />
        <GithubLive />
        <Contact />
      </main>
      <nav className={'section-rail on-' + active} aria-label="Section shortcuts">
        {sections.map(([id, label]) => (
          <a
            key={id}
            href={'#' + id}
            aria-label={label}
            aria-current={active === id ? 'location' : undefined}
          />
        ))}
      </nav>
      <Cursor />
      <Chatbot active={active} />
    </>
  )
}
