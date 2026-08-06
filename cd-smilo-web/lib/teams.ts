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
  /** Optional distinguishing name (e.g. a second team in the same category). */
  label?: string
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

/**
 * Fotos reales por equipo (archivos en `public/images/teams/`). La primera es la
 * portada de la tarjeta; todas se muestran en la galería. Para añadir un equipo,
 * deja sus fotos ahí nombradas `<id>-1.jpg`, `<id>-2.jpg`… y añádelo aquí.
 * Los equipos que no estén en este mapa usan la imagen genérica del deporte.
 */
const teamPhotos: Record<string, string[]> = {
  'baloncesto-benjamin-mixed': ['baloncesto-benjamin-mixed-1.jpg'],
  'baloncesto-alevin-female': ['baloncesto-alevin-female-1.jpg'],
  'baloncesto-alevin-male': ['baloncesto-alevin-male-1.jpg'],
  'baloncesto-infantil-female': ['baloncesto-infantil-female-1.jpg', 'baloncesto-infantil-female-2.jpg'],
  'baloncesto-infantil-male': [
    'baloncesto-infantil-male-1.jpg',
    'baloncesto-infantil-male-2.jpg',
    'baloncesto-infantil-male-3.jpg',
  ],
  'baloncesto-cadete-female': ['baloncesto-cadete-female-1.jpg'],
  'baloncesto-cadete-male': ['baloncesto-cadete-male-1.jpg'],
  'baloncesto-junior-male': ['baloncesto-junior-male-1.jpg'],
  'baloncesto-senior-female': ['baloncesto-senior-female-1.jpg'],
  'baloncesto-senior-male': ['baloncesto-senior-male-1.jpg'],
  'voleibol-cadete-female': ['voleibol-cadete-female-1.jpg'],
  'voleibol-juvenil-female': ['voleibol-juvenil-female-1.jpg'],
  'voleibol-senior-female': ['voleibol-senior-female-1.jpg'],
  'voleibol-senior-male': [
    'voleibol-senior-male-1.jpg',
    'voleibol-senior-male-2.jpg',
    'voleibol-senior-male-3.jpg',
  ],
  'baloncesto-junior-male-guevejar': ['baloncesto-junior-male-guevejar-1.jpg'],
}

function photosFor(files: string[]): string[] {
  return files.map((f) => `${basePath}/images/teams/${f}`)
}

// Equipos extra que no encajan en el patrón deporte-categoría-género (p. ej. un
// segundo equipo dentro de una misma categoría).
const extraTeams: Team[] = [
  {
    id: 'baloncesto-junior-male-guevejar',
    sport: 'baloncesto',
    categoryId: 'junior',
    gender: 'male',
    label: 'Güevéjar',
    coach: coaches['baloncesto-junior-male-guevejar'] ?? '',
    image: photosFor(teamPhotos['baloncesto-junior-male-guevejar'])[0],
    photos: photosFor(teamPhotos['baloncesto-junior-male-guevejar']),
  },
]

function buildTeams(): Team[] {
  const sports: Sport[] = ['baloncesto', 'voleibol']
  const teams: Team[] = []

  for (const sport of sports) {
    for (const category of categoriesBySport[sport]) {
      for (const gender of category.genders) {
        const id = `${sport}-${category.id}-${gender}`
        const files = teamPhotos[id]
        // Solo se muestran los equipos que tienen foto real.
        if (!files) continue
        const photos = photosFor(files)
        teams.push({
          id,
          sport,
          categoryId: category.id,
          gender,
          coach: coaches[id] ?? '',
          image: photos[0],
          photos,
        })
      }
    }
  }
  teams.push(...extraTeams)
  return teams
}

export const teams: Team[] = buildTeams()

export function teamsBySport(sport: Sport): Team[] {
  return teams.filter((team) => team.sport === sport)
}
