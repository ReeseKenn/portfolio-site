import { useEffect, useMemo, useState } from "react";
import { siteContent } from "./content/siteContent";
import type {
  Locale,
  LocaleContent,
  PreviewContent,
  ProjectItem,
  SectionHeader as SectionHeaderContent
} from "./content/types";

const localeKeys = Object.keys(siteContent.locales) as Locale[];

function getInitialLocale(): Locale {
  const storedLocale = window.localStorage.getItem("portfolio-locale") as Locale | null;

  if (storedLocale && siteContent.locales[storedLocale]) {
    return storedLocale;
  }

  return "zh";
}

export function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const content = siteContent.locales[locale];

  useEffect(() => {
    document.title = content.meta.documentTitle;
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem("portfolio-locale", locale);
  }, [content.meta.documentTitle, locale]);

  const alternateLocale = useMemo(
    () => localeKeys.find((localeKey) => localeKey !== locale) ?? locale,
    [locale]
  );

  return (
    <div className="page">
      <Header
        content={content}
        locale={locale}
        alternateLocale={alternateLocale}
        isMenuOpen={isMenuOpen}
        onLocaleChange={setLocale}
        onMenuToggle={() => setIsMenuOpen((open) => !open)}
        onNavigate={() => setIsMenuOpen(false)}
      />

      <main>
        <Hero content={content} />
        <SkillsSection content={content} />
        <ProjectsSection content={content} />
        <ExperienceSection content={content} />
        <ResumeSection content={content} />
        <ContactSection content={content} />
      </main>

      <footer className="footer">
        <div className="footer-inner">{content.footer}</div>
      </footer>
    </div>
  );
}

interface HeaderProps {
  content: LocaleContent;
  locale: Locale;
  alternateLocale: Locale;
  isMenuOpen: boolean;
  onLocaleChange: (locale: Locale) => void;
  onMenuToggle: () => void;
  onNavigate: () => void;
}

function Header({
  content,
  locale,
  alternateLocale,
  isMenuOpen,
  onLocaleChange,
  onMenuToggle,
  onNavigate
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="#overview" onClick={onNavigate}>
          <span className="brand-mark">{content.profile.brandMark}</span>
          <span>{content.profile.brand}</span>
        </a>

        <nav className="nav">
          {content.nav.map((navItem) => (
            <a key={navItem.targetId} href={`#${navItem.targetId}`}>
              {navItem.label}
            </a>
          ))}
          <LanguageSwitch
            locale={locale}
            alternateLocale={alternateLocale}
            onLocaleChange={onLocaleChange}
          />
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          onClick={onMenuToggle}
        >
          <span />
        </button>
      </div>

      {isMenuOpen ? (
        <nav className="mobile-nav">
          {content.nav.map((navItem) => (
            <a key={navItem.targetId} href={`#${navItem.targetId}`} onClick={onNavigate}>
              {navItem.label}
            </a>
          ))}
          <LanguageSwitch
            locale={locale}
            alternateLocale={alternateLocale}
            onLocaleChange={onLocaleChange}
          />
        </nav>
      ) : null}
    </header>
  );
}

interface LanguageSwitchProps {
  locale: Locale;
  alternateLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

function LanguageSwitch({ locale, alternateLocale, onLocaleChange }: LanguageSwitchProps) {
  return (
    <div className="lang-switch">
      <button className="active" type="button" onClick={() => onLocaleChange(locale)}>
        {locale.toUpperCase()}
      </button>
      <button type="button" onClick={() => onLocaleChange(alternateLocale)}>
        {alternateLocale.toUpperCase()}
      </button>
    </div>
  );
}

function Hero({ content }: { content: LocaleContent }) {
  return (
    <section className="section hero" id="overview">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          {content.profile.eyebrow}
        </div>
        <h1>{content.profile.name}</h1>
        <div className="hero-title">{content.profile.title}</div>
        <p className="hero-summary">{content.profile.summary}</p>
        <div className="actions">
          <a className="button primary" href={content.profile.links.email}>
            {content.profile.actions.contact}
          </a>
          <a className="button" href={content.profile.links.resume}>
            {content.profile.actions.resume}
          </a>
          <a className="button" href={content.profile.links.github} target="_blank" rel="noreferrer">
            {content.profile.actions.github}
          </a>
        </div>
        <div className="tag-row">
          {content.profile.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <aside className="hero-panel">
        <div className="panel-header">
          <div className="panel-title">{content.preview.title}</div>
          <div className="status">{content.preview.status}</div>
        </div>
        <div className="metric-grid">
          {content.stats.map((stat) => (
            <div className="metric-card" key={`${stat.value}-${stat.label}`}>
              <div className="metric-value">{stat.value}</div>
              <div className="metric-label">{stat.label}</div>
            </div>
          ))}
        </div>
        <DashboardPreview preview={content.preview} />
      </aside>
    </section>
  );
}

function DashboardPreview({ preview }: { preview: PreviewContent }) {
  const bars = [46, 66, 54, 82, 72, 92];

  return (
    <div className="preview-card">
      <div className="preview-toolbar">
        <i />
        <i />
        <i />
      </div>
      <div className="dashboard-preview">
        <div className="dash-top">
          {preview.metrics.map((metric) => (
            <div className="dash-chip" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
        <div className="chart">
          {bars.map((height, index) => (
            <div className="bar" style={{ height: `${height}%` }} key={height + index} />
          ))}
        </div>
        <div className="risk-list">
          {preview.risks.map((risk) => (
            <div className="risk-row" key={risk.label}>
              <span>{risk.label}</span>
              <span className={`risk-level ${risk.tone}`}>{risk.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ header }: { header: SectionHeaderContent }) {
  return (
    <div className="section-heading">
      <div>
        <p className="section-kicker">{header.kicker}</p>
        <h2>{header.title}</h2>
      </div>
      <p className="section-note">{header.note}</p>
    </div>
  );
}

function SkillsSection({ content }: { content: LocaleContent }) {
  return (
    <section className="section" id="skills">
      <SectionHeader header={content.sections.skills} />
      <div className="skills-grid">
        {content.skills.map((skill) => (
          <article className="skill-card" key={skill.title}>
            <div className="skill-icon">{skill.icon}</div>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ content }: { content: LocaleContent }) {
  const [featuredProject, ...otherProjects] = content.projects;

  return (
    <section className="section" id="projects">
      <SectionHeader header={content.sections.projects} />
      {featuredProject ? <FeaturedProject project={featuredProject} preview={content.preview} /> : null}
      {otherProjects.length > 0 ? (
        <div className="project-list">
          {otherProjects.map((project, index) => (
            <CompactProject project={project} imageSide={index % 2 === 0 ? "right" : "left"} key={project.title} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function FeaturedProject({
  project,
  preview
}: {
  project: ProjectItem;
  preview: PreviewContent;
}) {
  return (
    <article className="project-card">
      <div className="project-copy">
        <h3>{project.title}</h3>
        <div className="project-subtitle">{project.subtitle}</div>
        <p className="project-description">{project.description}</p>
        <div className="tag-row compact">
          {project.techStack.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <ul className="highlight-list">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <ProjectActions project={project} />
      </div>
      <div className="project-visual">
        <DashboardPreview preview={preview} />
      </div>
    </article>
  );
}

function CompactProject({
  project,
  imageSide
}: {
  project: ProjectItem;
  imageSide: "left" | "right";
}) {
  return (
    <article className={`compact-project-card ${project.imageUrl ? "has-image" : ""} image-${imageSide}`}>
      <div className="compact-project-content">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <div className="tag-row compact">
          {project.techStack.map((tech) => (
            <span className="tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
        <ProjectActions project={project} />
      </div>
      {project.imageUrl ? (
        <a
          className="project-image-link"
          href={project.imageUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} screenshot`}
        >
          <img src={project.imageUrl} alt={`${project.title} screenshot`} />
        </a>
      ) : null}
    </article>
  );
}

function ProjectActions({ project }: { project: ProjectItem }) {
  return (
    <div className="actions">
      {project.githubUrl ? (
        <a className="button primary" href={project.githubUrl} target="_blank" rel="noreferrer">
          {project.actions.source}
        </a>
      ) : null}
      {project.demoUrl ? (
        <a className="button" href={project.demoUrl} target="_blank" rel="noreferrer">
          {project.actions.demo}
        </a>
      ) : null}
    </div>
  );
}

function ExperienceSection({ content }: { content: LocaleContent }) {
  return (
    <section className="section" id="experience">
      <SectionHeader header={content.sections.experience} />
      <div className="experience-list">
        {content.experience.map((experience) => (
          <article className="experience-card" key={`${experience.company}-${experience.period}`}>
            <div className="period">{experience.period}</div>
            <div>
              <h3>{experience.company}</h3>
              <div className="role">{experience.role}</div>
              <p>{experience.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResumeSection({ content }: { content: LocaleContent }) {
  return (
    <section className="section" id="resume">
      <SectionHeader header={content.sections.resume} />
      <article className="resume-card">
        <h3>{content.resume.title}</h3>
        <p className="resume-summary">{content.resume.summary}</p>
        <div className="resume-grid">
          <div>
            <ul className="highlight-list">
              {content.resume.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div className="resume-projects">
            {content.resume.projects.map((project) => (
              <div className="resume-project" key={project.title}>
                <h4>{project.title}</h4>
                <div className="project-subtitle">{project.stack}</div>
                <ul className="highlight-list">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="education">{content.resume.education}</div>
      </article>
    </section>
  );
}

function ContactSection({ content }: { content: LocaleContent }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-card">
        <div>
          <h2>{content.contact.title}</h2>
          <p>{content.contact.description}</p>
        </div>
        <div className="actions">
          <a className="button" href={content.profile.links.email}>
            {content.contact.actions.email}
          </a>
          <a className="button" href={content.profile.links.resume}>
            {content.contact.actions.resume}
          </a>
        </div>
      </div>
    </section>
  );
}
