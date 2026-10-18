// Mock sign-in. The real API signs in through GitHub (a full-page redirect a service worker
// can't stand in for), then starts a generation and sends the browser to /generating?id=….
// Here the form records the generation itself, and the mock GET /generations/:id plays it out.
export interface MockGeneration {
  handle: string
  cutoff: string
  startedAt: number
  /** set once the mock has generated the report */
  done?: boolean
}

const KEY = 'prepost:generation:'
const memory = new Map<string, MockGeneration>()

export function saveGeneration(id: string, generation: MockGeneration) {
  memory.set(id, generation)
  try {
    localStorage.setItem(KEY + id, JSON.stringify(generation))
  } catch {
    // storage blocked: memory only
  }
}

export function loadGeneration(id: string): MockGeneration | undefined {
  try {
    const raw = localStorage.getItem(KEY + id)
    if (raw) return JSON.parse(raw)
  } catch {
    // storage blocked: fall back to memory
  }
  return memory.get(id)
}

/** Starts a mock generation and returns its id: 32 hex characters, like the API's. */
export function mockSignIn(handle: string, cutoff: string) {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
  saveGeneration(id, { handle, cutoff, startedAt: Date.now() })
  return id
}

const HANDLE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
export const isHandle = (text: string) => HANDLE.test(text)
