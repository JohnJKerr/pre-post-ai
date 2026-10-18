import { useRef, useState } from 'react'
import type { Report } from '../../api/contract'
import { ShareCard } from '../share/ShareCard'
import { SharePanel, type ShareSettings } from '../share/SharePanel'
import { useCardDownload } from '../share/useCardDownload'
import { Comparison } from './Comparison'
import { shareText } from './copy'
import { MethodFooter } from './MethodFooter'
import { ReportHeader } from './ReportHeader'
import { Summary } from './Summary'

interface ReportViewProps {
  report: Report
  /** absolute link to this report, for sharing */
  link: string
}

export function ReportView({ report, link }: ReportViewProps) {
  const [share, setShare] = useState<ShareSettings>(() => ({ size: 'wide', showHandle: true, text: shareText(report) }))
  const cardRef = useRef<HTMLDivElement>(null)
  const { download, busy } = useCardDownload(cardRef, `prepost-${report.handle}-${share.size}.png`)

  return (
    <div data-theme="now" className="overflow-x-clip bg-base-100 font-now text-base-content">
      <ReportHeader
        handle={report.handle}
        isSample={report.isSample}
        sharePanel={<SharePanel report={report} link={link} settings={share} onChange={setShare} />}
        onDownload={download}
        downloading={busy}
        onCopyLink={() => navigator.clipboard.writeText(link)}
      />
      <Summary report={report} />
      <Comparison report={report} />
      <MethodFooter weeks={report.weeks} isSample={report.isSample} />

      {/* full-size card, off screen, for the PNG download */}
      <div aria-hidden="true" inert className="pointer-events-none fixed top-0 left-[-20000px]">
        <ShareCard ref={cardRef} report={report} size={share.size} showHandle={share.showHandle} link={link} />
      </div>
    </div>
  )
}
