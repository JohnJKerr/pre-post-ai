import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { HomePage } from './pages/HomePage'
import { ReportSkeleton } from './features/report/ReportSkeleton'
import { NotFoundPage } from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: (count, error) => count < 2 && !('status' in error && [401, 404, 422].includes(error.status as number)) } },
})

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
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
