import React from 'react'
import { AudioLines, LayoutTemplate, Server, Terminal } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  SiCss3, SiExpress, SiFastapi, SiGit, SiGithub, SiHtml5, SiJavascript, SiMongodb,
  SiMysql, SiNodedotjs, SiOpenai, SiPostman, SiPython, SiReact, SiTailwindcss, SiVisualstudiocode,
} from 'react-icons/si'
import ollamaLogo from '../../assets/skills/ollama.svg'
import { skills } from '../data/skills'

const icons = { layout: LayoutTemplate, server: Server, audio: AudioLines, terminal: Terminal }
const brands = {
  React: [SiReact, '#61DAFB'],
  JavaScript: [SiJavascript, '#F7DF1E'],
  HTML: [SiHtml5, '#E34F26'],
  CSS: [SiCss3, '#1572B6'],
  'Tailwind CSS': [SiTailwindcss, '#06B6D4'],
  Git: [SiGit, '#F05032'],
  'Node.js': [SiNodedotjs, '#5FA04E'],
  Express: [SiExpress, '#FFFFFF'],
  MongoDB: [SiMongodb, '#47A248'],
  MySQL: [SiMysql, '#4479A1'],
  Python: [SiPython, '#3776AB'],
  FastAPI: [SiFastapi, '#009688'],
  Whisper: [SiOpenai, '#FFFFFF'],
  GitHub: [SiGithub, '#FFFFFF'],
  Postman: [SiPostman, '#FF6C37'],
  'VS Code': [SiVisualstudiocode, '#007ACC'],
}

function SkillLogo({ name }) {
  if (name === 'Ollama')
    return <img src={ollamaLogo} width="28" height="28" alt="Ollama logo" style={{ filter: 'invert(1)' }} />
  const [Logo, color] = brands[name]
  return <Logo size={28} color={color} role="img" aria-label={name + ' logo'} />
}

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
                        <span>
                          {item.split(' & ').map((name, index) => (
                            <React.Fragment key={name}>
                              {index > 0 && ' & '}
                              <SkillLogo name={name} />
                              {name}
                            </React.Fragment>
                          ))}
                        </span>
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
