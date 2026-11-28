import { useCallback, useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { apiBase } from '../api'

const ttl = 300000
const key = 'pp:github:v1:' + profile.github
function cached() {
  try {
    const value = JSON.parse(sessionStorage.getItem(key))
    return value?.data?.profile && Array.isArray(value.data.repositories) ? value : null
  } catch {
    return null
  }
}
export function useGithub(enabled) {
  const [record, setRecord] = useState(cached)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((i) => i + 1), [])
  useEffect(() => {
    if (!enabled) return
    const abort = new AbortController()
    let timer
    const refresh = async () => {
      setError(false)
      try {
        const response = await fetch(apiBase + '/github', { signal: abort.signal })
        if (!response.ok) throw new Error('GitHub unavailable')
        const data = await response.json()
        if (!data.ok || !data.profile || !Array.isArray(data.repositories))
          throw new Error('Missing profile')
        const value = { time: Date.now(), data }
        if (abort.signal.aborted) return
        setRecord(value)
        try {
          sessionStorage.setItem(key, JSON.stringify(value))
        } catch {}
      } catch {
        if (!abort.signal.aborted) setError(true)
      }
      if (!abort.signal.aborted) timer = setTimeout(refresh, ttl)
    }
    const remaining = (cached()?.time || 0) + ttl - Date.now()
    if (remaining > 0 && !attempt) timer = setTimeout(refresh, remaining)
    else refresh()
    return () => {
      abort.abort()
      clearTimeout(timer)
    }
  }, [enabled, attempt])
  return { record, error, retry }
}
