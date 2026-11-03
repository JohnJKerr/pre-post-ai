/** Every page ends with this: a plain, followed link back to the DevelopKerr project page. */
export function SiteFooter() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-4 font-now-mono text-xs text-muted sm:px-8">
        <a href="https://developkerr.com/projects/shift" className="link link-hover">Built by DevelopKerr</a>
      </div>
    </footer>
  )
}
