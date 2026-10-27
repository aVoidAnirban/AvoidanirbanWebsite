export function rafThrottle(fn) {
  let scheduled = false
  return (...args) => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      fn(...args)
    })
  }
}
