import React, { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus, Mouse } from 'lucide-react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { Count } from '../components/Chrome'

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const parallax = (e) => {
    if (reduce || e.pointerType !== 'mouse' || innerWidth < 900) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--px', ((e.clientX - rect.left) / rect.width - 0.5) * 9 + 'px')
    ref.current.style.setProperty('--py', ((e.clientY - rect.top) / rect.height - 0.5) * 5 + 'px')
  }
  return (
    <section
      id="home"
      className="hero"
      ref={ref}
      onPointerMove={parallax}
      onPointerLeave={() => {
        ref.current.style.setProperty('--px', '0px')
        ref.current.style.setProperty('--py', '0px')
      }}
    >
      <div className="hero-wrap">
        <div className="hero-meta mono">
          <span>
            <i className="signal" /> Personal portfolio
          </span>
          <span>
            India <b>/</b> IST
          </span>
        </div>
        <div className="hero-stage">
          <h1 aria-label="Developer" className="hero-title">
            <span className="title-mask" aria-hidden="true">
              {[...'DEVELOPER'].map((l, i) => (
                <span className="hero-letter" key={i}>
                  <motion.span
                    initial={reduce ? false : { y: '109%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.72,
                      delay: 0.18 + i * 0.035,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
          <div className="hero-figure">
            <motion.div
              className="photo-parallax"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <img
                className="cutout hero-portrait"
                src={profile.portrait}
                width="900"
                height="1125"
                alt="Prajwal Pradhan"
                fetchPriority="high"
              />
            </motion.div>
          </div>
          <div className="hero-intro">
            <p className="intro-name">
              <i className="signal" /> Hello, I’m {profile.firstName}.
            </p>
            <p className="intro-copy">
              A full-stack developer
              <br /> building for the web.
            </p>
            <ul id="services">
              {profile.services.map((s) => (
                <li key={s}>
                  <Plus size={12} aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-stats">
            {[
              [projects.length, 'Selected projects'],
              [2, 'Years learning'],
              [2, 'Certifications'],
            ].map(([n, label]) => (
              <div className="stat" key={label}>
                <b>
                  <Count value={n} pad />
                </b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-foot mono">
          <a href="#skills">
            <Mouse size={15} />
            Scroll to explore
          </a>
          <span className="availability">
            <i className="signal" />
            Open to opportunities
          </span>
        </div>
      </div>
    </section>
  )
}
