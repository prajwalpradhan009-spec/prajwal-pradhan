import React, { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll } from 'framer-motion'

export function Count({ value, pad = false }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(value)
  useEffect(() => {
    if (!visible || reduce) {
      setN(value)
      return
    }
    const counter = animate(0, value, {
      duration: 0.85,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => counter.stop()
  }, [visible, reduce, value])
  return <span ref={ref}>{pad ? String(n).padStart(2, '0') : n}</span>
}
export function Preloader() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(() => {
    try {
      return !!sessionStorage.getItem('pp:intro')
    } catch {
      return false
    }
  })
  const number = useRef(null)
  useEffect(() => {
    if (done || reduce) return
    const control = animate(0, 100, {
      duration: 0.42,
      onUpdate: (n) => {
        if (number.current) number.current.textContent = Math.round(n) + '%'
      },
    })
    const timer = setTimeout(() => {
      setDone(true)
      try {
        sessionStorage.setItem('pp:intro', '1')
      } catch {}
    }, 680)
    return () => {
      control.stop()
      clearTimeout(timer)
    }
  }, [done, reduce])
  return done || reduce ? null : (
    <div className="loader" aria-hidden="true">
      <b>
        PP<span>.</span>
      </b>
      <span className="mono" ref={number}>
        0%
      </span>
    </div>
  )
}
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
export function Cursor() {
  const node = useRef(null)
  useEffect(() => {
    const fine = matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)')
    const move = (event) => {
      if (!fine.matches || !node.current) return
      const view = !!event.target.closest('[data-view]')
      node.current.dataset.mode = view
        ? 'view'
        : event.target.closest('a,button,input,textarea')
        ? 'action'
        : 'dot'
      node.current.style.transform =
        'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0)'
      node.current.style.visibility = 'visible'
    }
    const hide = () => {
      if (node.current) node.current.style.visibility = 'hidden'
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', hide)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
    }
  }, [])
  return (
    <div className="cursor" ref={node} aria-hidden="true">
      <span>View</span>
    </div>
  )
}
