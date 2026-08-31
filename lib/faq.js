import {
  profile,
  skills,
  projects,
  experience,
  cvUrl,
  certifications,
  education,
  languages,
  linkedinUrl,
} from './data'

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
}

export const suggestions = [
  '¿Qué tecnologías usas?',
  '¿En qué estás trabajando?',
  '¿Por qué debería contratarte?',
  '¿Tienes certificaciones?',
  '¿Cómo te contacto?',
]

// Nunca respondas con teléfono ni dirección postal, aunque estén en el CV
// descargable — esas entradas existen solo para desviar la pregunta.
const privacyDeflect = () =>
  `Ese dato no lo comparto por aquí. Escríbeme a ${profile.email} y hablamos directamente.`

const entries = [
  {
    keywords: ['telefono', 'movil', 'numero de contacto', 'whatsapp'],
    answer: privacyDeflect,
  },
  {
    keywords: ['direccion', 'domicilio', 'donde vives exactamente', 'calle'],
    answer: privacyDeflect,
  },
  {
    keywords: ['cuantos anos de experiencia', 'anos de experiencia', 'tiempo llevas trabajando', 'trayectoria profesional'],
    answer: () => 'Más de 3 años de experiencia en Business Intelligence, dentro de una trayectoria de más de 7 años pasando por banca, análisis de datos y ahora BI.',
  },
  {
    keywords: ['tecnolog', 'stack', 'herramient', 'skill', 'lenguaje', 'domina', 'sabes usar'],
    answer: () =>
      `Trabajo sobre todo con: ${skills.map((g) => g.items.join(', ')).join('; ')}.`,
  },
  {
    keywords: ['power bi', 'dax', 'tableau', 'looker'],
    answer: () => 'Power BI a nivel experto (DAX, Power Query), y también he trabajado con Tableau y Looker Studio.',
  },
  {
    keywords: ['python'],
    answer: () => 'Sí, uso Python para análisis de datos con sus librerías habituales.',
  },
  {
    keywords: ['excel', 'vba', 'macro'],
    answer: () => 'Sí, Excel avanzado con VBA/Macros — lo he usado para modelos financieros complejos en banca e inmobiliario.',
  },
  {
    keywords: ['sql', 'base de datos', 'bases de datos'],
    answer: () => 'Sí, SQL para extracción y modelado de datos, con experiencia en MySQL e IBM DB2.',
  },
  {
    keywords: ['cloud', 'azure', 'aws', 'google cloud', 'gcp', 'fabric'],
    answer: () => 'Trabajo con Microsoft Fabric y Azure Data Factory, y tengo nociones de AWS y Google Cloud.',
  },
  {
    keywords: ['scrum', 'agile', 'jira', 'metodolog'],
    answer: () => 'Sí, soy Certified ScrumMaster® (CSM®) y trabajo habitualmente con Agile/Scrum, Jira y Azure DevOps.',
  },
  {
    keywords: ['inteligencia artificial', ' ia ', 'llm', 'ia local', 'ia generativa'],
    answer: () => 'Sí — tengo certificaciones en IA generativa y Azure AI Apps and Agents, y este mismo widget de preguntas es un experimento propio en esa línea (aunque hoy es solo reglas, no un LLM real).',
  },
  {
    keywords: ['certificacion', 'certificado'],
    answer: () => `Tengo varias, entre ellas: ${certifications.slice(0, 3).join('; ')}, y alguna más — el listado completo está en el CV.`,
  },
  {
    keywords: ['estudi', 'formacion', 'universidad', 'master', 'grado', 'carrera'],
    answer: () =>
      education.map((e) => `${e.degree} (${e.school}, ${e.year})`).join('; ') + '.',
  },
  {
    keywords: ['idioma', 'ingles', 'hablas'],
    answer: () => `Idiomas: ${languages.join(', ')}.`,
  },
  {
    keywords: ['proyecto', 'portfolio', 'construyendo', 'creando', ...projects.map((p) => normalize(p.name))],
    answer: () =>
      `Ahora mismo tengo en desarrollo: ${projects
        .map((p) => `${p.name} (${p.status.toLowerCase()})`)
        .join(' y ')}. Puedes ver el detalle en la sección de Proyectos.`,
  },
  {
    keywords: ['trabaj', 'actual', 'empresa', 'puesto', 'a que te dedicas'],
    answer: () =>
      `${experience[0].role} en ${experience[0].company}, ${experience[0].period.toLowerCase()}.`,
  },
  {
    keywords: ['tipo de proyecto', 'que buscas', 'que tipo de trabajo'],
    answer: () => 'Sobre todo proyectos de datos y BI (dashboards, automatización) y también desarrollo web con Next.js/React.',
  },
  {
    keywords: ['por que deberia contratarte', 'por que contratarte', 'que te diferencia', 'que aportas', 'punto fuerte'],
    answer: () => profile.bio,
  },
  {
    keywords: ['tarifa', 'precio', 'cobras', 'presupuesto', 'coste'],
    answer: () => `Prefiero hablarlo caso por caso — escríbeme a ${profile.email} y lo vemos.`,
  },
  {
    keywords: ['remoto', 'presencial', 'hibrido', 'trabajas desde'],
    answer: () => 'Depende del proyecto — hablemos y lo concretamos.',
  },
  {
    keywords: ['linkedin'],
    answer: () => `Mi LinkedIn: ${linkedinUrl}`,
  },
  {
    keywords: ['github', 'codigo', 'repositorio'],
    answer: () => `Mi GitHub: https://github.com/${profile.github}`,
  },
  {
    keywords: ['contact', 'email', 'correo', 'hablar', 'escrib'],
    answer: () => `Puedes escribirme a ${profile.email} o por GitHub (@${profile.github}).`,
  },
  {
    keywords: ['disponib', 'libre', 'contratar', 'colaborar', 'buscas trabajo', 'buscando empleo'],
    answer: () =>
      profile.available
        ? 'Sí, ahora mismo estoy disponible para nuevos proyectos.'
        : 'Ahora mismo no tengo disponibilidad para proyectos nuevos.',
  },
  {
    keywords: ['donde', 'ubicac', 'locali', 'ciudad', 'vives'],
    answer: () => `Vivo en ${profile.location}, aunque soy de ${profile.hometown}.`,
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
  const q = normalize(` ${question} `)
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
