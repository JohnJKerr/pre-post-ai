// Share intent links. No platform logos: add licensed icons if wanted.

export function shareLinks(text: string, url: string) {
  const withUrl = `${text} ${url}`
  return [
    { name: 'X', href: `https://x.com/intent/post?${new URLSearchParams({ text, url })}` },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}` },
    { name: 'Bluesky', href: `https://bsky.app/intent/compose?${new URLSearchParams({ text: withUrl })}` },
  ]
}

export const reportUrl = (id: string, origin = window.location.origin) => `${origin}/r/${id}`
