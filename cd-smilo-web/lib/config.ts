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
