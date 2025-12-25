import { useEffect, useRef, useState } from 'react'

// Small helper hook using Intersection Observer to know when an element
// is mostly visible in the viewport.
export function useInView(options = { threshold: 0.6 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      options,
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, inView }
}


