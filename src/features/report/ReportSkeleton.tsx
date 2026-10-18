// Shown while GitHub computes stats/* (it answers 202 until ready). Skeletons, not spinners.
import { EraCell } from './era'

const Bone = ({ className }: { className: string }) => <div className={`skeleton ${className}`} />

function CellBones({ era }: { era: 'pre' | 'post' }) {
  return (
    <EraCell era={era}>
      <Bone className="h-10 w-2/3 sm:h-14" />
      <Bone className="h-16 w-full" />
      <Bone className="h-24 w-full sm:h-36" />
    </EraCell>
  )
}

export function ReportSkeleton({ message = 'Reading your GitHub metadata…' }: { message?: string }) {
  return (
    <div aria-busy="true" aria-live="polite" className="bg-base-100">
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-base-300 bg-base-100/95 px-4 py-3 sm:px-8">
        <p className="text-base font-extrabold tracking-tight sm:text-lg">Pre<span className="text-muted">/</span>Post</p>
        <Bone className="h-7 w-7 shrink-0 rounded-full" />
        <Bone className="h-4 w-24" />
      </div>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
        <p className="font-now-mono text-[11px] uppercase tracking-[0.2em] text-muted">{message}</p>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex flex-col gap-4">
            <Bone className="h-12 w-full sm:h-20" />
            <Bone className="h-12 w-3/4 sm:h-20" />
            <Bone className="h-6 w-1/2" />
          </div>
          <Bone className="h-64 w-full" />
        </div>
        <Bone className="h-10 w-full" />
      </div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1/2 bg-pre-tint" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-post-tint" />
        <div className="relative grid grid-cols-2">
          <div className="col-span-2 h-10 bg-bar" />
          <CellBones era="pre" />
          <CellBones era="post" />
          <div className="col-span-2 h-10 bg-bar" />
          <CellBones era="pre" />
          <CellBones era="post" />
        </div>
      </div>
    </div>
  )
}
