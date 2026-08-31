export const profile = {
  name: "Jorge Sanz Muñoz",
  role: "Data Analyst & BI Consultant",
  location: "Madrid, España",
  hometown: "Valladolid",
  bio: "Analista de datos y consultor de Business Intelligence con perfil híbrido técnico-funcional (ADE + Máster en Big Data). Transformo datos complejos en decisiones claras: cuadros de mando, automatizaciones y, últimamente, aplicaciones web desde cero.",
  email: "jorgesanzm6@gmail.com",
  github: "jorgesanz6",
  available: false,
}

export const skills = [
  { group: "Business Intelligence", items: ["Power BI", "DAX", "Power Query (M)", "Dataflows", "Gateways"] },
  { group: "Bases de datos", items: ["SQL", "MySQL", "IBM DB2"] },
  { group: "Automatización", items: ["Power Automate", "Integraciones LLM"] },
  { group: "IA & Vibecoding", items: ["Claude Code", "Antigravity", "LLMs"] },
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
    role: "BI Reporting Specialist",
    company: "Alten/Optimissa (AMA Agrupación Mutual Aseguradora)",
    period: "Oct 2024 – Actualidad",
    description: "Optimización de dashboards clave (+60% de rendimiento), modelos de datos en SQL, automatización de informes recurrentes y migración de IBM Cognos Analytics a Power BI.",
    problem: "Los dashboards clave iban lentos, los informes recurrentes se generaban a mano, y las consultas directas a las bases de datos las estaban sobrecargando.",
    approach: [
      "Rediseño de modelos de datos en SQL con actualizaciones incrementales, para bajar la carga sobre la base de datos.",
      "Creación de dataflows y gestión de gateways para centralizar y programar la ingesta de datos.",
      "Automatización de informes recurrentes con envío de resultados por email vía Power Automate.",
      "Apps internas para resolver consultas frecuentes sin golpear la base de datos directamente.",
      "Resúmenes internos generados con modelos de lenguaje (LLM) sobre datos sensibles, con cuidado en su tratamiento.",
      "Migración de paneles de IBM Cognos Analytics a Power BI Service.",
    ],
    impact: "+60% de rendimiento en los dashboards clave, cero errores del proceso manual, menor carga en las bases de datos, y acceso a informes fiables ampliado a varios departamentos.",
  },
  {
    role: "Data Quality Analyst",
    company: "CHEP",
    period: "May 2024 – Oct 2024",
    description: "Validación y limpieza de datos de geolocalización de palés para la fiabilidad del sistema de rastreo y la optimización de la cadena de suministro.",
  },
  {
    role: "Asset Data Analyst",
    company: "Profarma Patrimonial Farmacéutica",
    period: "Abr 2022 – Mar 2024",
    description: "Modelos financieros y automatizaciones con Excel VBA para transmisión de farmacias data-driven. Facturación asociada superior a 3M€.",
  },
]

export const stats = [
  { key: "rendimiento_dashboards", value: "+60%", label: "rendimiento en dashboards clave" },
  { key: "errores_manuales", value: "100%", label: "errores manuales eliminados vía automatización" },
  { key: "certificaciones_6meses", value: "6", label: "certificaciones en 6 meses" },
  { key: "anos_en_bi", value: "+3", label: "años en Business Intelligence" },
]

export const methodologyIntro = "Antes de BI pasé por banca (BBVA) y análisis financiero en el sector inmobiliario y farmacéutico. Ese punto de partida en negocio, no en la herramienta, es lo que marca cómo trabajo:"

export const methodology = [
  {
    title: "Entender el negocio",
    description: "Traduzco necesidades de stakeholders en preguntas de datos concretas, no al revés.",
  },
  {
    title: "Modelar los datos",
    description: "SQL y modelos limpios pensados para aguantar crecer, no parches puntuales.",
  },
  {
    title: "Construir y automatizar",
    description: "Dashboards en Power BI y automatizaciones que eliminan el proceso manual, no que lo maquillan.",
  },
  {
    title: "Iterar con impacto",
    description: "Mido si el informe se usa de verdad, y ajusto hasta que lo haga.",
  },
]

export const certifications = [
  "Fabric Analytics Engineer Associate DP-600 (Microsoft)",
  "Azure AI Apps and Agents Developer Associate AI-103 (Microsoft)",
  "Certified ScrumMaster® (CSM®)",
  "Oracle Analytics Cloud Data Science Professional (Oracle)",
  "Power BI e Inteligencia Artificial (IBM - Datahack School)",
  "Generative AI Professional, MySQL Implementation (Oracle)",
]

export const education = [
  { degree: "Máster en Big Data y Transformación Digital", school: "Centro de Estudios Financieros", year: "2023" },
  { degree: "Grado en Administración y Dirección de Empresas", school: "Universidad de Valladolid", year: "2019" },
  { degree: "Finanzas, Economía Empresarial y Marketing", school: "Università degli Studi di Firenze", year: "2017" },
]

export const languages = ["Español (nativo)", "Inglés", "Portugués", "Italiano"]

export const linkedinUrl = "https://www.linkedin.com/in/jorgesanzmunoz/"

export const cvUrl = "/cv.pdf"
export const cvFilename = "CV_Jorge_Sanz.pdf"

// Formspree endpoint (https://formspree.io/f/xxxxxxx) — te avisa por email en
// cada envío. Déjalo vacío y las notificaciones simplemente no se disparan.
export const cvNotifyEndpoint = "https://formspree.io/f/xbgjdnqg"
