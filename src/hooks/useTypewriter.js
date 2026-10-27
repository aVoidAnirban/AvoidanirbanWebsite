import { useState, useEffect } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useTypewriter(words, typingSpeed = 120, pauseMs = 2500) {
  const reducedMotion = usePrefersReducedMotion()
  const [display, setDisplay] = useState(words[0] ?? '')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(words[0] ?? '')
      return
    }

    const current = words[wordIndex % words.length]
    let pauseTimer

    const timeout = setTimeout(
      () => {
        if (document.hidden) return

        if (!deleting) {
          if (charIndex < current.length) {
            setDisplay(current.slice(0, charIndex + 1))
            setCharIndex((c) => c + 1)
          } else {
            pauseTimer = setTimeout(() => setDeleting(true), pauseMs)
          }
        } else if (charIndex > 0) {
          setDisplay(current.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setDeleting(false)
          setWordIndex((w) => (w + 1) % words.length)
        }
      },
      deleting ? typingSpeed / 2 : typingSpeed
    )

    return () => {
      clearTimeout(timeout)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [charIndex, deleting, wordIndex, words, typingSpeed, pauseMs, reducedMotion])

  return display
}
