export type Sport = 'baloncesto' | 'voleibol'
export type Gender = 'male' | 'female'

export type Category = {
  id: string
  name: string
  ageEs: string
  ageEn: string
}

export const categories: Category[] = [
  { id: 'benjamin', name: 'Benjamín', ageEs: '7 – 8 años', ageEn: 'Ages 7 – 8' },
  { id: 'alevin', name: 'Alevín', ageEs: '9 – 10 años', ageEn: 'Ages 9 – 10' },
  { id: 'infantil', name: 'Infantil', ageEs: '11 – 12 años', ageEn: 'Ages 11 – 12' },
  { id: 'cadete', name: 'Cadete', ageEs: '13 – 14 años', ageEn: 'Ages 13 – 14' },
  { id: 'junior', name: 'Junior', ageEs: '15 – 17 años', ageEn: 'Ages 15 – 17' },
  { id: 'senior', name: 'Senior', ageEs: '+18 años', ageEn: 'Ages 18+' },
]

export type Team = {
  /** Stable unique id, e.g. "baloncesto-benjamin-male". */
  id: string
  sport: Sport
  categoryId: string
  gender: Gender
  coach: string
  /** Cover image shown on the team card. */
  image: string
  /** Gallery shown in the carousel when the team is opened. */
  photos: string[]
}

// Coach names indexed per category (benjamín → senior)
const coaches: Record<Sport, Record<Gender, string[]>> = {
  baloncesto: {
    male: ['Javier Ruiz', 'Marcos León', 'Pablo Ortega', 'Diego Fernández', 'Álvaro Molina', 'Sergio Cano'],
    female: ['Laura Vega', 'Marta Jiménez', 'Cristina Delgado', 'Nuria Peña', 'Elena Torres', 'Rocío Navas'],
  },
  voleibol: {
    male: ['Carlos Herrera', 'Iván Salas', 'Adrián Reyes', 'Rubén Castro', 'Hugo Márquez', 'Daniel Prieto'],
    female: ['Sara Campos', 'Lucía Romero', 'Andrea Gil', 'Paula Serrano', 'Irene Ramos', 'Beatriz Luna'],
  },
}

const images: Record<Sport, string> = {
  baloncesto: '/images/basketball.png',
  voleibol: '/images/volleyball.png',
}

/**
 * Placeholder gallery for a team.
 *
 * These reuse existing images so the carousel renders immediately. To use real
 * photos, drop files in `public/images/teams/` and return their paths here, e.g.
 *   [`/images/teams/${sport}-${categoryId}-${gender}-1.jpg`, ...]
 */
function buildPhotos(sport: Sport): string[] {
  return [images[sport], '/images/team.png', '/images/facility.png']
}

function buildTeams(): Team[] {
  const sports: Sport[] = ['baloncesto', 'voleibol']
  const genders: Gender[] = ['male', 'female']
  const teams: Team[] = []

  for (const sport of sports) {
    for (const gender of genders) {
      categories.forEach((cat, index) => {
        teams.push({
          id: `${sport}-${cat.id}-${gender}`,
          sport,
          categoryId: cat.id,
          gender,
          coach: coaches[sport][gender][index],
          image: images[sport],
          photos: buildPhotos(sport),
        })
      })
    }
  }
  return teams
}

export const teams: Team[] = buildTeams()

export function teamsBySport(sport: Sport): Team[] {
  return teams.filter((team) => team.sport === sport)
}
