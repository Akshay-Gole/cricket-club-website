import { useState, useEffect } from 'react'

// Returns a "delayed" version of a value — only updates after the value
// stops changing for `delay` ms. Used so search filtering doesn't run on every keystroke.
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // cancel if value changes before delay
  }, [value, delay])

  return debounced
}

export default useDebounce
