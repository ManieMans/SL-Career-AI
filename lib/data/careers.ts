export type Career = {
  id: string
  title: string
  category: string
  summary: string
  description: string
  skills: string[]
  education: string
  salaryRange: string // in Sierra Leonean Leone (SLE) per month
  demand: "High" | "Growing" | "Moderate" | "Emerging"
  outlook: string
  riasec: string[] // Holland codes this career aligns with
  localContext: string
}

export const CAREER_CATEGORIES = [
  "Technology",
  "Health",
  "Agriculture",
  "Education",
  "Business & Finance",
  "Engineering",
  "Creative & Media",
  "Public Service",
  "Trades & Vocational",
  "Environment & Energy",
] as const

export const CAREERS: Career[] = [
  {
    id: "software-developer",
    title: "Software Developer",
    category: "Technology",
    summary: "Build web and mobile applications for local and international clients.",
    description:
      "Software developers design, build, and maintain applications and systems. In Sierra Leone, demand is rising as fintech, mobile money, and government digitization expand.",
    skills: ["Problem solving", "JavaScript", "Python", "Databases", "Version control", "Logical thinking"],
    education: "Diploma or degree in Computer Science, or self-taught with a strong portfolio",
    salaryRange: "SLE 4,000 – 15,000 / month",
    demand: "High",
    outlook: "Strong growth driven by fintech, telecoms, and remote work for global companies.",
    riasec: ["Investigative", "Realistic", "Conventional"],
    localContext: "Freetown's tech hubs and mobile-money providers actively recruit developers.",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Technology",
    summary: "Turn data into insights for NGOs, banks, and government agencies.",
    description:
      "Data analysts collect, clean, and interpret data to support decisions. NGOs and development agencies in Sierra Leone rely heavily on data for programs.",
    skills: ["Excel", "SQL", "Statistics", "Data visualization", "Critical thinking"],
    education: "Degree in Statistics, Economics, or related; short courses can suffice",
    salaryRange: "SLE 3,500 – 10,000 / month",
    demand: "Growing",
    outlook: "Development sector and financial institutions increasingly data-driven.",
    riasec: ["Investigative", "Conventional"],
    localContext: "UN agencies and INGOs in Freetown are frequent employers.",
  },
  {
    id: "nurse",
    title: "Registered Nurse",
    category: "Health",
    summary: "Provide essential patient care in hospitals, clinics, and communities.",
    description:
      "Nurses are the backbone of Sierra Leone's health system. There is chronic under-supply, especially in rural districts.",
    skills: ["Compassion", "Clinical skills", "Communication", "Attention to detail", "Resilience"],
    education: "Diploma/degree in Nursing from an accredited institution + council registration",
    salaryRange: "SLE 2,500 – 6,000 / month",
    demand: "High",
    outlook: "Persistent shortages create steady employment and opportunities abroad.",
    riasec: ["Social", "Investigative"],
    localContext: "Government hospitals and NGOs recruit continuously across all districts.",
  },
  {
    id: "community-health-officer",
    title: "Community Health Officer",
    category: "Health",
    summary: "Deliver primary healthcare and public health programs in communities.",
    description:
      "CHOs run peripheral health units, handle diagnoses, and lead health education in rural areas where doctors are scarce.",
    skills: ["Primary care", "Public health", "Empathy", "Local languages", "Record keeping"],
    education: "Community Health Officer training program",
    salaryRange: "SLE 2,800 – 6,500 / month",
    demand: "High",
    outlook: "Central to Sierra Leone's primary healthcare strategy.",
    riasec: ["Social", "Investigative", "Realistic"],
    localContext: "Ministry of Health posts CHOs to peripheral health units nationwide.",
  },
  {
    id: "agronomist",
    title: "Agronomist",
    category: "Agriculture",
    summary: "Improve crop yields and support farmers with modern techniques.",
    description:
      "Agronomists advise on soil, seeds, and sustainable practices. Agriculture employs most Sierra Leoneans and is a national priority sector.",
    skills: ["Crop science", "Soil management", "Extension work", "Problem solving", "Field research"],
    education: "Degree in Agriculture or Agronomy",
    salaryRange: "SLE 3,000 – 8,000 / month",
    demand: "Growing",
    outlook: "Government 'Feed Salone' initiative is boosting agricultural investment.",
    riasec: ["Realistic", "Investigative", "Enterprising"],
    localContext: "Njala University graduates are in demand across agri-development projects.",
  },
  {
    id: "agribusiness-entrepreneur",
    title: "Agribusiness Entrepreneur",
    category: "Agriculture",
    summary: "Build businesses around farming, processing, and food distribution.",
    description:
      "Agribusiness turns raw produce into value-added products and connects farmers to markets — a major opportunity in Sierra Leone.",
    skills: ["Business planning", "Marketing", "Logistics", "Finance", "Negotiation"],
    education: "No fixed requirement; business or agriculture training helps",
    salaryRange: "Variable — SLE 3,000 – 20,000+ / month",
    demand: "Growing",
    outlook: "Rising demand for locally processed foods and export crops like cocoa.",
    riasec: ["Enterprising", "Realistic", "Conventional"],
    localContext: "Cocoa, cassava, and rice value chains offer strong local opportunities.",
  },
  {
    id: "teacher",
    title: "Secondary School Teacher",
    category: "Education",
    summary: "Educate and mentor the next generation of Sierra Leoneans.",
    description:
      "Teachers are in demand nationwide, especially in STEM subjects. The Free Quality Education program expanded enrollment sharply.",
    skills: ["Subject expertise", "Communication", "Patience", "Lesson planning", "Mentoring"],
    education: "Teaching certificate or degree in Education",
    salaryRange: "SLE 2,000 – 5,500 / month",
    demand: "High",
    outlook: "Free Quality Education program drives sustained hiring.",
    riasec: ["Social", "Artistic", "Investigative"],
    localContext: "Government and mission schools recruit across all districts.",
  },
  {
    id: "accountant",
    title: "Accountant",
    category: "Business & Finance",
    summary: "Manage finances for businesses, NGOs, and government bodies.",
    description:
      "Accountants handle bookkeeping, audits, tax, and financial reporting. Qualified accountants are consistently sought after.",
    skills: ["Accounting standards", "Excel", "Attention to detail", "Integrity", "Analysis"],
    education: "Degree in Accounting/Finance; ACCA or ICASL certification is valuable",
    salaryRange: "SLE 3,500 – 12,000 / month",
    demand: "High",
    outlook: "Every growing organization needs financial expertise.",
    riasec: ["Conventional", "Enterprising"],
    localContext: "Banks, telecoms, and INGOs in Freetown value ACCA-qualified staff.",
  },
  {
    id: "banker",
    title: "Banking & Finance Officer",
    category: "Business & Finance",
    summary: "Support banking operations, loans, and financial inclusion.",
    description:
      "The financial sector is expanding financial inclusion through mobile money and microfinance across Sierra Leone.",
    skills: ["Customer service", "Numeracy", "Risk assessment", "Communication", "Sales"],
    education: "Degree in Finance, Economics, or Business",
    salaryRange: "SLE 3,000 – 10,000 / month",
    demand: "Growing",
    outlook: "Mobile money and microfinance expansion create new roles.",
    riasec: ["Conventional", "Enterprising", "Social"],
    localContext: "Commercial banks and microfinance institutions are key employers.",
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    category: "Engineering",
    summary: "Design and oversee roads, bridges, and buildings.",
    description:
      "Civil engineers are vital to Sierra Leone's infrastructure development, from roads to water systems.",
    skills: ["Structural design", "Project management", "CAD", "Maths", "Site supervision"],
    education: "Degree in Civil Engineering",
    salaryRange: "SLE 4,000 – 14,000 / month",
    demand: "Growing",
    outlook: "Infrastructure investment and reconstruction drive demand.",
    riasec: ["Realistic", "Investigative", "Conventional"],
    localContext: "Road and construction projects nationwide need qualified engineers.",
  },
  {
    id: "electrician",
    title: "Electrician",
    category: "Trades & Vocational",
    summary: "Install and maintain electrical systems and solar installations.",
    description:
      "Skilled electricians are in high demand, especially with the growth of solar power across off-grid communities.",
    skills: ["Electrical wiring", "Safety", "Solar systems", "Troubleshooting", "Manual dexterity"],
    education: "Vocational training / technical certificate",
    salaryRange: "SLE 2,500 – 8,000 / month",
    demand: "High",
    outlook: "Solar energy expansion creates strong demand for trained electricians.",
    riasec: ["Realistic", "Conventional"],
    localContext: "Off-grid solar companies actively train and hire technicians.",
  },
  {
    id: "solar-technician",
    title: "Solar Energy Technician",
    category: "Environment & Energy",
    summary: "Install and service solar power systems in homes and businesses.",
    description:
      "With limited grid coverage, solar is transforming energy access in Sierra Leone, creating a fast-growing job market.",
    skills: ["Solar PV", "Electrical basics", "Customer service", "Maintenance", "Safety"],
    education: "Technical/vocational certificate in solar or electrical work",
    salaryRange: "SLE 3,000 – 9,000 / month",
    demand: "Emerging",
    outlook: "One of the fastest-growing fields in the country.",
    riasec: ["Realistic", "Investigative"],
    localContext: "Pay-as-you-go solar companies are scaling rapidly nationwide.",
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    category: "Creative & Media",
    summary: "Create visual content for brands, campaigns, and media.",
    description:
      "As businesses go digital, demand grows for designers who can craft logos, social media, and marketing materials.",
    skills: ["Design tools", "Creativity", "Branding", "Communication", "Attention to detail"],
    education: "No fixed requirement; portfolio and short courses matter most",
    salaryRange: "SLE 2,500 – 9,000 / month",
    demand: "Growing",
    outlook: "Digital marketing growth fuels demand, including freelance/remote.",
    riasec: ["Artistic", "Enterprising"],
    localContext: "SMEs and agencies in Freetown hire and outsource design work.",
  },
  {
    id: "journalist",
    title: "Journalist / Content Creator",
    category: "Creative & Media",
    summary: "Report news and create content across media platforms.",
    description:
      "Media plays a vital democratic role. Digital platforms open new paths for content creators and reporters.",
    skills: ["Writing", "Research", "Communication", "Ethics", "Digital media"],
    education: "Degree in Mass Communication or journalism training",
    salaryRange: "SLE 2,000 – 7,000 / month",
    demand: "Moderate",
    outlook: "Traditional media steady; digital content creation growing.",
    riasec: ["Artistic", "Social", "Enterprising"],
    localContext: "Radio remains powerful; social media opens freelance opportunities.",
  },
  {
    id: "public-health-officer",
    title: "Public Health Specialist",
    category: "Public Service",
    summary: "Design and manage programs that improve population health.",
    description:
      "Public health specialists tackle disease prevention, sanitation, and health policy — critical after epidemics like Ebola.",
    skills: ["Epidemiology", "Program management", "Data analysis", "Communication", "Policy"],
    education: "Degree in Public Health or related field",
    salaryRange: "SLE 4,000 – 12,000 / month",
    demand: "Growing",
    outlook: "Strong donor and government investment in health systems.",
    riasec: ["Social", "Investigative", "Enterprising"],
    localContext: "WHO, UNICEF, and Ministry of Health are major employers.",
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur / Small Business Owner",
    category: "Business & Finance",
    summary: "Start and grow your own business to create jobs and income.",
    description:
      "Entrepreneurship is a key path to opportunity in Sierra Leone, where the informal sector is large and growing.",
    skills: ["Initiative", "Sales", "Financial literacy", "Resilience", "Networking"],
    education: "No formal requirement; business training helps",
    salaryRange: "Highly variable",
    demand: "Growing",
    outlook: "Growing support ecosystem of incubators and grants.",
    riasec: ["Enterprising", "Conventional", "Social"],
    localContext: "Youth entrepreneurship programs and grants are increasingly available.",
  },
]

export function getCareerById(id: string) {
  return CAREERS.find((c) => c.id === id)
}
