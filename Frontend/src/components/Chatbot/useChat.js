import { useEffect, useRef, useState } from 'react'
import { localReply } from '../../data/assistant'
import { apiBase } from '../../api'

const key = 'pp:conversation:v1'
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return Array.isArray(saved)
      ? saved
          .filter((m) => ['user', 'model'].includes(m?.role) && typeof m.text === 'string')
          .slice(-40)
      : []
  } catch {
    return []
  }
}
export function useChat() {
  const [messages, setMessages] = useState(restore)
  const [pending, setPending] = useState(false)
  const current = useRef(null)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(messages.slice(-40)))
    } catch {}
  }, [messages])
  useEffect(() => () => current.current?.abort(), [])
  const send = async (raw) => {
    const message = raw.trim().slice(0, 2000)
    if (!message || current.current) return
    const controller = new AbortController()
    current.current = controller
    const history = messages.slice(-10).map((m) => ({ ...m, text: m.text.slice(0, 2000) }))
    setMessages((prev) => [...prev, { role: 'user', text: message }])
    setPending(true)
    const timeout = setTimeout(() => controller.abort('timeout'), 15000)
    let reply
    try {
      const res = await fetch(apiBase + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (typeof data.reply === 'string' && data.reply.trim()) reply = data.reply
    } catch {
      /* Local answers remain available offline. */
    } finally {
      clearTimeout(timeout)
      if (!controller.signal.aborted || controller.signal.reason === 'timeout') {
        setMessages((prev) =>
          [...prev, { role: 'model', text: reply || localReply(message) }].slice(-40)
        )
        setPending(false)
      }
      current.current = null
    }
  }
  return { messages, pending, send }
}
