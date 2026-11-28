import React, { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import gsap from 'gsap'
import {
  SiCss3, SiExpress, SiFastapi, SiGit, SiGithub, SiHtml5, SiJavascript, SiMongodb,
  SiMysql, SiNodedotjs, SiOpenai, SiPostman, SiPython, SiReact, SiTailwindcss, SiVisualstudiocode,
} from 'react-icons/si'
import ollamaLogo from '../../assets/skills/ollama.svg'
import { skills } from '../data/skills'

const rows = [
  [skills[0], skills[2]],
  [skills[1], skills[3]],
]
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

function SkillRow({ groups, direction }) {
  const row = useRef(null)
  const track = useRef(null)
  const targetSpeed = useRef(direction)
  const position = useRef(0)
  const visible = useInView(row)

  useEffect(() => {
    if (!visible) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let speed = targetSpeed.current
      const advance = (_, elapsed) => {
        const seconds = Math.min(elapsed, 64) / 1000
        speed += (targetSpeed.current - speed) * (1 - Math.exp(-8 * seconds))
        // The second copy starts halfway along the track, so wrapping here is seamless.
        position.current = gsap.utils.wrap(-50, 0, position.current + speed * seconds * 1.5)
        track.current.style.transform = `translate3d(${position.current}%, 0, 0)`
      }
      gsap.ticker.add(advance)
      return () => gsap.ticker.remove(advance)
    })
    return () => media.revert()
  }, [visible])

  const steer = (event) => {
    if (event.pointerType !== 'mouse') return
    const bounds = row.current.getBoundingClientRect()
    const relativeX = (event.clientX - bounds.left) / bounds.width
    targetSpeed.current = (relativeX - 0.5) * 5
  }
  const items = groups.flatMap((group) => group.items.flatMap((item) => item.split(' & ')))
  return (
    <div
      ref={row}
      className="skills-row"
      role="region"
      aria-label={groups.map((group) => group.name).join(', ')}
      tabIndex={0}
      onPointerMove={steer}
      onPointerLeave={() => { targetSpeed.current = direction }}
    >
      <div ref={track} className="skills-track">
        {[false, true].map((copy) => (
          <ul key={String(copy)} aria-hidden={copy || undefined}>
            {items.map((name) => (
              <li key={name} className="skill-card">
                <SkillLogo name={name} />
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
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
        <div className="skills-window">
          {rows.map((groups, index) => (
            <SkillRow key={groups[0].name} groups={groups} direction={index === 0 ? -1 : 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
