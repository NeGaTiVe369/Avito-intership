import { useEffect } from 'react'

type HotkeyHandler = (event: KeyboardEvent) => void

interface UseHotkeysOptions {
  enabled?: boolean
  ignoreInputElements?: boolean
}

export function useHotkeys(
  handlers: Record<string, HotkeyHandler>,
  options: UseHotkeysOptions = {}
) {
  const {
    enabled = true,
    ignoreInputElements = true,
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (ignoreInputElements) {
        const target = event.target as HTMLElement | null

        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable)
        ) {
          return
        }
      }

      const handler = handlers[event.key]
      if (handler) {
        handler(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, ignoreInputElements, handlers])
}
