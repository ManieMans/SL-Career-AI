export type LearningResource = {
  id: string
  title: string
  provider: string
  type: "Course" | "Program" | "Certification" | "Guide" | "Scholarship"
  category: string
  cost: "Free" | "Paid" | "Free / Paid" | "Scholarship"
  level: "Beginner" | "Intermediate" | "Advanced" | "All levels"
  description: string
  url: string
}

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "coursera-python",
    title: "Python for Everybody",
    provider: "Coursera",
    type: "Course",
    category: "Technology",
    cost: "Free / Paid",
    level: "Beginner",
    description: "Learn programming fundamentals with Python — a great first step into software development.",
    url: "https://www.coursera.org/specializations/python",
  },
  {
    id: "freecodecamp-web",
    title: "Responsive Web Design",
    provider: "freeCodeCamp",
    type: "Certification",
    category: "Technology",
    cost: "Free",
    level: "Beginner",
    description: "Build websites with HTML and CSS and earn a free certification.",
    url: "https://www.freecodecamp.org/learn",
  },
  {
    id: "google-data",
    title: "Google Data Analytics Certificate",
    provider: "Google / Coursera",
    type: "Certification",
    category: "Technology",
    cost: "Free / Paid",
    level: "Beginner",
    description: "Job-ready data analytics skills including spreadsheets, SQL, and visualization.",
    url: "https://www.coursera.org/professional-certificates/google-data-analytics",
  },
  {
    id: "who-open",
    title: "Public Health Foundations",
    provider: "WHO OpenWHO",
    type: "Course",
    category: "Health",
    cost: "Free",
    level: "All levels",
    description: "Free public health and epidemiology courses relevant to community health work.",
    url: "https://openwho.org",
  },
  {
    id: "njala-agri",
    title: "Agriculture Programs",
    provider: "Njala University",
    type: "Program",
    category: "Agriculture",
    cost: "Paid",
    level: "Advanced",
    description: "Sierra Leone's leading institution for agricultural science and agronomy degrees.",
    url: "https://njala.edu.sl",
  },
  {
    id: "acca",
    title: "ACCA Accounting Qualification",
    provider: "ACCA",
    type: "Certification",
    category: "Business & Finance",
    cost: "Paid",
    level: "Intermediate",
    description: "Globally recognized accountancy qualification valued by employers in Sierra Leone.",
    url: "https://www.accaglobal.com",
  },
  {
    id: "solar-training",
    title: "Solar PV Installation Training",
    provider: "Local vocational centers",
    type: "Program",
    category: "Environment & Energy",
    cost: "Free / Paid",
    level: "Beginner",
    description: "Hands-on training to install and maintain solar systems — a fast-growing field.",
    url: "#",
  },
  {
    id: "canva-design",
    title: "Graphic Design Basics",
    provider: "Canva Design School",
    type: "Guide",
    category: "Creative & Media",
    cost: "Free",
    level: "Beginner",
    description: "Free tutorials to start designing for social media and branding.",
    url: "https://www.canva.com/designschool",
  },
  {
    id: "alison-business",
    title: "Entrepreneurship & Business",
    provider: "Alison",
    type: "Course",
    category: "Business & Finance",
    cost: "Free",
    level: "All levels",
    description: "Free courses on starting and managing a small business.",
    url: "https://alison.com",
  },
  {
    id: "mastercard-scholars",
    title: "Mastercard Foundation Scholars",
    provider: "Mastercard Foundation",
    type: "Scholarship",
    category: "Education",
    cost: "Scholarship",
    level: "All levels",
    description: "Scholarships for talented young Africans to access quality education.",
    url: "https://mastercardfdn.org/all/scholars",
  },
]

export const RESOURCE_CATEGORIES = [
  "All",
  "Technology",
  "Health",
  "Agriculture",
  "Business & Finance",
  "Environment & Energy",
  "Creative & Media",
  "Education",
] as const
