import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { API_MOCK } from './api/config'
import './index.css'

// MSW serves the reports API unless VITE_API_MOCK=false.
async function startMocks() {
  if (!API_MOCK) return
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}

startMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
