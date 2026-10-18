export type CardSize = 'wide' | 'square'
export const CARD_SIZE: Record<CardSize, { width: number; height: number; label: string }> = {
  wide: { width: 1200, height: 630, label: 'Wide · 1200×630' },
  square: { width: 1080, height: 1080, label: 'Square · 1080×1080' },
}
