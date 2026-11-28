import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Asterisk } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useChat } from './useChat'

export default function Chatbot({ active }) {
  const { messages, pending, send } = useChat()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const panel = useRef(null),
    log = useRef(null),
    input = useRef(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (open && log.current) log.current.scrollTop = log.current.scrollHeight
  }, [open, pending, messages])
  const submit = (e) => {
    e.preventDefault()
    if (!pending && text.trim()) {
      send(text)
      setText('')
      input.current?.focus()
    }
  }
  const openChat = () => {
    panel.current.showModal()
    setOpen(true)
  }
  return (
    <div className={'chat-root on-' + active}>
      <button
        aria-label="Ask Prajwal’s assistant"
        className="chat-launch"
        aria-expanded={open}
        aria-controls="portfolio-chat"
        onClick={openChat}
      >
        <MessageCircle size={24} />
      </button>
      <dialog
        id="portfolio-chat"
        className="chat-panel"
        ref={panel}
        aria-labelledby="chat-title"
        data-lenis-prevent
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === panel.current) {
            const b = panel.current.getBoundingClientRect()
            if (
              e.clientX < b.left ||
              e.clientX > b.right ||
              e.clientY < b.top ||
              e.clientY > b.bottom
            )
              panel.current.close()
          }
        }}
      >
        {open && (
          <motion.div
            className="chat-sheet"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <header>
              <span className="chat-mark">
                <Asterisk size={25} />
              </span>
              <div>
                <h2 id="chat-title">Ask about Prajwal</h2>
                <p>Portfolio assistant</p>
              </div>
              <button aria-label="Close chat" onClick={() => panel.current.close()} autoFocus>
                <X size={19} />
              </button>
            </header>
            <div ref={log} className="chat-log" role="log" aria-live="polite">
              <p className="bubble">Hi! Ask me about Prajwal’s projects, skills or availability.</p>
              {messages.map((m, i) => (
                <p key={i} className={'bubble ' + m.role}>
                  <span className="sr-only">{m.role === 'user' ? 'You' : 'Assistant'}: </span>
                  {m.text}
                </p>
              ))}
              {pending && (
                <p className="bubble typing" aria-label="Assistant is typing">
                  •••
                </p>
              )}
            </div>
            <div className="quick-replies">
              {['Show projects', 'Your skills?', 'Hire you?', 'Contact'].map((q) => (
                <button key={q} disabled={pending} onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={submit}>
              <input
                aria-label="Your question"
                value={text}
                ref={input}
                maxLength={2000}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask a question…"
              />
              <button aria-label="Send question" disabled={pending || !text.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </dialog>
    </div>
  )
}
