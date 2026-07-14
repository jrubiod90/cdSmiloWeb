/**
 * Season registration switch.
 *
 * Set to `true` when trials are done and players who passed should be able to
 * fill in the registration form at /inscripcion. Set to `false` in the off-season
 * to show trial info instead of the form.
 *
 * You can also drive this from an env var without touching code:
 *   NEXT_PUBLIC_SEASON_OPEN=true
 */
export const seasonOpen: boolean =
  process.env.NEXT_PUBLIC_SEASON_OPEN !== 'false'

/**
 * Base path the site is served under (e.g. '/cdSmiloWeb' on GitHub Pages, '' locally
 * and on Vercel). Must match `basePath` in next.config.mjs. `next/image` doesn't
 * prepend it automatically when `images.unoptimized` is set, so any hand-built image
 * src under /public needs `${basePath}/...`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
