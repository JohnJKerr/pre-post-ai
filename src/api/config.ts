// Where the API lives. Production runs it on its own subdomain
// (VITE_API_URL=https://shift-api.developkerr.com/api); unset, it is /api on this origin.
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
