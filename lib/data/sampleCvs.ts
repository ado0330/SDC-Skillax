export interface SampleCv {
  id: string;
  label: string;
  name: string;
  occupation: string;
  industry: string;
  education: string;
  experience: number;
  interests: string[];
  professionalSummary: string;
  experienceSummary: string;
  skills: Record<string, number>;
  additionalSkills: { name: string; level: number }[];
  cvText: string;
}

export const SAMPLE_CVS: SampleCv[] = [
  {
    id: "sample-aina",
    label: "Sample 1: Operations Coordinator (Mid-Career)",
    name: "Aina binti Abdullah",
    occupation: "Operations Coordinator",
    industry: "Business & Services",
    education: "B.Sc. in Business Administration, Universiti Malaya (2019)",
    experience: 7,
    interests: ["Business & Services", "Data Analytics", "Workflow Automation"],
    professionalSummary: "Detail-oriented corporate operations coordinator with 7 years of cross-functional team coordination, vendor management, and advanced spreadsheet reporting experience.",
    experienceSummary: "Managed daily operational scheduling for 45 team members. Automated weekly inventory reconciliation using Excel pivot tables and formulas. Coordinated cross-departmental stakeholder communications and quarterly milestone presentations.",
    skills: {
      communication: 4,
      organization: 5,
      excel: 4,
      analysis: 2,
      ai: 1,
      automation: 2,
      ethics: 3,
    },
    additionalSkills: [
      { name: "Vendor Contract Negotiation", level: 4 },
      { name: "Supply Chain Reconciliation", level: 3 },
    ],
    cvText: `AINA BINTI ABDULLAH
Kuala Lumpur, Malaysia | aina.sample@skillax.demo

PROFESSIONAL SUMMARY
Dynamic Operations Coordinator with 7 years of experience streamlining administrative workflows, coordinating logistics teams, and optimizing reporting through advanced Microsoft Excel data modeling.

CORE COMPETENCIES
- Team Coordination & Sprint Scheduling (Project coordination: Level 5)
- Stakeholder Briefings & Written Reporting (Communication: Level 4)
- Complex Pivot Tables & Financial Reconciliation (Excel: Level 4)
- Exploratory Trend Analysis (Data analysis: Level 2)
- Workflow Automation & Form Scripting (Workflow automation: Level 2)
- Emerging AI Tooling Exploration (AI literacy: Level 1)

PROFESSIONAL EXPERIENCE
Senior Operations Coordinator | Megah Logistics Sdn Bhd (2021 - Present)
- Coordinated cross-departmental task delivery across 4 regional transport hubs.
- Overhauled manual vehicle logbooks into automated Excel spreadsheets, saving 12 hours weekly.
- Facilitated weekly operational alignment meetings with corporate clients.

Operations Executive | Berjaya Distribution (2019 - 2021)
- Managed purchase orders, inventory counts, and procurement invoicing.

EDUCATION
Bachelor of Science in Business Administration
Universiti Malaya, Graduated 2019`,
  },
  {
    id: "sample-daniel",
    label: "Sample 2: Junior Data Specialist (Early Career)",
    name: "Daniel Lee Wei Jie",
    occupation: "Junior Data Analyst",
    industry: "Technology",
    education: "B.Comp.Sc. in Data Science, Universiti Sains Malaysia (2024)",
    experience: 2,
    interests: ["Technology", "Machine Learning", "Cloud Systems"],
    professionalSummary: "Data science graduate with strong programming foundations in Python, PostgreSQL querying, and exploratory statistical data visualization.",
    experienceSummary: "Developed automated data ingestion scripts in Python, wrote complex multi-table SQL queries, and generated business dashboards for customer churn tracking.",
    skills: {
      python: 4,
      sql: 4,
      analysis: 4,
      excel: 3,
      ai: 2,
      ml: 2,
      cloud: 2,
      communication: 2,
    },
    additionalSkills: [
      { name: "Git Version Control", level: 4 },
      { name: "Docker Containerization", level: 2 },
    ],
    cvText: `DANIEL LEE WEI JIE
Penang, Malaysia | daniel.sample@skillax.demo

PROFESSIONAL SUMMARY
Enthusiastic Junior Data Analyst with 2 years of hands-on experience querying large SQL databases, building automated Python transformation pipelines, and crafting statistical visualizations.

CORE COMPETENCIES
- Python Data Scripting & Pandas (Python programming: Level 4)
- SQL Multi-Table Queries & Aggregations (SQL & databases: Level 4)
- Exploratory Metric Analysis (Data analysis: Level 4)
- Business Reporting & Dashboards (Excel: Level 3)
- Machine Learning Model Foundations (Machine learning: Level 2)
- Cloud Compute Fundamentals (Cloud computing: Level 2)
- Generative AI Prompting (AI literacy: Level 2)

PROFESSIONAL EXPERIENCE
Junior Data Analyst | TechPulse Analytics (2024 - Present)
- Designed and maintained automated Python ETL jobs processing daily telemetry.
- Optimized 20+ SQL database queries, cutting report generation runtimes by 40%.
- Built customer cohort retention visualizations for marketing stakeholders.

EDUCATION
Bachelor of Computer Science (Data Science)
Universiti Sains Malaysia, Graduated 2024`,
  },
  {
    id: "sample-kumar",
    label: "Sample 3: Plant Maintenance Supervisor (Manufacturing)",
    name: "Kumar a/l Subramaniam",
    occupation: "Plant Maintenance Supervisor",
    industry: "Manufacturing",
    education: "Diploma in Mechanical Engineering, Politeknik Ungku Omar (2015)",
    experience: 11,
    interests: ["Manufacturing", "Industrial IoT", "Sustainability"],
    professionalSummary: "Seasoned industrial plant supervisor with over a decade of mechanical diagnostics, preventative equipment maintenance, and technician safety training experience.",
    experienceSummary: "Supervised 15 line technicians in an automotive parts manufacturing facility. Maintained high equipment uptime (98.5%) and coordinated scheduled preventative overhauls.",
    skills: {
      maintenance: 5,
      organization: 3,
      communication: 3,
      iot: 2,
      automation: 2,
      sustainability: 2,
      analysis: 2,
    },
    additionalSkills: [
      { name: "Hydraulics & Pneumatics", level: 5 },
      { name: "Factory Safety Compliance (DOSH)", level: 4 },
    ],
    cvText: `KUMAR A/L SUBRAMANIAM
Ipoh, Perak, Malaysia | kumar.sample@skillax.demo

PROFESSIONAL SUMMARY
Proactive Plant Maintenance Supervisor with 11 years of experience in heavy machinery calibration, preventative maintenance regimes, and industrial safety compliance.

CORE COMPETENCIES
- Equipment Diagnostics & Repair (Equipment maintenance: Level 5)
- Team Shift Scheduling (Project coordination: Level 3)
- Cross-Functional Safety Briefings (Communication: Level 3)
- Basic Telemetry Sensor Monitoring (Industrial IoT: Level 2)
- Automated Conveyor Tuning (Workflow automation: Level 2)
- Energy & Scrap Waste Reduction (Sustainability analysis: Level 2)

PROFESSIONAL EXPERIENCE
Plant Maintenance Supervisor | Perak Precision Forging (2018 - Present)
- Oversaw preventative maintenance across 12 stamping press lines with 98.5% uptime.
- Led incident root-cause investigations and safety audit preparations.

Senior Maintenance Technician | Kinta Metalworks (2015 - 2018)
- Executed mechanical overhauls and sensor calibrations.

EDUCATION
Diploma in Mechanical Engineering
Politeknik Ungku Omar, Graduated 2015`,
  },
];
