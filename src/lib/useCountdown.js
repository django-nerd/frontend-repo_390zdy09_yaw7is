import { useEffect, useState } from 'react'

// Returns { hours, minutes, seconds, done }
export function useCountdown(hoursFromNow = 72) {
  const [end] = useState(() => Date.now() + hoursFromNow * 60 * 60 * 1000)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const ms = Math.max(0, end - now)
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const done = totalSeconds <= 0

  return { hours, minutes, seconds, done }
}
