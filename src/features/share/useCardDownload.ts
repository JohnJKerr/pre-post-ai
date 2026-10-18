import { useCallback, useState, type RefObject } from 'react'

/** Renders a full-size card node to PNG and saves it. */
export function useCardDownload(ref: RefObject<HTMLElement | null>, filename: string) {
  const [busy, setBusy] = useState(false)
  const download = useCallback(async () => {
    if (!ref.current) return
    setBusy(true)
    try {
      // loaded on first use: only people who download a card need it
      const { toPng } = await import('html-to-image')
      const url = await toPng(ref.current, { pixelRatio: 1, cacheBust: true })
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    } finally {
      setBusy(false)
    }
  }, [ref, filename])
  return { download, busy }
}
