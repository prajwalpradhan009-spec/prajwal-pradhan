import React from 'react'
import { Download } from 'lucide-react'
import { profile } from '../data/profile'
import { timeline } from '../data/timeline'

export default function About() {
  const magnet = (e) => {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.translate =
      (e.clientX - r.left - r.width / 2) * 0.12 +
      'px ' +
      (e.clientY - r.top - r.height / 2) * 0.12 +
      'px'
  }
  return (
    <section id="about" className="about dark-section">
      <div className="section-wrap about-layout">
        <figure className="about-photo">
          <img
            src={profile.workspace}
            loading="lazy"
            width="900"
            height="900"
            alt="Prajwal at his desk"
          />
          <figcaption className="mono">
            {profile.name} <span>India / IST</span>
          </figcaption>
        </figure>
        <div className="about-copy">
          <div className="kicker">
            <i className="signal" />
            About me
          </div>
          <h2 className="about-bio">
            {profile.bio.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                <span className="bio-word">{word}</span>{' '}
              </React.Fragment>
            ))}
          </h2>
          <div id="learning" className="timeline">
            <i aria-hidden="true" className="timeline-line" />
            {timeline.map((t) => (
              <div key={t.title} className="timeline-entry">
                <small className="mono">{t.date}</small>
                <h3>{t.title}</h3>
                <p>{t.place}</p>
              </div>
            ))}
          </div>
          <ul className="chips about-chips">
            <li>BCA student</li>
            <li>Python tinkerer</li>
            <li>Full-stack builder</li>
          </ul>
          <a
            className="pill cv-link"
            href={profile.cv}
            download="Prajwal-Pradhan-CV.pdf"
            onPointerMove={magnet}
            onPointerLeave={(e) => {
              e.currentTarget.style.translate = ''
            }}
          >
            <Download size={16} />
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}
