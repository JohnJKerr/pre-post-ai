import { authApi } from '../../api/reports'

/** Starts the GitHub App sign-in. A plain link: the API redirects to GitHub and back to /generate. */
export function ConnectGitHub() {
  return (
    <div className="flex flex-col gap-3">
      <a href={authApi.signInUrl('/generate')} className="btn btn-neutral w-full sm:w-fit">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.66 3.96.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
        </svg>
        Connect GitHub
      </a>
      <p className="text-sm text-muted">
        Read-only access to repository metadata. No code. You choose which repos count, and you can uninstall the app afterwards: your report stays.
      </p>
    </div>
  )
}
