-- Public site content defaults. is_public is explicit so new copy remains private.
insert into public.site_content (key, value, "group", is_public)
values
    ('hero.badge', 'Amity University • B.A. Applied Psychology (Hons with Research)', 'hero', true),
    ('hero.title', 'Fostering clinical empathy & relational healing.', 'hero', true),
    ('hero.intro', 'Hello, I''m Aashi Sharma. Currently in my third year of Applied Psychology at Amity University, I bridge empirical scientific research with compassionate intervention strategies. My academic focus centers on understanding attachment mechanisms, emotional regulation, and adult codependency.', 'hero', true),
    ('hero.stat_year', '3rd Year', 'hero', true),
    ('hero.stat_year_label', 'Undergraduate', 'hero', true),
    ('hero.stat_batch', 'Batch 2024-28', 'hero', true),
    ('hero.stat_batch_label', 'Amity Academic timeline', 'hero', true),
    ('hero.stat_focus', 'Clinical Focus', 'hero', true),
    ('hero.stat_focus_label', 'Specialization Goal', 'hero', true),
    ('hero.cta_details', 'View Term Paper Details', 'hero', true),
    ('hero.cta_alignment', 'Clinical Skill Alignment', 'hero', true),
    ('hero.portrait_name', 'Aashi Sharma', 'hero', true),
    ('hero.portrait_degree', 'B.A. Applied Psychology (Hons with Research)', 'hero', true),
    ('hero.portrait_university', 'Amity University, Uttar Pradesh', 'hero', true),
    ('about.eyebrow', 'My Foundation', 'about', true),
    ('about.heading', 'Bridging Scientific Rigor with Deep Human Empathy', 'about', true),
    ('about.approach_title', 'Counselling & Research Approach', 'about', true),
    ('about.approach_1', 'I believe that psychological safety is the absolute starting point for emotional healing. My framework is built upon the synthesis of empirical relationship studies and active, trauma-informed clinical active listening.', 'about', true),
    ('about.approach_2', 'I specialize in identifying early behavior indicators of codependency, interpersonal boundaries, and attachment security transitions within high-stress young adult cohorts.', 'about', true),
    ('about.interests_title', 'Core Academic Interests', 'interests', true),
    ('about.interest_1', 'Counselling Psychology', 'interests', true),
    ('about.interest_2', 'Attachment & Relationships', 'interests', true),
    ('about.interest_3', 'Emotional Regulation', 'interests', true),
    ('about.interest_4', 'Young Adult Mental Health', 'interests', true),
    ('about.interest_5', 'Social Psychology', 'interests', true),
    ('about.interest_6', 'Psychological Research', 'interests', true),
    ('research.badge', 'Amity NTCC Term Paper', 'research', true),
    ('research.highlights_title', 'Term Paper Highlights', 'research', true),
    ('research.draft_label', 'Verified Academic Draft', 'research', true),
    ('research.modal_background_title', 'Background of the Term Paper:', 'research', true),
    ('research.modal_background', 'Submitted to Amity University in partial fulfillment of the requirements for the degree of B.A. Applied Psychology (Hons with Research), this term paper explores the developmental trajectory of Attachment Anxiety into Codependency.', 'research', true),
    ('research.modal_summary_title', 'Abstract Summary:', 'research', true),
    ('research.modal_summary', 'Codependent behaviors emerge predominantly as maladaptive relational mechanisms that individuals utilize to cope with intense, underlying abandonment trauma. Specifically, those suffering from high degrees of Attachment Insecurity construct elaborate, hyper-vigilant relational models to assure emotional availability.', 'research', true),
    ('research.modal_method_title', 'Key Scientific Methodology:', 'research', true),
    ('research.modal_method', 'Using deep, theoretical analysis of multi-study literature from modern clinical researchers (Fonagy, Platts, Kim, Pilkonis, 2020-2023), the paper maps cognitive interpersonal variables and establishes predictive intervention pipelines designed for young adults.', 'research', true),
    ('research.modal_supervision_title', 'Supervisional Support:', 'research', true),
    ('research.modal_supervision', 'Guidance supervised strictly under the academic oversight of Dr. Babita Prusty, Applied Psychology Department, Amity University, Uttar Pradesh.', 'research', true),
    ('clinical.eyebrow', 'Interactive Skill Alignment Matrix', 'clinical', true),
    ('clinical.heading', 'Matching Aashi to Clinical Internship Roles', 'clinical', true),
    ('clinical.description', 'Select any role responsibility from the clinical psychologist job description below to view how Aashi’s Amity academic background directly aligns.', 'clinical', true),
    ('clinical.align_label', 'How I Align', 'clinical', true),
    ('clinical.degree_label', 'B.A. Applied Psychology Focus', 'clinical', true),
    ('contact.eyebrow', 'Connect with Aashi', 'contact', true),
    ('contact.heading', 'Connect Through Email and LinkedIn', 'contact', true),
    ('contact.description', 'For collaborations, internship opportunities, or research conversations, reach out directly through these channels.', 'contact', true),
    ('contact.email_label', 'Email', 'contact', true),
    ('contact.linkedin_label', 'LinkedIn', 'contact', true),
    ('contact.cta', 'Start a Conversation', 'contact', true),
    ('footer.caption', 'Aashi Sharma Portfolio • B.A. Applied Psychology (Hons with Research)', 'footer', true)
on conflict (key) do nothing;

insert into public.site_settings (key, value, is_public)
values
    ('brand_name', 'Aashi Sharma', true),
    ('email', 'creativecaptures139@gmail.com', true),
    ('linkedin_url', 'https://www.linkedin.com/in/aashi-sharma13', true),
    ('tagline', 'Aspiring Clinical Psychologist & Mental Health Researcher', true)
on conflict (key) do nothing;

insert into public.research_projects (
    title, slug, description, supervisor, project_focus, abstract, highlights,
    pdf_path, sort_order, published
)
values (
    'Attachment Anxiety and its Role in Codependent Behavior',
    'attachment-anxiety-codependent-behavior',
    'In her major undergraduate term paper under the supervisional guidance of Dr. Babita Prusty at Amity University, Aashi investigates how attachment insecurity and relational trauma within emerging adult structures predict high-dependency behaviors and cognitive cognitive dissonance.',
    'Dr. Babita Prusty',
    'Attachment Anxiety & Codependency',
    'Attachment anxiety operates as a severe baseline vulnerability predictor. Overactive coping mechanism schemas directly trigger self-sacrificing, over-accommodating codependent cycles.',
    '[{"title":"Theoretical Core","text":"Attachment anxiety operates as a severe baseline vulnerability predictor. Overactive coping mechanism schemas directly trigger self-sacrificing, over-accommodating codependent cycles."},{"title":"Key Literature Citations","text":"Adult attachment insecurity directly predicts high relational dependency, exacerbating interpersonal schema challenges. (Kim & Pilkonis, 2021; Platts et al., 2020)."},{"title":"Clinical Importance","text":"By targetting attachment scripts in early young-adult treatment programs, psychologists can systematically dismantle patterns of anxious codependency before relationship boundaries break down."}]'::jsonb,
    '/downloads/aashi-sharma-ntcc-term-paper.pdf',
    0,
    true
)
on conflict (slug) do nothing;

insert into public.clinical_duties
    (key, label, title, highlight, bullets, quote, sort_order, published)
values
    ('screening', 'Clinical Screening & Intakes', 'Client Screenings & Clinical Intakes', 'Standardized intake forms & rapport formulation', '["Comprehensive training at Amity University on identifying initial clinical patterns of psychological, emotional, and social behavioral issues.","Practical understanding of DSM-5 diagnostic guidelines to support multi-disciplinary care intake and screening workflows.","Skilled in initial interview formatting, active listening protocols, and mapping demographic context safely to clinical systems."]'::jsonb, 'I believe that clinical screeners aren''t just processing paperwork; they represent the first contact point of emotional sanctuary.', 0, true),
    ('treatment', 'Treatment Strategies & Planning', 'Treatment Strategies & Goal Actioning', 'Fostering client autonomy and systematic progress mapping', '["Competency in mapping treatment goals spanning personal, socio-educational, and vocational domains with detailed action loops.","Focusing on evidence-based cognitive-behavioral techniques, psychoeducational modules, and habit loops to drive self-regulation.","Experienced in designing family-coordinated care plans to build lasting, external supportive environments for the client."]'::jsonb, 'Effective therapeutic goals are co-created with the client. It equips them to be active authors of their emotional wellbeing.', 1, true),
    ('assessments', 'Psychometric Assessments', 'Psychometric Assessment & Administration', 'Reliable administration and progress tracking with standard scales', '["Competent in managing VABS, CARS, Beck Depression Inventory (BDI), and Attachment Style measures safely.","Trained in calculating and maintaining secure records of assessments, tracking ongoing progress through regular, structured meetings.","Adept at compiling clear, structured data outputs for multidisciplinary intake and psychiatrist care teams."]'::jsonb, 'Objective assessment acts as a structural baseline, validating progress while maintaining high standards of clinical credibility.', 2, true),
    ('workshops', 'Workshop & Module Design', 'Workshop Module & Curriculum Design', 'Creating high-impact wellness courses for institutions', '["Competency in planning psychological wellbeing curricula customized for schools, corporate structures, and non-profits.","Formulating focus areas: Stress inoculation, emotional regulation, and fostering healthy peer attachment dynamics on campus.","Designing interactive assets, feedback loops, and self-assessment tools to ensure highly engaging, scalable educational reach."]'::jsonb, 'Group workshops demystify psychotherapy and create critical pathways for early clinical interventions.', 3, true),
    ('advocacy', 'Outreach, Writing & Media', 'Advocacy Outreach, Writing & Media', 'Reaching communities with actionable, accessible mental health writing', '["Experienced in writing articles designed for newsletters, newspapers, and platform library pipelines (similar to Mpower).","Curating high-quality graphics and captions for social media outlets to destigmatize therapy seeking across youth groups.","Structuring content specifically aimed at bridging communication gaps between parents and students undergoing high stress."]'::jsonb, 'Stigma flourishes in silence. Clear, scientific yet simple communication is the strongest antidote to mental health hesitation.', 4, true)
on conflict (key) do nothing;

insert into public.contact_links (label, type, value, sort_order, published)
select seed.label, seed.type, seed.value, seed.sort_order, seed.published
from (values
    ('Email'::text, 'email'::text, 'creativecaptures139@gmail.com'::text, 0::int, true),
    ('LinkedIn'::text, 'url'::text, 'https://www.linkedin.com/in/aashi-sharma13'::text, 1::int, true)
) as seed(label, type, value, sort_order, published)
where not exists (
    select 1 from public.contact_links existing
    where existing.label = seed.label and existing.type = seed.type and existing.value = seed.value
);
