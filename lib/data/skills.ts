import { Skill } from "../domain/types";

export const SKILLS_CATALOG: Skill[] = [
  // Transferable (5 skills)
  {
    id: "communication",
    name: "Communication",
    category: "Transferable",
    sdgs: [4, 8, 16],
    description: "Clear articulation of complex concepts, active listening, stakeholder reporting, and cross-functional collaboration.",
  },
  {
    id: "organization",
    name: "Project coordination",
    category: "Transferable",
    sdgs: [8, 9, 17],
    description: "Agile task scheduling, milestone tracking, resource management, and risk mitigation across team workflows.",
  },
  {
    id: "ethics",
    name: "Responsible AI",
    category: "Transferable",
    sdgs: [5, 10, 16],
    description: "AI governance, algorithmic fairness, privacy protection, and ethical risk evaluation in automated systems.",
  },
  {
    id: "design",
    name: "User research & design",
    category: "Transferable",
    sdgs: [10, 11],
    description: "Human-centered design thinking, usability testing, wireframing, and user requirement elicitation.",
  },
  {
    id: "teaching",
    name: "Training & facilitation",
    category: "Transferable",
    sdgs: [4, 10],
    description: "Designing structured curricula, running capability workshops, mentoring peers, and evaluating learning outcomes.",
  },

  // Digital (5 skills)
  {
    id: "excel",
    name: "Spreadsheets & Excel",
    category: "Digital",
    sdgs: [8, 9],
    description: "Advanced lookup formulas, pivot tables, data modeling, Power Query, and business reporting automation.",
  },
  {
    id: "analysis",
    name: "Data analysis",
    category: "Digital",
    sdgs: [8, 9, 12],
    description: "Statistical analysis, data visualization, metric dashboards, and trend extraction for decision support.",
  },
  {
    id: "ai",
    name: "AI literacy",
    category: "Digital",
    sdgs: [4, 8, 9],
    description: "Prompt engineering, generative AI tooling, LLM capabilities and limitations, and ethical workflow enhancement.",
  },
  {
    id: "sustainability",
    name: "Sustainability analysis",
    category: "Digital",
    sdgs: [7, 12, 13],
    description: "Carbon footprint accounting, ESG metrics reporting, lifecycle analysis, and environmental compliance frameworks.",
  },
  {
    id: "health",
    name: "Health data literacy",
    category: "Digital",
    sdgs: [3, 6],
    description: "Biomedical informatics, healthcare privacy standards (PDPA/HIPAA), and clinical metric interpretation.",
  },

  // Technical (9 skills)
  {
    id: "python",
    name: "Python programming",
    category: "Technical",
    sdgs: [4, 9],
    description: "Core Python scripting, Pandas, NumPy, object-oriented design, and API integration for data and automation.",
  },
  {
    id: "sql",
    name: "SQL & databases",
    category: "Technical",
    sdgs: [9, 16],
    description: "Relational database querying, multi-table joins, indexing, query optimization, and schema design.",
  },
  {
    id: "ml",
    name: "Machine learning",
    category: "Technical",
    sdgs: [3, 9, 13],
    description: "Supervised and unsupervised models, feature engineering, model evaluation, and scikit-learn/TensorFlow pipelines.",
  },
  {
    id: "automation",
    name: "Workflow automation",
    category: "Technical",
    sdgs: [8, 9, 12],
    description: "RPA pipelines, webhook integrations, CI/CD pipelines, and process orchestration tooling.",
  },
  {
    id: "maintenance",
    name: "Equipment maintenance",
    category: "Technical",
    sdgs: [9, 12],
    description: "Preventative machinery maintenance, industrial telemetry diagnostic interpretation, and calibration.",
  },
  {
    id: "iot",
    name: "Industrial IoT",
    category: "Technical",
    sdgs: [7, 9, 11],
    description: "Edge sensor networks, MQTT protocols, microcontroller telemetry ingestion, and smart factory architecture.",
  },
  {
    id: "cloud",
    name: "Cloud computing",
    category: "Technical",
    sdgs: [9, 17],
    description: "Cloud infrastructure provisioning (AWS/GCP/Azure), containerization, serverless functions, and storage.",
  },
  {
    id: "security",
    name: "Cybersecurity",
    category: "Technical",
    sdgs: [9, 16],
    description: "Threat modeling, network security, identity and access management (IAM), and vulnerability assessment.",
  },
  {
    id: "agriculture",
    name: "Precision agriculture",
    category: "Technical",
    sdgs: [1, 2, 14, 15],
    description: "Smart crop monitoring, precision irrigation sensors, yield telemetry, and agricultural IoT devices.",
  },
];

export const SKILLS_BY_ID = new Map(SKILLS_CATALOG.map((s) => [s.id, s]));
