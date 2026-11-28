import React from 'react'
import { AudioLines, LayoutTemplate, Server, Terminal } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { skills } from '../data/skills'

const icons = { layout: LayoutTemplate, server: Server, audio: AudioLines, terminal: Terminal }
export default function Skills() {
  const reduce = useReducedMotion()
  return (
    <section id="skills" className="skills dark-section">
      <div className="skills-stage">
        <div className="section-wrap">
          <div className="kicker">
            <i className="signal" />
            Skill set
          </div>
          <h2 className="section-title">
            What I build with<span>.</span>
          </h2>
        </div>
        <div className="marquee" aria-hidden="true">
          {[0, 1].map((n) => (
            <span key={n}>REACT · PYTHON · NODE.JS · MONGODB · GIT · </span>
          ))}
        </div>
        <div
          className="skills-window"
          tabIndex="0"
          role="region"
          aria-label="Skill groups, scroll horizontally on small screens"
        >
          <div className="skills-track">
            {skills.map(({ name, tool, icon, items }) => {
              const Icon = icons[icon]
              return (
                <article key={name} className="skill-card">
                  <div className="skill-icon">
                    <Icon size={25} strokeWidth={1.4} />
                  </div>
                  <div className="skill-title">
                    <h3>{name}</h3>
                    <span className="mono">{tool}</span>
                  </div>
                  <ul>
                    {items.map((item, i) => (
                      <li key={item}>
                        <span>{item}</span>
                        <div aria-hidden="true" className="skill-rule">
                          <motion.i
                            initial={reduce ? false : { scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.06 }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
