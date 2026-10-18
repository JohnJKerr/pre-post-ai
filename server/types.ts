// Raw metadata the back end gathers from GitHub with the App's single "Metadata: read"
// permission plus the contribution calendar, and stores per user. Reports are built from it.
import type { Cutoff, Era, PunchCell, Week } from '../src/api/contract'

export type { Cutoff, Era, PunchCell, Week }
export { ERAS } from '../src/api/contract'

export interface RepoActivity {
  name: string
  /** private repos keep their name server-side; reports show them unnamed */
  isPrivate?: boolean
  /** byte shares per language from /languages, current snapshot */
  languages: Record<string, number>
  /** share of the author's lines added in each window */
  share: Record<Era, number>
  /** punch-card eligible for this era: author wrote >= 90% of commits and all activity sits on one side */
  punchCard: Era | null
  /** repo created_at falls inside this window */
  startedIn: Era | null
}

/** One user's stored activity for one cut-off. */
export interface ProfileData {
  handle: string
  isSample: boolean
  generatedAt: string
  cutoff: Cutoff
  repos: RepoActivity[]
  /** weeks from /stats/contributors, Sunday-start */
  weekly: Record<Era, Week[]>
  /** /stats/punch_card summed over eligible repos */
  punchCard: Record<Era, PunchCell[]>
  activeDays: Record<Era, number>
  /** eligible repos' share of the author's commits in each window */
  punchShare: Record<Era, number>
}
