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
    name: "Documentación Power BI con IA",
    description: "Herramienta que genera la documentación de un informe Power BI de forma automática: subes el .pbip y una integración de IA la redacta con un prompt y un formato predefinidos.",
    problem: "Documentar un informe de Power BI a mano —modelo de datos, medidas DAX, relaciones— es tedioso y se queda desactualizado en cuanto el informe cambia.",
    approach: "A partir del archivo .pbip, una integración de IA con un prompt y una plantilla predefinida genera la documentación completa del informe: modelo de datos, medidas y relaciones.",
    tech: ["Power BI", "PBIP", "IA generativa", "Prompt engineering"],
    status: "Terminado",
    url: null,
  },
  {
    name: "jomafit",
    description: "App personal de salud y nutrición en uso diario por dos personas: centraliza comida, agua, ejercicio, sueño y medicación, sincroniza un wearable y genera puntuaciones e informes clínicos con IA.",
    problem: "La adherencia a un plan nutricional —y los datos que la sustentan— estaba repartida entre una app de comidas, otra del wearable, notas sueltas y la memoria. Nada centralizado ni exportable para un nutricionista.",
    approach: [
      "Estimación de macros a partir de una descripción en texto libre, vía Gemini, con rotación de API keys y fallback entre modelos para no gastar cuota.",
      "Sincronización de wearable (Google Health Connect): frecuencia cardíaca, HRV, sueño por fases, pasos — con cron propio y tokens OAuth cifrados (AES-256-GCM).",
      "Sistema de puntuaciones diario estilo Whoop (Recovery, Strain, Training Readiness, JomaScore), con lógica pura y tests.",
      "Informes clínicos generados por IA: resumen semanal por email e informe tipo \"nutricionista\" exportable a PDF.",
      "Integración con el catálogo de Mercadona (macros por producto, lista de la compra compartida) y PWA instalable con notificaciones push.",
    ],
    tech: ["Next.js", "PostgreSQL", "Gemini API", "Health Connect"],
    status: "En uso",
    images: [
      "/projects/jomafit/01-landing.png",
      "/projects/jomafit/02-comida.png",
      "/projects/jomafit/03-fisico.png",
      "/projects/jomafit/04-sueno.png",
      "/projects/jomafit/05-analisis.png",
      "/projects/jomafit/06-informe-semanal.png",
      "/projects/jomafit/07-mercadona.png",
    ],
    url: null,
  },
  {
    name: "SanzBlanco",
    description: "Mi herramienta personal para comprar vivienda en España: centraliza los inmuebles candidatos, simula su viabilidad hipotecaria con datos financieros reales, enriquece cada dirección con datos oficiales de zona y vigila el mercado para detectar bajadas de precio y anuncios nuevos.",
    problem: "Comparar y valorar propiedades a mano —cruzando anuncios, hipoteca y datos de zona— es lento y poco fiable, y es fácil perder de vista cambios de precio en un piso que te interesa.",
    approach: [
      "Motor financiero propio (sin librerías externas): cuota, TAE real, tasa de esfuerzo e hipoteca fija/variable/mixta con bonificaciones, más una simulación Monte Carlo del Euríbor a 30 años (fija vs. variable).",
      "Radar de mercado con cron en Vercel: scraping vía Apify (Idealista) y un scraper propio para Fotocasa, con histórico de precio por anuncio y detección de candidatos nuevos.",
      "Enriquecimiento geográfico automático por dirección: isócronas de movilidad, colegios y transporte, renta media por sección censal (INE), calidad del aire y certificados energéticos.",
      "Extracción con IA (Gemini): OCR de notas simples del Registro para detectar cargas, y parseo de contactos desde texto libre a ficha estructurada.",
      "CRM de agencias con score de transparencia y comparador de ofertas bancarias lado a lado.",
      "Pendiente por decisión de coste, no por desarrollo: agregación bancaria vía Open Banking (interfaz y tabla ya listas, sin proveedor conectado).",
    ],
    tech: ["Next.js", "PostgreSQL", "Vercel Cron", "Gemini API"],
    status: "En uso",
    images: [
      "/projects/hipocalc/01-ficha.png",
      "/projects/hipocalc/02-barrio.png",
      "/projects/hipocalc/03-tasacion.png",
      "/projects/hipocalc/04-inversion.png",
      "/projects/hipocalc/05-finanzas.png",
      "/projects/hipocalc/06-mapa.png",
      "/projects/hipocalc/07-radar.png",
    ],
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
      "Diseño de automatizaciones end-to-end con Power Automate para distintos procesos del departamento, no solo el envío de informes.",
      "Apps internas para resolver consultas frecuentes sin golpear la base de datos directamente.",
      "Implementación de un LLM local (on-premise) para generar resúmenes internos sobre datos sensibles, sin que salgan de la infraestructura de la empresa.",
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
  { key: "tiempo_ahorro_automatizacion", value: "∞", label: "tiempo ahorrado gracias a la automatización" },
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
