const art = [
  { file: 'artisan', description: 'An artisan crafting at a desk' },
  { file: 'apprentice', description: 'An artisan mentoring an apprentice at a desk' },
  { file: 'robot-arms', description: 'An artisan working with two extra robot arms' },
  { file: 'cyborg', description: 'A cyborg developer with a red mechanical eye' },
  { file: 'machine', description: 'A fully mechanical robot working at a desk' },
  { file: 'uprising', description: 'Rows of robots marching together' },
] as const

export function VerdictArt({ rung, className = 'h-64 w-64' }: { rung: number; className?: string }) {
  const { file, description } = art[rung] ?? art[0]
  return <img src={`/verdicts/${file}.webp`} alt={description} width={900} height={900} loading="eager" decoding="async" className={`object-contain ${className}`} />
}
