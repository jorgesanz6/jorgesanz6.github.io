import { profile, skills, projects, experience, cvUrl } from './data'

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export const suggestions = [
  '¿Qué tecnologías usas?',
  '¿En qué estás trabajando?',
  '¿Cómo te contacto?',
  '¿Dónde estás ubicado?',
]

const entries = [
  {
    keywords: ['tecnolog', 'stack', 'herramient', 'skill', 'lenguaje', 'domina'],
    answer: () =>
      `Trabajo sobre todo con: ${skills.map((g) => g.items.join(', ')).join('; ')}.`,
  },
  {
    keywords: ['proyecto', 'portfolio', 'construyendo', 'creando', ...projects.map((p) => normalize(p.name))],
    answer: () =>
      `Ahora mismo tengo en desarrollo: ${projects
        .map((p) => `${p.name} (${p.status.toLowerCase()})`)
        .join(' y ')}. Puedes ver el detalle en la sección de Proyectos.`,
  },
  {
    keywords: ['trabaj', 'actual', 'experiencia', 'empresa', 'puesto'],
    answer: () =>
      `${experience[0].role} en ${experience[0].company}, ${experience[0].period.toLowerCase()}.`,
  },
  {
    keywords: ['contact', 'email', 'correo', 'hablar', 'escrib'],
    answer: () => `Puedes escribirme a ${profile.email} o por GitHub (@${profile.github}).`,
  },
  {
    keywords: ['disponib', 'libre', 'contratar', 'colaborar'],
    answer: () =>
      profile.available
        ? 'Sí, ahora mismo estoy disponible para nuevos proyectos.'
        : 'Ahora mismo no tengo disponibilidad para proyectos nuevos.',
  },
  {
    keywords: ['donde', 'ubicac', 'locali', 'ciudad', 'vives'],
    answer: () => `Ubicado en ${profile.location}.`,
  },
  {
    keywords: ['quien eres', 'sobre ti', 'quien es', 'presentate'],
    answer: () => profile.bio,
  },
  {
    keywords: ['cv', 'curriculum', 'currículum', 'resume'],
    answer: () => `Sí, puedes descargar mi CV completo aquí: ${cvUrl}`,
  },
]

export function getAnswer(question) {
  const q = normalize(question)
  let best = null
  let bestScore = 0

  for (const entry of entries) {
    const score = entry.keywords.filter((k) => q.includes(normalize(k))).length
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }

  if (best) return best.answer()
  return `No tengo una respuesta preparada para eso. Escríbeme directo a ${profile.email} y te contesto yo.`
}
