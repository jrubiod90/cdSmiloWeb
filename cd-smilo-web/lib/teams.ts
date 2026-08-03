import { basePath } from '@/lib/config'

export type Sport = 'baloncesto' | 'voleibol'
export type Gender = 'female' | 'male' | 'mixed'

export type Category = {
  id: string
  name: string
  /** Birth-year range that defines the category, e.g. "2015 – 2016". */
  yearsEs: string
  yearsEn: string
  /** Earliest birth year in the category (omit for the open-ended senior band). */
  fromYear?: number
  /** Latest birth year in the category. */
  toYear: number
  /** Which team(s) exist for this category, female-first. */
  genders: Gender[]
}

// Baloncesto: benjamín (7-8 años) hasta senior.
export const basketballCategories: Category[] = [
  { id: 'benjamin', name: 'Benjamín', yearsEs: '2017 – 2019', yearsEn: 'Born 2017 – 2019', fromYear: 2017, toYear: 2019, genders: ['mixed'] },
  { id: 'alevin', name: 'Alevín', yearsEs: '2015 – 2016', yearsEn: 'Born 2015 – 2016', fromYear: 2015, toYear: 2016, genders: ['female', 'male'] },
  { id: 'infantil', name: 'Infantil', yearsEs: '2013 – 2014', yearsEn: 'Born 2013 – 2014', fromYear: 2013, toYear: 2014, genders: ['female', 'male'] },
  { id: 'cadete', name: 'Cadete', yearsEs: '2011 – 2012', yearsEn: 'Born 2011 – 2012', fromYear: 2011, toYear: 2012, genders: ['female', 'male'] },
  { id: 'junior', name: 'Junior', yearsEs: '2009 – 2010', yearsEn: 'Born 2009 – 2010', fromYear: 2009, toYear: 2010, genders: ['female', 'male'] },
  { id: 'senior', name: 'Senior', yearsEs: 'Antes de 2008', yearsEn: 'Born 2008 or earlier', toYear: 2008, genders: ['female', 'male'] },
]

// Voleibol: infantil (12-13 años) hasta senior.
export const volleyballCategories: Category[] = [
  { id: 'infantil', name: 'Infantil', yearsEs: '2013 – 2014', yearsEn: 'Born 2013 – 2014', fromYear: 2013, toYear: 2014, genders: ['female'] },
  { id: 'cadete', name: 'Cadete', yearsEs: '2011 – 2012', yearsEn: 'Born 2011 – 2012', fromYear: 2011, toYear: 2012, genders: ['female', 'mixed'] },
  { id: 'juvenil', name: 'Juvenil', yearsEs: '2008 – 2010', yearsEn: 'Born 2008 – 2010', fromYear: 2008, toYear: 2010, genders: ['female', 'mixed'] },
  { id: 'senior', name: 'Senior', yearsEs: 'Antes de 2007', yearsEn: 'Born 2007 or earlier', toYear: 2007, genders: ['female', 'male'] },
]

export const categoriesBySport: Record<Sport, Category[]> = {
  baloncesto: basketballCategories,
  voleibol: volleyballCategories,
}

/**
 * Deduce la categoría a partir del deporte y el año de nacimiento. Devuelve
 * `null` si el año no encaja en ninguna franja (p. ej. demasiado pequeño/a).
 */
export function categoryForYear(sport: Sport, birthYear: number): Category | null {
  return (
    categoriesBySport[sport].find(
      (c) => (c.fromYear == null || birthYear >= c.fromYear) && birthYear <= c.toYear,
    ) ?? null
  )
}

export type Team = {
  /** Stable unique id, e.g. "baloncesto-benjamin-mixed". */
  id: string
  sport: Sport
  categoryId: string
  gender: Gender
  /** Empty until the club confirms and announces the coach. */
  coach: string
  /** Cover image shown on the team card. */
  image: string
  /** Gallery shown in the carousel when the team is opened. */
  photos: string[]
}

// Only the coaches confirmed by the club so far; the rest stay blank until announced.
const coaches: Record<string, string> = {
  'baloncesto-senior-female': 'Coque Florido',
  'baloncesto-senior-male': 'Miguel Galdeano',
}

const images: Record<Sport, string> = {
  baloncesto: `${basePath}/images/basketball.png`,
  voleibol: `${basePath}/images/volleyball.png`,
}

/**
 * Placeholder gallery for a team.
 *
 * These reuse existing images so the carousel renders immediately. To use real
 * photos, drop files in `public/images/teams/` and return their paths here, e.g.
 *   [`${basePath}/images/teams/${sport}-${categoryId}-${gender}-1.jpg`, ...]
 */
function buildPhotos(sport: Sport): string[] {
  return [images[sport], `${basePath}/images/team.png`, `${basePath}/images/facility.png`]
}

function buildTeams(): Team[] {
  const sports: Sport[] = ['baloncesto', 'voleibol']
  const teams: Team[] = []

  for (const sport of sports) {
    for (const category of categoriesBySport[sport]) {
      for (const gender of category.genders) {
        const id = `${sport}-${category.id}-${gender}`
        teams.push({
          id,
          sport,
          categoryId: category.id,
          gender,
          coach: coaches[id] ?? '',
          image: images[sport],
          photos: buildPhotos(sport),
        })
      }
    }
  }
  return teams
}

export const teams: Team[] = buildTeams()

export function teamsBySport(sport: Sport): Team[] {
  return teams.filter((team) => team.sport === sport)
}
