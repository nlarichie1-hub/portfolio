export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  website: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  description?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface Project {
  title: string;
  description: string;
  achievements: string[];
  techStack: string[];
  link?: string;
}

export interface Achievement {
  title: string;
  description: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  avatarUrl: string;
  careerObjective: string;
  professionalSummary: string;
  contact: ContactInfo;
  education: Education[];
  skills: SkillCategory[];
  experience: Experience[];
  certifications: Certification[];
  projects: Project[];
  achievements: Achievement[];
  interests: string[];
}
