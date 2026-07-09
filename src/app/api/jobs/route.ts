import { NextRequest, NextResponse } from "next/server"

const JOBS = [
  {
    id: 1, title: "Software Engineer", company: "Smart Axiata", location: "Phnom Penh",
    salary: "$800 - $1,500", type: "Full-time", category: "tech",
    posted: "2026-07-08", logo: "💻",
    description: "We are looking for a skilled Software Engineer to join our team in Phnom Penh. You will develop and maintain web applications using modern frameworks.",
    requirements: ["2+ years experience in web development", "Proficient in JavaScript, React, Node.js", "Strong problem-solving skills", "Bachelor's degree in CS or related field", "Good English communication"],
    benefits: ["13th month salary", "Health insurance", "Annual bonus", "Training opportunities"],
    applyUrl: "mailto:careers@smart.com.kh",
  },
  {
    id: 2, title: "Cybersecurity Analyst", company: "Wing Bank", location: "Phnom Penh",
    salary: "$1,200 - $2,000", type: "Full-time", category: "tech",
    posted: "2026-07-07", logo: "🔒",
    description: "Wing Bank is seeking a Cybersecurity Analyst to protect our digital infrastructure and customer data.",
    requirements: ["3+ years in cybersecurity", "Knowledge of OWASP, network security, SIEM", "Security certifications (CEH, CISSP preferred)", "Experience with penetration testing"],
    benefits: ["Competitive salary", "Health & dental insurance", "Performance bonus", "Remote flexibility"],
    applyUrl: "mailto:hr@wingbank.com.kh",
  },
  {
    id: 3, title: "Full Stack Developer", company: "Sabay Digital", location: "Phnom Penh",
    salary: "$700 - $1,300", type: "Full-time", category: "tech",
    posted: "2026-07-06", logo: "🌐",
    description: "Join Sabay Digital to build Cambodia's leading digital media platform. Work with a talented team on products used by millions.",
    requirements: ["Experience with Laravel or Django", "Frontend skills in React/Vue", "Database design knowledge", "API development experience"],
    benefits: ["Creative work environment", "Free lunch", "Team activities", "Growth opportunities"],
    applyUrl: "mailto:jobs@sabay.com.kh",
  },
  {
    id: 4, title: "Network Administrator", company: "EZECOM", location: "Phnom Penh",
    salary: "$600 - $1,000", type: "Full-time", category: "tech",
    posted: "2026-07-05", logo: "🌐",
    description: "EZECOM is looking for a Network Administrator to manage and maintain our growing network infrastructure.",
    requirements: ["CCNA certification", "Experience with routers, switches, firewalls", "Network troubleshooting skills", "Knowledge of MikroTik and Cisco"],
    benefits: ["Transportation allowance", "Phone allowance", "Annual trip", "Insurance"],
    applyUrl: "mailto:careers@ezecom.com.kh",
  },
  {
    id: 5, title: "Mobile App Developer", company: "Pi Pay", location: "Phnom Penh",
    salary: "$900 - $1,600", type: "Full-time", category: "tech",
    posted: "2026-07-04", logo: "📱",
    description: "Pi Pay is hiring a Mobile App Developer to build and enhance our fintech mobile applications used by thousands of Cambodians.",
    requirements: ["Experience with Flutter or React Native", "Knowledge of mobile UI/UX best practices", "API integration experience", "Published apps on App Store/Google Play"],
    benefits: ["Equity options", "Flexible hours", "Modern office", "Snacks & drinks"],
    applyUrl: "mailto:hr@pipay.com.kh",
  },
  {
    id: 6, title: "Data Analyst", company: "Prince Bank", location: "Phnom Penh",
    salary: "$700 - $1,200", type: "Full-time", category: "tech",
    posted: "2026-07-03", logo: "📊",
    description: "Prince Bank needs a Data Analyst to derive insights from customer data and support data-driven decision making.",
    requirements: ["SQL expertise", "Python or R programming", "Experience with Power BI or Tableau", "Statistical analysis skills"],
    benefits: ["Banking benefits", "Professional development", "Stable career", "Team events"],
    applyUrl: "mailto:recruit@princebank.com.kh",
  },
  {
    id: 7, title: "Marketing Manager", company: "Coca-Cola Cambodia", location: "Phnom Penh",
    salary: "$1,000 - $1,800", type: "Full-time", category: "marketing",
    posted: "2026-07-02", logo: "📈",
    description: "Lead marketing initiatives for Cambodia's favorite beverage brand. Develop strategies to grow market share.",
    requirements: ["5+ years marketing experience", "Brand management expertise", "Digital marketing skills", "Team leadership experience"],
    benefits: ["Global company benefits", "Company car", "Annual bonus", "Health coverage"],
    applyUrl: "mailto:hr.kh@coca-cola.com",
  },
  {
    id: 8, title: "Graphic Designer", company: "Khmer Times", location: "Phnom Penh",
    salary: "$500 - $800", type: "Full-time", category: "creative",
    posted: "2026-07-01", logo: "🎨",
    description: "Create engaging visual content for Cambodia's leading English-language newspaper across print and digital platforms.",
    requirements: ["Proficiency in Adobe Creative Suite", "Strong portfolio", "Understanding of print and digital design", "Khmer and English language skills"],
    benefits: ["Creative freedom", "Media industry exposure", "Flexible schedule", "Press event access"],
    applyUrl: "mailto:design@khmertimes.com.kh",
  },
  {
    id: 9, title: "English Teacher", company: "Australian International School", location: "Phnom Penh",
    salary: "$1,000 - $1,500", type: "Full-time", category: "education",
    posted: "2026-06-30", logo: "📚",
    description: "Teach English to students at one of Cambodia's premier international schools. Curriculum and training provided.",
    requirements: ["Bachelor's degree", "TEFL/CELTA certification preferred", "Native English speaker", "Passion for teaching"],
    benefits: ["Visa sponsorship", "Housing allowance", "Paid holidays", "Health insurance"],
    applyUrl: "mailto:teachers@aiscambodia.com",
  },
  {
    id: 10, title: "Sales Executive", company: "Cellcard", location: "Phnom Penh",
    salary: "$400 - $700", type: "Full-time", category: "sales",
    posted: "2026-06-29", logo: "📞",
    description: "Join Cambodia's leading telecom company as a Sales Executive. Drive B2B sales and build client relationships.",
    requirements: ["1+ year sales experience", "Strong communication skills", "Khmer and English fluency", "Self-motivated"],
    benefits: ["Commission structure", "Phone allowance", "Career growth", "Training provided"],
    applyUrl: "mailto:careers@cellcard.com.kh",
  },
  {
    id: 11, title: "DevOps Engineer", company: "Hello Group", location: "Phnom Penh",
    salary: "$1,000 - $1,800", type: "Full-time", category: "tech",
    posted: "2026-06-28", logo: "⚙️",
    description: "Hello Group is seeking a DevOps Engineer to streamline our deployment pipelines and infrastructure.",
    requirements: ["Experience with AWS or GCP", "Docker and Kubernetes knowledge", "CI/CD pipeline experience", "Infrastructure as Code (Terraform)"],
    benefits: ["Remote work option", "International team", "Latest tech stack", "Conference budget"],
    applyUrl: "mailto:tech@hellogroup.com",
  },
  {
    id: 12, title: "HR Manager", company: "NagaWorld", location: "Phnom Penh",
    salary: "$1,200 - $2,000", type: "Full-time", category: "management",
    posted: "2026-06-27", logo: "👥",
    description: "Lead the HR department for Cambodia's largest hospitality and entertainment group.",
    requirements: ["7+ years HR experience", "Labor law expertise", "Team management", "Strategic planning skills"],
    benefits: ["Premium health coverage", "Meal allowance", "Annual bonus", "Career advancement"],
    applyUrl: "mailto:hr@nagaworld.com",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Jobs" },
  { id: "tech", label: "Technology" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "education", label: "Education" },
  { id: "creative", label: "Creative" },
  { id: "management", label: "Management" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword")?.toLowerCase() || ""
  const category = searchParams.get("category") || "all"
  const location = searchParams.get("location")?.toLowerCase() || ""

  let filtered = [...JOBS]

  if (keyword) {
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(keyword) ||
      j.company.toLowerCase().includes(keyword) ||
      j.description.toLowerCase().includes(keyword) ||
      j.requirements.some(r => r.toLowerCase().includes(keyword))
    )
  }

  if (category && category !== "all") {
    filtered = filtered.filter(j => j.category === category)
  }

  if (location) {
    filtered = filtered.filter(j => j.location.toLowerCase().includes(location))
  }

  return NextResponse.json({
    jobs: filtered,
    total: filtered.length,
    categories: CATEGORIES,
  })
}

export async function POST(request: NextRequest) {
  const { id } = await request.json()
  const job = JOBS.find(j => j.id === id)
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })
  return NextResponse.json({ job })
}
