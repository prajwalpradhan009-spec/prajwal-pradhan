import React, { Suspense, lazy, useEffect, useRef } from 'react'
import { useInView, motion, useReducedMotion } from 'framer-motion'
import { Github, GitFork, Star, BookMarked, RefreshCw } from 'lucide-react'
import { Count } from '../components/Chrome'
import { profile } from '../data/profile'
import { useGithub } from '../hooks/useGithub'

const Calendar = lazy(() => import('react-github-calendar'))
const languagePalette = ['#FF531A', '#0D0D0D', '#595650', '#817C74']
const calendarPalette = ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39']
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
const mouseMotion = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

function followPointer(event) {
  if (event.pointerType !== 'mouse' || !window.matchMedia(mouseMotion).matches) return
  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  card.style.setProperty('--gh-x', (event.clientX - bounds.left) / bounds.width - 0.5)
  card.style.setProperty('--gh-y', (event.clientY - bounds.top) / bounds.height - 0.5)
  card.dataset.tracking = 'true'
}

function resetPointer(event) {
  const card = event.currentTarget
  delete card.dataset.tracking
  card.style.removeProperty('--gh-x')
  card.style.removeProperty('--gh-y')
}

const pointerEvents = {
  onPointerMove: followPointer,
  onPointerLeave: resetPointer,
  onPointerCancel: resetPointer,
}

function dayLabel(day) {
  const count = day.contributionCount ?? day.count
  return day.date + ' · ' + count + (count === 1 ? ' contribution' : ' contributions')
}

function contributionLevel(day) {
  const value = day.contributionLevel ?? day.level
  const level = levels.indexOf(value)
  if (level >= 0) return level
  if (Number.isInteger(value) && value >= 0 && value <= 4) return value
  const count = day.contributionCount ?? day.count ?? 0
  return Math.min(4, Math.ceil(count / 3))
}

function CalendarView({ data, refreshed }) {
  const cal = data.contributions
  const tooltip = useRef(null)
  const hideTooltip = () => { tooltip.current.hidden = true }
  const showTooltip = (event) => {
    const cell = event.target.closest('[data-gh-day]')
    if (!cell) return hideTooltip()
    const tip = tooltip.current
    const card = tip.parentElement
    const bounds = card.getBoundingClientRect()
    const square = cell.getBoundingClientRect()
    tip.textContent = cell.getAttribute('aria-label')
    tip.hidden = false
    const left = square.left - bounds.left + (square.width - tip.offsetWidth) / 2
    tip.style.left = Math.max(4, Math.min(left, card.clientWidth - tip.offsetWidth - 4)) + 'px'
    tip.style.top = square.top - bounds.top - tip.offsetHeight - 6 + 'px'
  }

  useEffect(() => {
    hideTooltip()
    const dismissOutside = (event) => {
      if (!tooltip.current.parentElement.contains(event.target)) hideTooltip()
    }
    document.addEventListener('pointerdown', dismissOutside)
    return () => document.removeEventListener('pointerdown', dismissOutside)
  }, [refreshed])

  return (
    <div className="activity-box">
      <h3>
        {cal ? cal.totalContributions.toLocaleString() + ' contributions' : 'Contribution calendar'}
      </h3>
      <div
        className="calendar-scroll"
        tabIndex="0"
        role="region"
        aria-label="GitHub contribution calendar"
        onPointerOver={showTooltip}
        onClick={showTooltip}
        onPointerLeave={hideTooltip}
        onScrollCapture={hideTooltip}
        onKeyDown={(event) => { if (event.key === 'Escape') hideTooltip() }}
      >
        {cal?.weeks ? (
          <>
            <div className="heatmap">
              {cal.weeks.map((week, x) => (
                <div key={week.firstDay}>
                  {week.contributionDays.map((day) => {
                    const level = contributionLevel(day)
                    return (
                      <i
                        key={day.date}
                        data-level={level}
                        data-gh-day=""
                        role="img"
                        aria-label={dayLabel(day)}
                        style={{
                          gridRow: day.weekday + 1,
                          background: calendarPalette[level],
                          '--wave': (x + day.weekday) * 9 + 'ms',
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            <small className="mono">Past 12 months</small>
          </>
        ) : (
          <Suspense fallback={<p>Loading contributions…</p>}>
            <Calendar
              key={refreshed}
              username={data.profile.username}
              year={new Date().getFullYear()}
              theme={{ light: calendarPalette }}
              transformData={(days) => days.map((day) => ({
                ...day, level: contributionLevel(day), label: dayLabel(day),
              }))}
              transformTotalCount={false}
              colorScheme="light"
              blockSize={11}
              blockMargin={4}
              fontSize={13}
              errorMessage="The contribution calendar is temporarily unavailable."
              renderBlock={(block, day) =>
                day.label ? React.cloneElement(block, {
                  className: 'heat-cell',
                  'data-gh-day': '',
                  role: 'img',
                  'aria-label': day.label,
                  style: {
                    ...block.props.style,
                    '--wave':
                      new Date(day.date).getUTCDay() * 21 + Number(day.date.slice(-2)) * 5 + 'ms',
                  },
                }) : block
              }
            />
          </Suspense>
        )}
      </div>
      <span ref={tooltip} role="tooltip" className="gh-tooltip" hidden />
    </div>
  )
}

export default function GithubLive() {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '250px 0px' })
  const reduce = useReducedMotion()
  const { record, error, retry } = useGithub(seen)
  const data = record?.data
  const languages = {}
  data?.repositories.forEach((r) => {
    if (r.language) languages[r.language] = (languages[r.language] || 0) + 1
  })
  const ordered = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
  return (
    <section id="github" className="github dark-section" ref={ref}>
      <div className="section-wrap">
        <div className="kicker">
          <i className="signal" />
          Open source
        </div>
        <div className="section-heading">
          <h2 className="section-title">
            GitHub, live<span>.</span>
          </h2>
          <a
            href={profile.socials.GitHub}
            target="_blank"
            rel="noreferrer"
            className="pill outline"
            {...pointerEvents}
          >
            <Github size={16} />
            Visit GitHub
          </a>
        </div>
        {error && (
          <div className="github-error" role="status">
            {data
              ? 'Showing the last saved activity.'
              : 'GitHub activity is temporarily unavailable.'}
            <button className="pill outline" onClick={retry}>
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}
        {!data && !error && (
          <div className="github-skeleton" role="status">
            Loading GitHub activity…
          </div>
        )}
        {data && (
          <>
            <div className="gh-overview" {...pointerEvents}>
              <div className="gh-person">
                <img
                  loading="lazy"
                  width="58"
                  height="58"
                  src={data.profile.avatarUrl || profile.portrait}
                  alt=""
                />
                <div>
                  <h3>{data.profile.name || data.profile.username}</h3>
                  <a href={data.profile.profileUrl}>@{data.profile.username}</a>
                </div>
              </div>
              <p>
                {data.profile.bio ||
                  'Full-stack development, Python tools and open-source projects.'}
              </p>
            </div>
            <div className="gh-stats" {...pointerEvents}>
              {[
                ['Public repos', data.stats.publicRepos],
                ['Followers', data.stats.followers],
                ['Following', data.stats.following],
                ['Stars earned', data.stats.totalStars],
              ].map(([label, n]) => (
                <div key={label}>
                  <b>
                    <Count value={n ?? 0} />
                  </b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <CalendarView data={data} refreshed={record.time} />
            {ordered.length > 0 && (
              <div className="language-strip">
                <span className="mono">Top languages</span>
                {ordered.map(([name, n], i) => (
                  <div key={name}>
                    <i
                      style={{
                        background: languagePalette[i],
                        height: 4,
                        width: 32 + (60 * n) / ordered[0][1] + '%',
                      }}
                    />
                    {name}
                  </div>
                ))}
              </div>
            )}
            <div className="repo-grid">
              {data.repositories.slice(0, 6).map((r, i) => (
                <motion.a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={reduce ? false : { y: 15, opacity: 0.4 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.045 }}
                >
                  <BookMarked size={18} />
                  <h3>{r.name}</h3>
                  {r.description && <p>{r.description}</p>}
                  <div className="repo-meta">
                    <span>{r.language || 'Repository'}</span>
                    <span>
                      <Star size={13} />
                      {r.stars}
                    </span>
                    <span>
                      <GitFork size={13} />
                      {r.forks}
                    </span>
                    {r.updatedAt && (
                      <time dateTime={r.updatedAt}>
                        {new Date(r.updatedAt).toLocaleDateString('en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
