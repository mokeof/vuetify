export default function (expandedParentClass = '') {
  return {
    enter (el) {
      el._parent = el.parentNode
      const initialStyle = el._initialStyle = {
        transition: el.style.transition,
        visibility: el.style.visibility,
        overflow: el.style.overflow,
        height: el.style.height
      }

      el.style.setProperty('transition', 'none', 'important')
      el.style.visibility = 'hidden'
      const height = `${el.offsetHeight}px`
      el.style.visibility = initialStyle.visibility
      el.style.overflow = 'hidden'
      el.style.height = 0
      void el.offsetHeight // force reflow
      el.style.transition = initialStyle.transition

      expandedParentClass && el._parent.classList.add(expandedParentClass)

      requestAnimationFrame(() => {
        el.style.height = height
      })
    },

    afterEnter (el) {
      resetStyles(el)
    },

    leave (el) {
      el._initialStyle = {
        overflow: el.style.overflow,
        height: el.style.height
      }

      el.style.overflow = 'hidden'
      el.style.height = `${el.offsetHeight}px`

      requestAnimationFrame(() => el.style.height = 0)
    },

    afterLeave (el) {
      expandedParentClass && el._parent && el._parent.classList.remove(expandedParentClass)
      resetStyles(el)
    }
  }
}

function resetStyles (el) {
  el.style.overflow = el._initialStyle.overflow
  el.style.height = el._initialStyle.height
  delete el._initialStyle
}
