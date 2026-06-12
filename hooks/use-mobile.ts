import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Avoid synchronous setState in effect body if possible, or leave it for initial setup
    const initialIsMobile = window.innerWidth < MOBILE_BREAKPOINT
    if (isMobile !== initialIsMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobile(initialIsMobile)
    }
    return () => mql.removeEventListener("change", onChange)
  }, [isMobile])

  return !!isMobile
}
