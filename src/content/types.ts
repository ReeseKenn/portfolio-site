export type Locale = "zh" | "en";

export interface SiteContent {
  locales: Record<Locale, LocaleContent>;
}

export interface LocaleContent {
  meta: {
    documentTitle: string;
  };
  nav: NavItem[];
  profile: ProfileContent;
  stats: StatItem[];
  preview: PreviewContent;
  sections: SectionLabels;
  skills: SkillItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  resume: ResumeContent;
  contact: ContactContent;
  footer: string;
}

export interface NavItem {
  label: string;
  targetId: string;
}

export interface ProfileContent {
  brand: string;
  brandMark: string;
  eyebrow: string;
  name: string;
  title: string;
  summary: string;
  tags: string[];
  actions: {
    contact: string;
    resume: string;
    github: string;
  };
  links: {
    email: string;
    github: string;
    resume: string;
  };
}

export interface StatItem {
  value: string;
  label: string;
}

export interface PreviewContent {
  title: string;
  status: string;
  metrics: {
    label: string;
    value: string;
  }[];
  risks: {
    label: string;
    level: string;
    tone: "high" | "mid";
  }[];
}

export interface SectionLabels {
  skills: SectionHeader;
  projects: SectionHeader;
  experience: SectionHeader;
  resume: SectionHeader;
}

export interface SectionHeader {
  kicker: string;
  title: string;
  note: string;
}

export interface SkillItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
  actions: {
    source: string;
    demo: string;
  };
}

export interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  summary: string;
}

export interface ResumeContent {
  title: string;
  summary: string;
  skills: string[];
  projects: {
    title: string;
    stack: string;
    highlights: string[];
  }[];
  education: string;
}

export interface ContactContent {
  title: string;
  description: string;
  actions: {
    email: string;
    resume: string;
  };
}
