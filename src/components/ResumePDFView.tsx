import React from "react";
import { PortfolioData } from "../types";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Briefcase, BookOpen, Layers, Star, Compass } from "lucide-react";

interface ResumePDFViewProps {
  data: PortfolioData;
  styleTemplate: "modern" | "executive" | "indigo-tech" | "classic-serif";
}

export default function ResumePDFView({ data, styleTemplate }: ResumePDFViewProps) {
  const { name, title, contact, careerObjective, professionalSummary, education, skills, experience, certifications, projects, achievements, interests } = data;

  const renderContactItem = (icon: React.ReactNode, value: string, linkPrefix?: string) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-neutral-600 print:text-neutral-900 font-sans">
        <span className="text-neutral-400 print:text-neutral-500">{icon}</span>
        {linkPrefix ? (
          <a
            href={`${linkPrefix}${value.replace(/^(https?:\/\/)?(www\.)?/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-neutral-950 print:no-underline font-semibold"
          >
            {value}
          </a>
        ) : (
          <span className="font-medium">{value}</span>
        )}
      </div>
    );
  };

  // 1. EXECUTIVE TEMPLATE -> "Creative Studio" (Outlined Grid with Coral & Purple accents)
  if (styleTemplate === "executive") {
    return (
      <div id="resume-document" className="print-resume w-full max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-neutral-200 rounded-2xl print:shadow-none print:border-none print:p-0">
        
        {/* Name and Header: sleek branding with coral-orange detail */}
        <div className="text-center pb-6 border-b border-neutral-100">
          <h1 className="font-sans text-4xl font-black tracking-tighter text-neutral-900 leading-none lowercase mb-2">
            {name}<span className="text-[#FF6B4A]">.</span>
          </h1>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-[#8B5CF6] mb-4">{title}</p>
          
          <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 max-w-2xl mx-auto">
            {renderContactItem(<Mail size={13} />, contact.email, "mailto:")}
            {renderContactItem(<Phone size={13} />, contact.phone, "tel:")}
            {renderContactItem(<MapPin size={13} />, contact.location)}
            {renderContactItem(<Globe size={13} />, contact.website, "https://")}
            {renderContactItem(<Linkedin size={13} />, contact.linkedin, "https://")}
            {renderContactItem(<Github size={13} />, contact.github, "https://")}
          </div>
        </div>

        {/* Narrative / Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-neutral-100 avoid-break-inside">
          <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-neutral-900 mb-2 flex items-center gap-2 font-mono">
              <Compass size={14} className="text-[#FF6B4A]" />
              Strategic Focus
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed text-justify font-sans">{careerObjective}</p>
          </div>
          <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-neutral-900 mb-2 flex items-center gap-2 font-mono">
              <Layers size={14} className="text-[#8B5CF6]" />
              Operational Summary
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed text-justify font-sans">{professionalSummary}</p>
          </div>
        </div>

        {/* Work Experience */}
        <div className="py-6 border-b border-neutral-100 avoid-break-inside">
          <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-900 mb-5 flex items-center gap-2 font-mono">
            <Briefcase size={15} className="text-[#FF6B4A]" />
            Experience Record
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="avoid-break-inside">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-sans mb-1.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-sans font-black text-neutral-900 text-base tracking-tight">{exp.role}</span>
                    <span className="text-xs text-neutral-400">at</span>
                    <span className="font-sans font-extrabold text-[#8B5CF6] text-xs uppercase tracking-wider">{exp.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                    <span>{exp.period}</span>
                    <span className="text-neutral-200">|</span>
                    <span className="italic">{exp.location}</span>
                  </div>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600 print:text-neutral-700 text-justify">
                  {exp.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-4 avoid-break-inside">
          {/* Skills Column Left */}
          <div className="md:col-span-2 space-y-5">
            <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-950 flex items-center gap-2 font-mono">
              <Star size={14} className="text-[#8B5CF6]" />
              Skill Inventory
            </h2>
            <div className="space-y-4">
              {skills.map((grp, sIdx) => (
                <div key={sIdx} className="avoid-break-inside">
                  <h3 className="text-[9px] font-bold uppercase tracking-wider text-neutral-450 mb-1.5">{grp.category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {grp.skills.map((skill, kIdx) => (
                      <span key={kIdx} className="px-2 py-0.5 text-[9px] font-mono bg-neutral-100 text-neutral-850 border border-neutral-150 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-950 mb-2 flex items-center gap-2 font-mono">
                <Compass size={14} className="text-[#FF6B4A]" />
                Personal Interests
              </h2>
              <ul className="space-y-1 text-xs text-neutral-600 list-disc pl-4 italic leading-snug">
                {interests.map((interest, iIdx) => (
                  <li key={iIdx}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education & Certs Right */}
          <div className="md:col-span-3 space-y-5">
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-950 mb-3 flex items-center gap-2 font-mono">
                <BookOpen size={14} className="text-[#8B5CF6]" />
                Education History
              </h2>
              <div className="space-y-4">
                {education.map((edu, eIdx) => (
                  <div key={eIdx} className="avoid-break-inside">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-sans font-bold text-neutral-900 text-sm tracking-tight">{edu.degree}</span>
                      <span className="font-mono text-[9px] text-neutral-400">{edu.period}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      <span>{edu.institution}</span>
                      <span className="text-neutral-400 font-normal italic">{edu.location}</span>
                    </div>
                    {edu.description && <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-950 mb-3 flex items-center gap-2 font-mono">
                <Award size={14} className="text-[#FF6B4A]" />
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center text-xs avoid-break-inside p-2 bg-neutral-50 border border-neutral-100 rounded-xl">
                    <div>
                      <span className="font-bold text-neutral-900 text-xs block">{cert.name}</span>
                      <span className="text-[9px] text-neutral-400">{cert.issuer}</span>
                    </div>
                    <span className="font-mono text-[9px] text-neutral-600 bg-neutral-200 px-1.5 py-0.5 rounded font-bold ml-2">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-950 mb-3 flex items-center gap-2 font-mono">
                  <Star size={14} className="text-[#D97706]" />
                  Honors &amp; Achievements
                </h2>
                <div className="space-y-2">
                  {achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="p-2.5 bg-neutral-50/50 border border-neutral-100 rounded-xl avoid-break-inside text-xs">
                      <span className="font-bold text-neutral-900 block leading-tight">{ach.title}</span>
                      <p className="text-[10px] text-neutral-500 mt-1 leading-normal font-sans text-justify">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Cases */}
        <div className="py-4 border-t border-neutral-100 avoid-break-inside">
          <h2 className="text-xs uppercase tracking-wider font-bold text-neutral-950 mb-3 flex items-center gap-2 font-mono">
            <Layers size={14} className="text-[#8B5CF6]" />
            Core Projects & Ventures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj, pIdx) => (
              <div key={pIdx} className="p-3 bg-neutral-50/40 border border-neutral-100 rounded-xl avoid-break-inside">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-sans font-bold text-neutral-900 text-sm tracking-tight">{proj.title}</span>
                  {proj.link && (
                    <span className="text-[8px] font-mono text-neutral-400 font-bold">{proj.link.replace("https://", "")}</span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-600 mb-2 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.2 bg-white text-neutral-700 text-[8px] font-mono border border-neutral-200 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. MODERN TEMPLATE -> "Swiss Typographer Scale" (Bold minimalist editorial layout)
  if (styleTemplate === "modern") {
    return (
      <div id="resume-document" className="print-resume w-full max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-neutral-250 rounded-2xl print:shadow-none print:border-none print:p-0 font-sans tracking-tight text-neutral-900">
        
        {/* Massive Bold Header Block with Coral Accent */}
        <div className="border-b-4 border-black pb-5 mb-6 avoid-break-inside flex flex-col md:flex-row justify-between items-baseline gap-4">
          <div>
            <h1 className="text-4.5xl font-black uppercase tracking-tighter text-black leading-none mb-1">
              {name}<span className="text-[#FF6B4A]">.</span>
            </h1>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase font-black text-[#8B5CF6] mt-2">{title}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-black">
            {renderContactItem(<Mail size={12} />, contact.email, "mailto:")}
            {renderContactItem(<Phone size={12} />, contact.phone, "tel:")}
            {renderContactItem(<MapPin size={12} />, contact.location)}
            {renderContactItem(<Globe size={12} />, contact.website, "https://")}
            {renderContactItem(<Linkedin size={12} />, contact.linkedin, "https://")}
            {renderContactItem(<Github size={12} />, contact.github, "https://")}
          </div>
        </div>

        {/* Asymmetric Core Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Work History */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <div className="border-b-2 border-black pb-1 mb-4">
                <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">I. Professional Work Record</h2>
              </div>
              <div className="space-y-5">
                {experience.map((exp, val) => (
                  <div key={val} className="avoid-break-inside">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-1">
                      <div>
                        <h3 className="font-black text-black text-sm uppercase tracking-tight">{exp.role}</h3>
                        <span className="font-mono text-xs text-[#8B5CF6] font-bold uppercase tracking-wider block sm:inline sm:ml-1 mt-0.5 sm:mt-0">{exp.company}</span>
                      </div>
                      <span className="font-mono text-[9px] text-neutral-500 whitespace-nowrap bg-neutral-100 py-0.5 px-2 rounded font-bold">{exp.period}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-neutral-600 text-justify">
                      {exp.highlights.map((bullet, bi) => (
                        <li key={bi} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Innovation Work Cases */}
            <div>
              <div className="border-b-2 border-black pb-1 mb-4">
                <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">II. Key Cases & Projects</h2>
              </div>
              <div className="space-y-4 font-sans">
                {projects.map((proj, pIdx) => (
                  <div key={pIdx} className="avoid-break-inside">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-black text-xs uppercase">{proj.title}</span>
                      {proj.link && (
                        <span className="font-mono text-[8px] text-[#FF6B4A] hover:underline font-bold">{proj.link.replace("https://", "")}</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mb-2 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="px-1.5 py-0.1 text-[8.5px] font-mono text-black bg-neutral-100 border border-neutral-250 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-4 space-y-6">
            {/* Skills / Capabilities */}
            <div>
              <div className="border-b-2 border-black pb-1 mb-3">
                <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">III. Areas of Expertise</h2>
              </div>
              <div className="space-y-4">
                {skills.map((gp, skillIndex) => (
                  <div key={skillIndex}>
                    <h3 className="font-sans text-[9px] font-bold uppercase text-neutral-450 mb-1.5 tracking-wider">{gp.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {gp.skills.map((skill, si) => (
                        <span key={si} className="bg-black text-white px-2 py-0.5 text-[9px] font-mono tracking-tighter">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Training */}
            <div>
              <div className="border-b-2 border-black pb-1 mb-3">
                <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">IV. Education</h2>
              </div>
              <div className="space-y-4 text-xs">
                {education.map((edu, ei) => (
                  <div key={ei} className="avoid-break-inside">
                    <div className="font-extrabold text-black uppercase">{edu.degree}</div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">{edu.institution}</div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mt-1">
                      <span>{edu.period}</span>
                      <span>{edu.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditation Certs */}
            <div>
              <div className="border-b-2 border-black pb-1 mb-3">
                <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">V. Certifications</h2>
              </div>
              <ul className="space-y-2 text-xs">
                {certifications.map((cert, ci) => (
                  <li key={ci} className="bg-neutral-50 hover:bg-neutral-100 p-2 border border-neutral-200 flex justify-between items-center transition-all">
                    <div>
                      <span className="font-bold text-black text-[10px] block leading-tight">{cert.name}</span>
                      <span className="text-[8px] text-neutral-400 font-bold block mt-0.5">{cert.issuer}</span>
                    </div>
                    <span className="bg-black text-[8px] text-white font-mono px-1.5 py-0.5 ml-2 font-black">{cert.year}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <div>
                <div className="border-b-2 border-black pb-1 mb-3">
                  <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">VI. Achievements &amp; Honors</h2>
                </div>
                <div className="space-y-2 text-xs">
                  {achievements.map((ach, ai) => (
                    <div key={ai} className="avoid-break-inside hover:bg-neutral-50/50 p-2 border border-neutral-100/30">
                      <div className="font-extrabold text-black uppercase">{ach.title}</div>
                      <p className="text-[10px] text-neutral-500 mt-1 leading-normal font-sans text-justify">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests tags */}
            <div>
              <div className="border-b-2 border-black pb-1 mb-2.5">
                <h2 className="text-xs uppercase font-black tracking-wider text-black font-mono">VII. Interests</h2>
              </div>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, key) => (
                  <span key={key} className="px-1.5 py-0.5 text-[9px] bg-neutral-100 text-black border border-neutral-250 font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. INDIGO-TECH TEMPLATE -> "Sleek Developer Slate" (Capsule outlines with Purple details)
  if (styleTemplate === "indigo-tech") {
    return (
      <div id="resume-document" className="print-resume w-full max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-neutral-200 rounded-2xl print:shadow-none print:border-none print:p-0 font-sans tracking-tight text-neutral-900">
        
        {/* Banner Outlined Header */}
        <div className="border border-neutral-200 bg-neutral-50 p-6 rounded-2xl mb-6 avoid-break-inside">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-sans text-3xl font-black text-neutral-900 tracking-tighter leading-none mb-2">
                {name}<span className="text-[#8B5CF6]">.</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]"></span>
                <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-[#8B5CF6]">{title}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-neutral-600">
              {renderContactItem(<Mail size={12} />, contact.email, "mailto:")}
              {renderContactItem(<Phone size={12} />, contact.phone, "tel:")}
              {renderContactItem(<MapPin size={12} />, contact.location)}
              {renderContactItem(<Globe size={12} />, contact.website, "https://")}
              {renderContactItem(<Linkedin size={12} />, contact.linkedin, "https://")}
              {renderContactItem(<Github size={12} />, contact.github, "https://")}
            </div>
          </div>
        </div>

        {/* Section Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="md:col-span-8 space-y-6">
            {/* Summary */}
            <div className="avoid-break-inside">
              <div className="border-l-3 border-[#8B5CF6] pl-3 mb-2">
                <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Operations Summary</h2>
              </div>
              <p className="text-xs text-neutral-650 leading-relaxed text-justify">{professionalSummary}</p>
            </div>

            {/* Experience */}
            <div>
              <div className="border-l-3 border-[#8B5CF6] pl-3 mb-4">
                <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Development Practice</h2>
              </div>
              <div className="space-y-6">
                {experience.map((exp, val) => (
                  <div key={val} className="avoid-break-inside">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm inline-block tracking-tight">{exp.role}</h3>
                        <span className="mx-2 text-neutral-300 text-xs">|</span>
                        <span className="font-sans font-black text-[#FF6B4A] text-xs uppercase tracking-wider">{exp.company}</span>
                      </div>
                      <div className="font-mono text-[9px] text-neutral-500 whitespace-nowrap bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                        {exp.period}
                      </div>
                    </div>
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-neutral-600 text-justify">
                      {exp.highlights.map((bullet, bi) => (
                        <li key={bi} className="leading-relaxed">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="avoid-break-inside">
              <div className="border-l-3 border-[#8B5CF6] pl-3 mb-3">
                <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Credentials & Badges</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {certifications.map((cert, ci) => (
                  <li key={ci} className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex justify-between items-center hover:border-[#8B5CF6]/40 transition-colors">
                    <div>
                      <span className="font-bold text-neutral-900 text-[10px] block">{cert.name}</span>
                      <span className="text-[9px] text-neutral-400 block mt-0.5">{cert.issuer}</span>
                    </div>
                    <span className="bg-white text-[9px] font-mono text-neutral-600 px-1.5 py-0.5 border border-neutral-200 rounded font-bold ml-2">
                      {cert.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <div className="avoid-break-inside">
                <div className="border-l-3 border-[#8B5CF6] pl-3 mb-3">
                  <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Honors &amp; Recognition</h2>
                </div>
                <div className="space-y-3">
                  {achievements.map((ach, ai) => (
                    <div key={ai} className="bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-200">
                      <span className="font-bold text-neutral-900 text-xs block leading-tight">{ach.title}</span>
                      <p className="text-[10px] text-neutral-550 mt-1 leading-normal font-sans text-justify">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="md:col-span-4 space-y-6">
            {/* Core Skills Groups */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-250 avoid-break-inside">
              <h2 className="font-mono text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider mb-3">Skill Domains</h2>
              <div className="space-y-4">
                {skills.map((gp, skillIndex) => (
                  <div key={skillIndex}>
                    <h3 className="font-sans text-[9px] font-bold uppercase text-neutral-400 mb-1.5 tracking-wider">{gp.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {gp.skills.map((skill, si) => (
                        <span key={si} className="bg-white px-2 py-0.5 text-[9px] font-mono text-neutral-700 border border-neutral-200 shadow-sm rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Training */}
            <div className="avoid-break-inside">
              <div className="border-l-3 border-[#8B5CF6] pl-3 mb-3">
                <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Academic Training</h2>
              </div>
              <div className="space-y-4 text-xs">
                {education.map((edu, ei) => (
                  <div key={ei} className="avoid-break-inside">
                    <div className="font-extrabold text-neutral-900 tracking-tight">{edu.degree}</div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">{edu.institution}</div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mt-1">
                      <span>{edu.period}</span>
                      <span>{edu.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects cases */}
            <div>
              <div className="border-l-3 border-[#8B5CF6] pl-3 mb-3">
                <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Recent Engagements</h2>
              </div>
              <div className="space-y-3">
                {projects.map((proj, pIdx) => (
                  <div key={pIdx} className="p-2.5 border border-neutral-200 rounded-lg bg-neutral-50 hover:border-neutral-300 transition-colors">
                    <span className="font-sans font-bold text-neutral-900 text-[10px] block mb-0.5 tracking-tight">{proj.title}</span>
                    <p className="text-[9.5px] text-neutral-500 leading-snug">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.techStack.slice(0, 3).map((tech, tIdx) => (
                        <span key={tIdx} className="px-1 text-[8px] font-mono text-neutral-600 bg-white border border-neutral-200 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests list */}
            <div className="avoid-break-inside">
              <div className="border-l-3 border-[#8B5CF6] pl-3 mb-2">
                <h2 className="font-sans font-black text-neutral-900 uppercase tracking-widest text-[10px] font-mono">Interests focus</h2>
              </div>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, key) => (
                  <span key={key} className="px-1.5 py-0.5 text-[9px] bg-neutral-100 text-neutral-600 border border-neutral-200 rounded-md">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. CLASSIC-SERIF TEMPLATE -> "Editorial Portrait" (Luxury Playfair Display Serif style)
  return (
    <div id="resume-document" className="print-resume w-full max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-neutral-200 rounded-2xl print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-neutral-800">
      
      {/* Elegantly styled borders wrapping professional title block */}
      <div className="border-t-3 border-[#FF6B4A] pt-6 pb-4 text-center avoid-break-inside">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 mb-1.5 italic font-serif leading-none">
          {name}
        </h1>
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#8B5CF6] mb-5">
          {title}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-xs font-sans text-neutral-500 max-w-2xl mx-auto">
          {contact.email && (
            <span className="flex items-center gap-1 font-semibold text-neutral-700">
              <span>{contact.email}</span>
            </span>
          )}
          <span className="text-neutral-200">|</span>
          {contact.phone && (
            <span className="flex items-center gap-1 font-semibold text-neutral-700">
              <span>{contact.phone}</span>
            </span>
          )}
          <span className="text-neutral-200">|</span>
          {contact.location && (
            <span className="flex items-center gap-1 text-neutral-700">
              <span>{contact.location}</span>
            </span>
          )}
          {contact.website && (
            <>
              <span className="text-neutral-200">|</span>
              <span className="font-bold text-[#FF6B4A] font-mono">{contact.website}</span>
            </>
          )}
          {contact.linkedin && (
            <>
              <span className="text-neutral-200">|</span>
              <span className="text-neutral-700">{contact.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Narrative block */}
      <div className="border-t border-b border-neutral-200 py-3.5 my-5 text-center italic text-neutral-700 text-xs px-4 sm:px-8 avoid-break-inside">
        "{careerObjective}"
      </div>

      {/* Grid Content Matrix */}
      <div className="space-y-6">

        {/* Profile summary */}
        <div className="avoid-break-inside">
          <h2 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-neutral-900 border-b border-text border-neutral-200 pb-1 mb-2.5">
            I. Personal Summary
          </h2>
          <p className="text-xs text-neutral-650 leading-relaxed text-justify indent-6 font-serif">
            {professionalSummary}
          </p>
        </div>

        {/* Employer practice list */}
        <div>
          <h2 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-neutral-900 border-b border-text border-neutral-200 pb-1 mb-3.5">
            II. Professional Practice
          </h2>
          
          <div className="space-y-5">
            {experience.map((exp, expIdx) => (
              <div key={expIdx} className="avoid-break-inside pl-1">
                <div className="flex flex-col sm:flex-row justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-sans font-extrabold text-[#8B5CF6] text-sm leading-tight inline tracking-tight">
                      {exp.role}
                    </h3>
                    <span className="font-sans text-xs text-neutral-300 mx-1.5">/</span>
                    <span className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wider">
                      {exp.company}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 font-bold whitespace-nowrap bg-neutral-50 p-1 rounded border border-neutral-150">
                    {exp.period} | {exp.location}
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-650 text-justify font-serif">
                  {exp.highlights.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Ventures and projects */}
        <div>
          <h2 className="font-sans text-[9px] uppercase tracking-[0.2em] font-black text-neutral-900 border-b border-text border-neutral-200 pb-1 mb-3.5">
            III. Featured Engagements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj, pIdx) => (
              <div key={pIdx} className="p-4 bg-neutral-50/50 border border-neutral-150 rounded-xl avoid-break-inside flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-extrabold text-neutral-950 text-sm mb-1 tracking-tight">
                    {proj.title}
                  </h3>
                  <p className="text-[11px] text-neutral-600 leading-relaxed mb-2 text-justify">
                    {proj.description}
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] text-neutral-500 mb-3">
                    {proj.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="italic">{ach}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-150">
                  {proj.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-1.5 py-0.5 text-[8.5px] font-sans font-semibold bg-neutral-100 border border-neutral-200 rounded text-neutral-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Column Footer info matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 avoid-break-inside">
          
          {/* Universities list */}
          <div>
            <h2 className="font-sans text-[9px] uppercase tracking-wider font-extrabold text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
              IV. Qualifications
            </h2>
            <div className="space-y-3.5 font-sans">
              {education.map((edu, eIdx) => (
                <div key={eIdx}>
                  <div className="font-extrabold text-neutral-900 text-xs leading-tight tracking-tight">{edu.degree}</div>
                  <div className="text-[9px] text-[#FF6B4A] font-bold uppercase tracking-wider mt-0.5">{edu.institution}</div>
                  <div className="flex justify-between text-[8px] text-neutral-500 mt-1 font-mono">
                    <span>{edu.period}</span>
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Capabilities */}
          <div>
            <h2 className="font-sans text-[9px] uppercase tracking-wider font-extrabold text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
              V. Core Capabilities
            </h2>
            <div className="space-y-3.5 font-sans">
              {skills.map((grp, sIdx) => (
                <div key={sIdx}>
                  <h3 className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider mb-1">{grp.category}</h3>
                  <p className="text-[10px] text-neutral-750 leading-normal tracking-wide">
                    {grp.skills.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications and Interests */}
          <div>
            <h2 className="font-sans text-[9px] uppercase tracking-wider font-extrabold text-neutral-900 border-b border-neutral-200 pb-1 mb-2.5">
              VI. Accreditations
            </h2>
            <div className="space-y-2 mb-3 font-sans">
              {certifications.map((cert, cIdx) => (
                <div key={cIdx} className="text-xs">
                  <span className="font-bold text-neutral-950 block leading-tight text-[11px] tracking-tight">{cert.name}</span>
                  <span className="text-[9px] text-neutral-400 block mt-0.5 font-medium">{cert.issuer} ({cert.year})</span>
                </div>
              ))}
            </div>

            {achievements && achievements.length > 0 && (
              <div className="pt-2 border-t border-dashed border-neutral-200 mb-3 font-sans">
                <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">Achievements &amp; Honors</span>
                <div className="space-y-2 text-xs text-justify font-serif">
                  {achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="leading-normal">
                      <strong className="text-neutral-950 block font-sans text-[10.5px] tracking-tight">{ach.title}</strong>
                      <p className="text-[9px] text-neutral-500 mt-0.5 leading-relaxed">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-neutral-200 font-sans">
              <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-wider block mb-1">Interests</span>
              <p className="text-[10px] text-neutral-600 italic leading-snug font-serif">
                {interests.join(", ")}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
