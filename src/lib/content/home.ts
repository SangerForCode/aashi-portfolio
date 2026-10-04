import { createClient } from "@/lib/supabase/server";

export type HomeContent = Record<string, string>;

export interface ResearchHighlight {
  title: string;
  text: string;
}

export interface ResearchProject {
  title: string;
  slug: string;
  description: string;
  supervisor: string;
  project_focus: string;
  abstract: string;
  highlights: ResearchHighlight[];
  pdf_path: string;
}

export interface ClinicalDuty {
  key: string;
  label: string;
  title: string;
  highlight: string;
  bullets: string[];
  quote: string;
}

export interface ContactLink {
  label: string;
  type: "email" | "url";
  value: string;
}

export interface HomePageData {
  content: HomeContent;
  settings: Record<string, string>;
  research: ResearchProject;
  clinicalDuties: ClinicalDuty[];
  contactLinks: ContactLink[];
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  "hero.badge": "Amity University • B.A. Applied Psychology (Hons with Research)",
  "hero.title": "Fostering clinical empathy & relational healing.",
  "hero.intro":
    "Hello, I'm Aashi Sharma. Currently in my third year of Applied Psychology at Amity University, I bridge empirical scientific research with compassionate intervention strategies. My academic focus centers on understanding attachment mechanisms, emotional regulation, and adult codependency.",
  "hero.stat_year": "3rd Year",
  "hero.stat_year_label": "Undergraduate",
  "hero.stat_batch": "Batch 2024-28",
  "hero.stat_batch_label": "Amity Academic timeline",
  "hero.stat_focus": "Clinical Focus",
  "hero.stat_focus_label": "Specialization Goal",
  "hero.cta_details": "View Term Paper Details",
  "hero.cta_alignment": "Clinical Skill Alignment",
  "hero.portrait_name": "Aashi Sharma",
  "hero.portrait_degree": "B.A. Applied Psychology (Hons with Research)",
  "hero.portrait_university": "Amity University, Uttar Pradesh",
  "about.eyebrow": "My Foundation",
  "about.heading": "Bridging Scientific Rigor with Deep Human Empathy",
  "about.approach_title": "Counselling & Research Approach",
  "about.approach_1":
    "I believe that psychological safety is the absolute starting point for emotional healing. My framework is built upon the synthesis of empirical relationship studies and active, trauma-informed clinical active listening.",
  "about.approach_2":
    "I specialize in identifying early behavior indicators of codependency, interpersonal boundaries, and attachment security transitions within high-stress young adult cohorts.",
  "about.interests_title": "Core Academic Interests",
  "about.interest_1": "Counselling Psychology",
  "about.interest_2": "Attachment & Relationships",
  "about.interest_3": "Emotional Regulation",
  "about.interest_4": "Young Adult Mental Health",
  "about.interest_5": "Social Psychology",
  "about.interest_6": "Psychological Research",
  "research.badge": "Amity NTCC Term Paper",
  "research.highlights_title": "Term Paper Highlights",
  "research.draft_label": "Verified Academic Draft",
  "research.modal_background_title": "Background of the Term Paper:",
  "research.modal_background":
    "Submitted to Amity University in partial fulfillment of the requirements for the degree of B.A. Applied Psychology (Hons with Research), this term paper explores the developmental trajectory of Attachment Anxiety into Codependency.",
  "research.modal_summary_title": "Abstract Summary:",
  "research.modal_summary":
    "Codependent behaviors emerge predominantly as maladaptive relational mechanisms that individuals utilize to cope with intense, underlying abandonment trauma. Specifically, those suffering from high degrees of Attachment Insecurity construct elaborate, hyper-vigilant relational models to assure emotional availability.",
  "research.modal_method_title": "Key Scientific Methodology:",
  "research.modal_method":
    "Using deep, theoretical analysis of multi-study literature from modern clinical researchers (Fonagy, Platts, Kim, Pilkonis, 2020-2023), the paper maps cognitive interpersonal variables and establishes predictive intervention pipelines designed for young adults.",
  "research.modal_supervision_title": "Supervisional Support:",
  "research.modal_supervision":
    "Guidance supervised strictly under the academic oversight of Dr. Babita Prusty, Applied Psychology Department, Amity University, Uttar Pradesh.",
  "clinical.eyebrow": "Interactive Skill Alignment Matrix",
  "clinical.heading": "Matching Aashi to Clinical Internship Roles",
  "clinical.description":
    "Select any role responsibility from the clinical psychologist job description below to view how Aashi’s Amity academic background directly aligns.",
  "clinical.align_label": "How I Align",
  "clinical.degree_label": "B.A. Applied Psychology Focus",
  "contact.eyebrow": "Connect with Aashi",
  "contact.heading": "Connect Through Email and LinkedIn",
  "contact.description":
    "For collaborations, internship opportunities, or research conversations, reach out directly through these channels.",
  "contact.email_label": "Email",
  "contact.linkedin_label": "LinkedIn",
  "contact.cta": "Start a Conversation",
  "footer.caption":
    "Aashi Sharma Portfolio • B.A. Applied Psychology (Hons with Research)",
};

export const DEFAULT_RESEARCH_PROJECT: ResearchProject = {
  title: "Attachment Anxiety and its Role in Codependent Behavior",
  slug: "attachment-anxiety-codependent-behavior",
  description:
    "In her major undergraduate term paper under the supervisional guidance of Dr. Babita Prusty at Amity University, Aashi investigates how attachment insecurity and relational trauma within emerging adult structures predict high-dependency behaviors and cognitive cognitive dissonance.",
  supervisor: "Dr. Babita Prusty",
  project_focus: "Attachment Anxiety & Codependency",
  abstract:
    "Attachment anxiety operates as a severe baseline vulnerability predictor. Overactive coping mechanism schemas directly trigger self-sacrificing, over-accommodating codependent cycles.",
  highlights: [
    {
      title: "Theoretical Core",
      text: "Attachment anxiety operates as a severe baseline vulnerability predictor. Overactive coping mechanism schemas directly trigger self-sacrificing, over-accommodating codependent cycles.",
    },
    {
      title: "Key Literature Citations",
      text: "Adult attachment insecurity directly predicts high relational dependency, exacerbating interpersonal schema challenges. (Kim & Pilkonis, 2021; Platts et al., 2020).",
    },
    {
      title: "Clinical Importance",
      text: "By targetting attachment scripts in early young-adult treatment programs, psychologists can systematically dismantle patterns of anxious codependency before relationship boundaries break down.",
    },
  ],
  pdf_path: "/downloads/aashi-sharma-ntcc-term-paper.pdf",
};

export const DEFAULT_CLINICAL_DUTIES: ClinicalDuty[] = [
  {
    key: "screening",
    label: "Clinical Screening & Intakes",
    title: "Client Screenings & Clinical Intakes",
    highlight: "Standardized intake forms & rapport formulation",
    bullets: [
      "Comprehensive training at Amity University on identifying initial clinical patterns of psychological, emotional, and social behavioral issues.",
      "Practical understanding of DSM-5 diagnostic guidelines to support multi-disciplinary care intake and screening workflows.",
      "Skilled in initial interview formatting, active listening protocols, and mapping demographic context safely to clinical systems.",
    ],
    quote:
      "I believe that clinical screeners aren't just processing paperwork; they represent the first contact point of emotional sanctuary.",
  },
  {
    key: "treatment",
    label: "Treatment Strategies & Planning",
    title: "Treatment Strategies & Goal Actioning",
    highlight: "Fostering client autonomy and systematic progress mapping",
    bullets: [
      "Competency in mapping treatment goals spanning personal, socio-educational, and vocational domains with detailed action loops.",
      "Focusing on evidence-based cognitive-behavioral techniques, psychoeducational modules, and habit loops to drive self-regulation.",
      "Experienced in designing family-coordinated care plans to build lasting, external supportive environments for the client.",
    ],
    quote:
      "Effective therapeutic goals are co-created with the client. It equips them to be active authors of their emotional wellbeing.",
  },
  {
    key: "assessments",
    label: "Psychometric Assessments",
    title: "Psychometric Assessment & Administration",
    highlight: "Reliable administration and progress tracking with standard scales",
    bullets: [
      "Competent in managing VABS, CARS, Beck Depression Inventory (BDI), and Attachment Style measures safely.",
      "Trained in calculating and maintaining secure records of assessments, tracking ongoing progress through regular, structured meetings.",
      "Adept at compiling clear, structured data outputs for multidisciplinary intake and psychiatrist care teams.",
    ],
    quote:
      "Objective assessment acts as a structural baseline, validating progress while maintaining high standards of clinical credibility.",
  },
  {
    key: "workshops",
    label: "Workshop & Module Design",
    title: "Workshop Module & Curriculum Design",
    highlight: "Creating high-impact wellness courses for institutions",
    bullets: [
      "Competency in planning psychological wellbeing curricula customized for schools, corporate structures, and non-profits.",
      "Formulating focus areas: Stress inoculation, emotional regulation, and fostering healthy peer attachment dynamics on campus.",
      "Designing interactive assets, feedback loops, and self-assessment tools to ensure highly engaging, scalable educational reach.",
    ],
    quote:
      "Group workshops demystify psychotherapy and create critical pathways for early clinical interventions.",
  },
  {
    key: "advocacy",
    label: "Outreach, Writing & Media",
    title: "Advocacy Outreach, Writing & Media",
    highlight: "Reaching communities with actionable, accessible mental health writing",
    bullets: [
      "Experienced in writing articles designed for newsletters, newspapers, and platform library pipelines (similar to Mpower).",
      "Curating high-quality graphics and captions for social media outlets to destigmatize therapy seeking across youth groups.",
      "Structuring content specifically aimed at bridging communication gaps between parents and students undergoing high stress.",
    ],
    quote:
      "Stigma flourishes in silence. Clear, scientific yet simple communication is the strongest antidote to mental health hesitation.",
  },
];

export const DEFAULT_CONTACT_LINKS: ContactLink[] = [
  { label: "Email", type: "email", value: "creativecaptures139@gmail.com" },
  {
    label: "LinkedIn",
    type: "url",
    value: "https://www.linkedin.com/in/aashi-sharma13",
  },
];

const DEFAULT_SETTINGS = {
  brand_name: "Aashi Sharma",
  email: "creativecaptures139@gmail.com",
  linkedin_url: "https://www.linkedin.com/in/aashi-sharma13",
  tagline: "Aspiring Clinical Psychologist & Mental Health Researcher",
};

function parseHighlights(value: unknown): ResearchHighlight[] | null {
  if (!Array.isArray(value)) return null;

  const highlights = value.filter(
    (item): item is ResearchHighlight =>
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      typeof item.title === "string" &&
      "text" in item &&
      typeof item.text === "string",
  );

  return highlights.length ? highlights : null;
}

function parseBullets(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : [];
}

export async function getHomePageData(): Promise<HomePageData> {
  const fallback: HomePageData = {
    content: DEFAULT_HOME_CONTENT,
    settings: DEFAULT_SETTINGS,
    research: DEFAULT_RESEARCH_PROJECT,
    clinicalDuties: DEFAULT_CLINICAL_DUTIES,
    contactLinks: DEFAULT_CONTACT_LINKS,
  };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    const [contentResult, settingsResult, researchResult, dutiesResult, linksResult] =
      await Promise.all([
        supabase
          .from("site_content")
          .select("key, value")
          .eq("is_public", true)
          .returns<{ key: string; value: string }[]>(),
        supabase
          .from("site_settings")
          .select("key, value")
          .eq("is_public", true)
          .returns<{ key: string; value: string }[]>(),
        supabase
          .from("research_projects")
          .select(
            "title, slug, description, supervisor, project_focus, abstract, highlights, pdf_path",
          )
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("clinical_duties")
          .select("key, label, title, highlight, bullets, quote")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .returns<ClinicalDuty[]>(),
        supabase
          .from("contact_links")
          .select("label, type, value")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .returns<ContactLink[]>(),
      ]);

    const content = {
      ...DEFAULT_HOME_CONTENT,
      ...Object.fromEntries((contentResult.data ?? []).map(({ key, value }) => [key, value])),
    };
    const settings = {
      ...DEFAULT_SETTINGS,
      ...Object.fromEntries((settingsResult.data ?? []).map(({ key, value }) => [key, value])),
    };

    const researchRow = researchResult.data;
    const research = researchRow
      ? {
          ...DEFAULT_RESEARCH_PROJECT,
          ...researchRow,
          description:
            researchRow.description ?? DEFAULT_RESEARCH_PROJECT.description,
          supervisor:
            researchRow.supervisor ?? DEFAULT_RESEARCH_PROJECT.supervisor,
          project_focus:
            researchRow.project_focus ?? DEFAULT_RESEARCH_PROJECT.project_focus,
          abstract: researchRow.abstract ?? DEFAULT_RESEARCH_PROJECT.abstract,
          highlights:
            parseHighlights(researchRow.highlights) ??
            DEFAULT_RESEARCH_PROJECT.highlights,
          pdf_path: researchRow.pdf_path ?? DEFAULT_RESEARCH_PROJECT.pdf_path,
        }
      : DEFAULT_RESEARCH_PROJECT;

    const clinicalDuties = (dutiesResult.data ?? []).map((duty) => ({
      ...duty,
      highlight: duty.highlight ?? "",
      quote: duty.quote ?? "",
      bullets: parseBullets(duty.bullets),
    }));

    return {
      content,
      settings,
      research,
      clinicalDuties: clinicalDuties.length
        ? clinicalDuties
        : DEFAULT_CLINICAL_DUTIES,
      contactLinks:
        linksResult.data?.length ? linksResult.data : DEFAULT_CONTACT_LINKS,
    };
  } catch {
    return fallback;
  }
}
