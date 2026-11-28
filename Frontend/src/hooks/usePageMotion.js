import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

export function usePageMotion(page) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add(
      '(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)',
      () => {
        const root = page.current
        const scroll = new Lenis({
          anchors: true,
          duration: 0.85,
          prevent: (el) => !!el.closest('dialog'),
        })
        const tick = (seconds) => scroll.raf(seconds * 1000)
        scroll.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(tick)

        gsap.to('.hero-letter', {
          x: (i) => (i - 4) * 12,
          scale: 1.09,
          ease: 'none',
          scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom 10%', scrub: true },
        })
        gsap.to('.hero-figure', {
          yPercent: 7,
          scale: 1.055,
          opacity: 0.65,
          ease: 'none',
          scrollTrigger: { trigger: '#home', start: '15% top', end: 'bottom top', scrub: true },
        })
        const stage = root.querySelector('.skills-stage'),
          track = root.querySelector('.skills-track')
        const travel = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth)
        gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'center center',
            end: () => '+=' + Math.max(travel(), 300),
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        const cards = gsap.utils.toArray('.project-card', root)
        cards
          .slice(0, -1)
          .forEach((card, index) =>
            gsap.to(card, {
              scale: 0.965,
              filter: 'brightness(.78)',
              transformOrigin: 'center 8%',
              scrollTrigger: {
                trigger: cards[index + 1],
                start: 'top 85%',
                end: 'top 17%',
                scrub: true,
              },
            })
          )
        gsap.from('.bio-word', {
          opacity: 0.22,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-bio',
            start: 'top 85%',
            end: 'bottom 57%',
            scrub: true,
          },
        })
        gsap.from('.about-photo', {
          clipPath: 'inset(20% 25% round 50%)',
          scrollTrigger: {
            trigger: '.about-photo',
            start: 'top 90%',
            end: 'center 55%',
            scrub: true,
          },
        })
        gsap.from('.timeline-line', {
          scaleY: 0,
          transformOrigin: 'top',
          scrollTrigger: { trigger: '.timeline', start: 'top 80%', end: 'bottom 60%', scrub: true },
        })
        gsap.from('.contact-inner', {
          y: -80,
          clipPath: 'inset(0 0 14% 0)',
          ease: 'none',
          scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'top 30%', scrub: true },
        })
        let alive = true
        const activitySize = new ResizeObserver(() => ScrollTrigger.refresh())
        activitySize.observe(root.querySelector('#github'))
        document.fonts.ready.then(() => {
          if (alive) ScrollTrigger.refresh()
        })
        return () => {
          alive = false
          activitySize.disconnect()
          gsap.ticker.remove(tick)
          scroll.destroy()
        }
      },
      page
    )
    return () => media.revert()
  }, [page])
}
