import React, { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile, sections } from '../data/profile'

export function Navbar({ active }) {
  const menu = useRef(null)
  const [open, setOpen] = useState(false)
  const close = () => menu.current.close()
  return (
    <>
      <header className={'masthead on-' + active}>
        <div className="mast-inner">
          <a href="#home" className="signature" aria-label="Prajwal Pradhan, home">
            <b>
              PP<span>.</span>
            </b>
            <span className="signature-name">
              Prajwal
              <br />
              Pradhan
            </span>
          </a>
          <nav aria-label="Primary" className="desktop-nav">
            {sections.slice(0, -1).map(([id, label]) => (
              <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <a className="talk-link" href="#contact">
            <i />
            Let’s talk
          </a>
          <button
            className="menu-toggle"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => {
              menu.current.showModal()
              setOpen(true)
            }}
          >
            Menu <Menu size={16} />
          </button>
        </div>
      </header>
      <dialog
        id="site-menu"
        className="menu-sheet"
        ref={menu}
        onClose={() => setOpen(false)}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between">
          <b className="display">
            PP<span className="orange">.</span>
          </b>
          <button aria-label="Close navigation" onClick={close}>
            <X />
          </button>
        </div>
        <nav aria-label="Mobile">
          {sections.map(([id, label]) => (
            <a href={'#' + id} key={id} onClick={close}>
              {label}
              <span>.</span>
            </a>
          ))}
        </nav>
        <a className="mono" href={'mailto:' + profile.email}>
          {profile.email}
        </a>
      </dialog>
    </>
  )
}
