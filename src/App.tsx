import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { GeneratingPage } from './pages/GeneratingPage'
import { HomePage } from './pages/HomePage'
import { ReportSkeleton } from './features/report/ReportSkeleton'
import { NotFoundPage } from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: (count, error) => count < 2 && !('status' in error && [404].includes(error.status as number)) } },
})

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  // the API sends a bad cut-off back here, with ?error=
  { path: '/generate', element: <HomePage /> },
  // sign-in lands here, with ?id= for the generation to poll
  { path: '/generating', element: <GeneratingPage /> },
  {
    path: '/sample',
    lazy: async () => ({ Component: (await import('./pages/SamplePage')).SamplePage }),
    hydrateFallbackElement: <ReportSkeleton />,
  },
  // the report pages carry the charts and share cards, so they load only when needed
  {
    path: '/r/:handle',
    lazy: async () => ({ Component: (await import('./pages/ReportPage')).ReportPage }),
    hydrateFallbackElement: <ReportSkeleton />,
  },
  { path: '*', element: <NotFoundPage /> },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
