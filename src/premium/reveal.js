// v-reveal: блок мягко выплывает, когда попадает в экран. Без IntersectionObserver и при
// «уменьшении движения» блок просто показан сразу, поэтому контент никогда не остаётся скрытым.
let observer
function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-in')
      observer.unobserve(entry.target)
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  return observer
}

export const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value?.delay) el.style.setProperty('--reveal-delay', `${binding.value.delay}ms`)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return }
    getObserver().observe(el)
  },
  unmounted(el) { observer?.unobserve(el) },
}
