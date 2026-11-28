import React from 'react'
import { Github, Globe, AudioLines, Monitor } from 'lucide-react'
import { projects } from '../data/projects'

function Artwork({ project }) {
  if (project.theme === 'store' || project.theme === 'pdf')
    return (
      <img
        loading="lazy"
        src={'/media/' + (project.theme === 'store' ? 'novacart' : 'northstar') + '.webp'}
        alt={project.title + ' brand artwork'}
      />
    )
  if (project.theme === 'voice')
    return (
      <div className="voice-art" aria-hidden="true">
        <AudioLines size={25} />
        <div className="waveform">
          {Array.from({ length: 43 }, (_, i) => (
            <i
              key={i}
              style={{ height: 12 + Math.abs(Math.sin(i * 1.71) * Math.cos(i * 0.22)) * 80 + '%' }}
            />
          ))}
        </div>
        <small className="mono">Whisper / Ollama / Kokoro</small>
      </div>
    )
  return (
    <div className="folio-art" aria-hidden="true">
      <Monitor size={22} />
      <b>DEVELOPER</b>
      <img src="/media/portrait.webp" alt="" className="cutout" loading="lazy" />
    </div>
  )
}
export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="section-wrap">
        <div className="kicker">
          <i className="signal" />
          Selected work
        </div>
        <div className="section-heading">
          <h2 className="section-title">
            Projects<span>.</span>
          </h2>
          <span className="mono">({String(projects.length).padStart(2, '0')} projects)</span>
        </div>
        <div className="project-stack">
          {projects.map((p, i) => (
            <article
              className={'project-card project-' + p.theme}
              key={p.repo}
              style={{ '--order': i }}
            >
              <div className="project-info">
                <p className="mono project-type">
                  {String(i + 1).padStart(2, '0')} <span>/</span> {p.category}
                </p>
                <h3>{p.title}</h3>
                <p className="description">{p.description}</p>
                <ul className="chips">
                  {p.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="project-links">
                  <a href={p.url} className="pill" target="_blank" rel="noreferrer">
                    <Github size={15} />
                    GitHub
                  </a>
                  {p.live && (
                    <a href={p.live} className="pill outline">
                      <Globe size={15} />
                      Live site
                    </a>
                  )}
                </div>
              </div>
              <a
                className="project-art"
                data-view
                href={p.url}
                target="_blank"
                rel="noreferrer"
                aria-label={'Explore ' + p.title + ' on GitHub'}
              >
                <Artwork project={p} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
