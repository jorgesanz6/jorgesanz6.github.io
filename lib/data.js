export const profile = {
  name: "Jorge Sanz Muñoz",
  role: "Data Analyst & BI Consultant",
  location: "Valladolid / Madrid, España",
  bio: "Analista de datos y consultor de Business Intelligence con perfil híbrido técnico-funcional (ADE + Máster en Big Data). Transformo datos complejos en decisiones claras: cuadros de mando, automatizaciones y, últimamente, aplicaciones web desde cero.",
  email: "jorgesanzm6@gmail.com",
  github: "jorgesanz6",
  available: true,
}

export const skills = [
  { group: "Business Intelligence", items: ["Power BI", "DAX", "Power Query (M)"] },
  { group: "Bases de datos", items: ["SQL", "MySQL", "IBM DB2"] },
  { group: "Automatización", items: ["Power Automate", "Integraciones LLM"] },
  { group: "Desarrollo web", items: ["Next.js", "React", "PWA"] },
]

export const projects = [
  {
    name: "jomafit",
    description: "PWA de seguimiento de salud, fitness y nutrición con registro avanzado de macronutrientes e integración de IA local.",
    problem: "Las apps de fitness genéricas no se ajustan bien a objetivos y rutinas muy personales; quería control fino sobre macros y progreso sin depender de un servicio de terceros.",
    approach: "PWA mobile-first instalable desde el navegador, sin tienda de apps. El registro de comidas usa un modelo LLM local para interpretar entradas en lenguaje natural y estimar macronutrientes.",
    tech: ["PWA", "Mobile-first", "LLM API"],
    status: "En desarrollo",
    url: null,
  },
  {
    name: "Análisis inmobiliario",
    description: "Aplicación web de análisis del mercado inmobiliario español: valoración de propiedades, enriquecimiento geográfico, CRM ligero e integración de open banking.",
    problem: "Comparar y valorar propiedades a mano cruzando fuentes de datos dispersas (ubicación, precios de mercado, financiación) es lento y poco fiable.",
    approach: "Next.js + Supabase como backend, con enriquecimiento geográfico automático por dirección y un CRM ligero para hacer seguimiento de oportunidades. La integración de open banking permitirá cruzar capacidad financiera real con la valoración.",
    tech: ["Next.js", "React", "Supabase", "Open Banking"],
    status: "En desarrollo",
    url: null,
  },
]

export const experience = [
  {
    role: "Consultor BI",
    company: "Optimissa → A.M.A.",
    period: "Actualidad",
    description: "Gestión de operaciones corporativas de datos, conexiones a bases de datos SQL complejas y despliegue de reportes automatizados en Agrupación Mutual Aseguradora.",
  },
  {
    role: "6 certificaciones en 6 meses",
    company: "Reto personal IT/Data",
    period: "Jun – Dic 2025",
    description: "Una certificación mensual en el ámbito de datos e IT como ejercicio de aprendizaje continuo y disciplina técnica.",
  },
]
