import addonDocs from '@storybook/addon-docs'
import { definePreview } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import addonMsw from 'msw-storybook-addon'
import { useState, type ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { handlers } from '../src/mocks/handlers'
import '../src/index.css'

function FreshQueryClient({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default definePreview({
  addons: [addonDocs(), addonMsw()],
  parameters: {
    layout: 'fullscreen',
    // `route` is the URL a story opens at; `path` is the route pattern that renders it
    route: '/',
    path: '*',
  },
  // the app's mock API, so page stories work unless a story overrides a handler
  beforeEach({ msw }) {
    msw.use(...handlers)
  },
  decorators: [
    (Story, { parameters }) => (
      <FreshQueryClient>
        <MemoryRouter initialEntries={[parameters.route]}>
          <Routes>
            <Route path={parameters.path} element={<Story />} />
            <Route path="*" element={<p className="p-8 font-now">Navigated away from the story.</p>} />
          </Routes>
        </MemoryRouter>
      </FreshQueryClient>
    ),
  ],
})
