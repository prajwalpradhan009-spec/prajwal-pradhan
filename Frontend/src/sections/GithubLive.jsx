import React, { Suspense, lazy, useRef } from 'react'
import { useInView, motion, useReducedMotion } from 'framer-motion'
import { Github, GitFork, Star, BookMarked, RefreshCw } from 'lucide-react'
import { Count } from '../components/Chrome'
import { profile } from '../data/profile'
import { useGithub } from '../hooks/useGithub'

const Calendar = lazy(() => import('react-github-calendar'))
const palette = ['#32322f', '#76381e', '#ac461e', '#e96126', '#ff965f']
function CalendarView({ data, refreshed }) {
  const cal = data.contributions
  const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
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
      >
        {cal?.weeks ? (
          <>
            <div className="heatmap">
              {cal.weeks.map((week, x) => (
                <div key={week.firstDay}>
                  {week.contributionDays.map((day) => (
                    <i
                      key={day.date}
                      title={day.date + ' · ' + day.contributionCount + ' contributions'}
                      style={{
                        gridRow: day.weekday + 1,
                        background: palette[Math.max(0, levels.indexOf(day.contributionLevel))],
                        '--wave': (x + day.weekday) * 9 + 'ms',
                      }}
                    />
                  ))}
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
              theme={{ dark: palette }}
              colorScheme="dark"
              blockSize={11}
              blockMargin={4}
              fontSize={13}
              errorMessage="The contribution calendar is temporarily unavailable."
              renderBlock={(block, day) =>
                React.cloneElement(block, {
                  className: 'heat-cell',
                  style: {
                    '--wave':
                      new Date(day.date).getUTCDay() * 21 + Number(day.date.slice(-2)) * 5 + 'ms',
                  },
                })
              }
            />
          </Suspense>
        )}
      </div>
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
            <div className="gh-overview">
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
            <div className="gh-stats">
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
                        background: palette[4 - i],
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
