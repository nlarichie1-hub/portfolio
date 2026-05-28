import React, { useState } from "react";
import { PortfolioData, Experience, Education, Certification, Project, SkillCategory } from "../types";
import { Plus, Trash2, RefreshCw, Upload, Eye, FileSpreadsheet, Sparkles, BookOpen, Layers, Briefcase, Award, Star, Compass } from "lucide-react";

interface FormEditorProps {
  data: PortfolioData;
  onChange: (updatedData: PortfolioData) => void;
  onReset: () => void;
}

type ActiveTab = "profile" | "skills" | "experience" | "projects" | "education" | "certifications" | "achievements";

export default function FormEditor({ data, onChange, onReset }: FormEditorProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  const updateField = (path: string[], value: any) => {
    const updated = { ...data };
    let current: any = updated;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(updated);
  };

  const handleAddField = (section: "education" | "experience" | "certifications" | "projects" | "skills" | "achievements") => {
    const updated = { ...data };
    if (section === "education") {
      updated.education = [
        ...updated.education,
        { institution: "New University", degree: "Certification/Degree", period: "2024 - 2026", location: "City, State", description: "" }
      ];
    } else if (section === "experience") {
      updated.experience = [
        ...updated.experience,
        { company: "Company Name", role: "Job Title", period: "2024 - Present", location: "Remote/Office", highlights: ["Key achievement line 1", "Key achievement line 2"] }
      ];
    } else if (section === "certifications") {
      updated.certifications = [
        ...updated.certifications,
        { name: "New Certification Name", issuer: "Issuing Organization", year: "2025" }
      ];
    } else if (section === "projects") {
      updated.projects = [
        ...updated.projects,
        { title: "Project Name", description: "Quick description of what this business project or initiative does.", techStack: ["Excel", "Analysis"], achievements: ["First core metric achieved", "Second feature built successfully"] }
      ];
    } else if (section === "skills") {
      updated.skills = [
        ...updated.skills,
        { category: "New Category", skills: ["Skill A", "Skill B"] }
      ];
    } else if (section === "achievements") {
      updated.achievements = [
        ...(updated.achievements || []),
        { title: "New Award / Milestone Title", description: "Proud recipient of this honor for dedicated contributions." }
      ];
    }
    onChange(updated);
  };

  const handleRemoveField = (section: "education" | "experience" | "certifications" | "projects" | "skills" | "achievements", index: number) => {
    const updated = { ...data };
    if (section === "education") {
      updated.education = updated.education.filter((_, i) => i !== index);
    } else if (section === "experience") {
      updated.experience = updated.experience.filter((_, i) => i !== index);
    } else if (section === "certifications") {
      updated.certifications = updated.certifications.filter((_, i) => i !== index);
    } else if (section === "projects") {
      updated.projects = updated.projects.filter((_, i) => i !== index);
    } else if (section === "skills") {
      updated.skills = updated.skills.filter((_, i) => i !== index);
    } else if (section === "achievements") {
      updated.achievements = (updated.achievements || []).filter((_, i) => i !== index);
    }
    onChange(updated);
  };

  const updateSkillValue = (catIndex: number, skillsString: string) => {
    const updated = { ...data };
    updated.skills[catIndex].skills = skillsString.split(",").map(s => s.trim()).filter(Boolean);
    onChange(updated);
  };

  const updateBulletListItem = (section: "experience" | "projects", itemIndex: number, bulletIndex: number, value: string) => {
    const updated = { ...data };
    if (section === "experience") {
      updated.experience[itemIndex].highlights[bulletIndex] = value;
    } else if (section === "projects") {
      updated.projects[itemIndex].achievements[bulletIndex] = value;
    }
    onChange(updated);
  };

  const addBulletListItem = (section: "experience" | "projects", itemIndex: number) => {
    const updated = { ...data };
    if (section === "experience") {
      updated.experience[itemIndex].highlights = [...updated.experience[itemIndex].highlights, "New success or technical metric lines"];
    } else if (section === "projects") {
      updated.projects[itemIndex].achievements = [...updated.projects[itemIndex].achievements, "Added support for a major feature"];
    }
    onChange(updated);
  };

  const removeBulletListItem = (section: "experience" | "projects", itemIndex: number, bulletIndex: number) => {
    const updated = { ...data };
    if (section === "experience") {
      updated.experience[itemIndex].highlights = updated.experience[itemIndex].highlights.filter((_, i) => i !== bulletIndex);
    } else if (section === "projects") {
      updated.projects[itemIndex].achievements = updated.projects[itemIndex].achievements.filter((_, i) => i !== bulletIndex);
    }
    onChange(updated);
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.name && parsed.contact && parsed.skills) {
          onChange(parsed);
        } else {
          alert("Invalid portfolio schema. Please use proper resume json values.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const exportToJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name.toLowerCase().replace(/\s+/g, "_")}_resume_config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabClass = (tab: ActiveTab) =>
    `flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-all ${
      activeTab === tab
        ? "bg-neutral-50 text-neutral-900 border-l-2 border-[#FF6B4A] font-bold shadow-sm"
        : "text-slate-600 hover:bg-neutral-50/50 hover:text-slate-900"
    }`;

  return (
    <div id="settings-editor" className="settings-sidebar bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col no-print">
      {/* Sidebar Tool Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#8B5CF6]" />
          <h2 className="font-display font-black text-sm text-slate-800 tracking-tight">Resume Builder Core</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            title="Reset default values"
            className="p-1 text-slate-400 hover:text-[#FF6B4A] hover:bg-neutral-100 rounded transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={exportToJson}
            title="Export Profile JSON Data"
            className="p-1 text-slate-400 hover:text-[#8B5CF6] hover:bg-neutral-100 rounded transition-colors"
          >
            <FileSpreadsheet size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 flex-1 min-h-0 divide-x divide-slate-100">
        {/* Navigation panel */}
        <div className="col-span-4 p-2 bg-slate-50/50 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
            <Layers size={13} />
            <span>Profile</span>
          </button>
          <button onClick={() => setActiveTab("skills")} className={tabClass("skills")}>
            <Star size={13} />
            <span>Skills</span>
          </button>
          <button onClick={() => setActiveTab("experience")} className={tabClass("experience")}>
            <Briefcase size={13} />
            <span>Jobs</span>
          </button>
          <button onClick={() => setActiveTab("projects")} className={tabClass("projects")}>
            <Award size={13} />
            <span>Projects</span>
          </button>
          <button onClick={() => setActiveTab("education")} className={tabClass("education")}>
            <BookOpen size={13} />
            <span>Education</span>
          </button>
          <button onClick={() => setActiveTab("certifications")} className={tabClass("certifications")}>
            <Compass size={13} />
            <span>Certs</span>
          </button>
          <button onClick={() => setActiveTab("achievements")} className={tabClass("achievements")}>
            <Award size={13} className="text-[#D97706]" />
            <span>Laurels</span>
          </button>

          {/* Json file importer helper */}
          <div className="pt-8 px-2">
            <label className="flex flex-col items-center justify-center p-3 border border-dashed border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-900 hover:bg-neutral-50 transition-colors">
              <Upload size={14} className="text-[#FF6B4A] mb-1" />
              <span className="text-[10px] text-slate-505 font-semibold text-center leading-tight">Import JSON Resume</span>
              <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Content Panel Frame */}
        <div className="col-span-8 p-4 overflow-y-auto max-h-[580px] text-slate-800">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-4 font-sans">
              <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest mb-3">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateField(["name"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Career Title</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => updateField(["title"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Career Objective</label>
                <textarea
                  value={data.careerObjective}
                  onChange={(e) => updateField(["careerObjective"], e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Professional Narrative Summary</label>
                <textarea
                  value={data.professionalSummary}
                  onChange={(e) => updateField(["professionalSummary"], e.target.value)}
                  rows={4}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                />
              </div>

              <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest pt-2">Contact Details</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => updateField(["contact", "email"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={data.contact.phone}
                    onChange={(e) => updateField(["contact", "phone"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={data.contact.location}
                    onChange={(e) => updateField(["contact", "location"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Website</label>
                  <input
                    type="text"
                    value={data.contact.website}
                    onChange={(e) => updateField(["contact", "website"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={data.contact.linkedin}
                    onChange={(e) => updateField(["contact", "linkedin"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={data.contact.github}
                    onChange={(e) => updateField(["contact", "github"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Profile Photo URL</label>
                  <input
                    type="text"
                    value={data.avatarUrl || ""}
                    onChange={(e) => updateField(["avatarUrl"], e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                    placeholder="Enter image URL or asset path"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest">Skill Categories</h3>
                <button
                  onClick={() => handleAddField("skills")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#FF6B4A] hover:text-[#FF6B4A]/80"
                >
                  <Plus size={12} /> Add Category
                </button>
              </div>

              {data.skills.map((cat, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 space-y-2 relative">
                  <button
                    onClick={() => handleRemoveField("skills", idx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove Category"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="pr-6">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Category Title</label>
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => {
                        const updated = { ...data };
                        updated.skills[idx].category = e.target.value;
                        onChange(updated);
                      }}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Skills (comma separated)</label>
                    <textarea
                      value={cat.skills.join(", ")}
                      onChange={(e) => updateSkillValue(idx, e.target.value)}
                      rows={2}
                      placeholder="React, Next.js, TypeScript"
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest">Work Chronology</h3>
                <button
                  onClick={() => handleAddField("experience")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#8B5CF6] hover:text-[#8B5CF6]/80"
                >
                  <Plus size={12} /> Add Employer
                </button>
              </div>

              {data.experience.map((exp, expIdx) => (
                <div key={expIdx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveField("experience", expIdx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove Employer"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Role Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.experience[expIdx].role = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.experience[expIdx].company = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Period</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.experience[expIdx].period = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                        placeholder="2022 - Present"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.experience[expIdx].location = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>

                  {/* Bullet points section */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Key Achievements (Bullet points)</label>
                      <button
                        onClick={() => addBulletListItem("experience", expIdx)}
                        className="text-[9px] font-bold text-[#8B5CF6] hover:underline flex items-baseline gap-0.5"
                      >
                        <Plus size={10} /> Bullet
                      </button>
                    </div>

                    {exp.highlights.map((bullet, bullIdx) => (
                      <div key={bullIdx} className="flex gap-1.5 items-center">
                        <span className="text-slate-400 text-xs font-semibold">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => updateBulletListItem("experience", expIdx, bullIdx, e.target.value)}
                          className="flex-1 text-xs p-1 border border-slate-200 bg-white rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                        />
                        <button
                          onClick={() => removeBulletListItem("experience", expIdx, bullIdx)}
                          className="p-1 text-slate-400 hover:text-red-500"
                          title="Delete bullet"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest">Portfolio Projects</h3>
                <button
                  onClick={() => handleAddField("projects")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#111111] hover:text-[#111111]/80"
                >
                  <Plus size={12} /> Add Project
                </button>
              </div>

              {data.projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveField("projects", idx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove Project"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.projects[idx].title = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Project Link / Repo</label>
                      <input
                        type="text"
                        value={proj.link || ""}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.projects[idx].link = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                        placeholder="github.com/profile/repo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Brief Description</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => {
                        const updated = { ...data };
                        updated.projects[idx].description = e.target.value;
                        onChange(updated);
                      }}
                      rows={2}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Tech Badges (comma separated)</label>
                    <input
                      type="text"
                      value={proj.techStack.join(", ")}
                      onChange={(e) => {
                        const updated = { ...data };
                        updated.projects[idx].techStack = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        onChange(updated);
                      }}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                    />
                  </div>

                  {/* Project bullet success items */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Highlights / Outcomes</label>
                      <button
                        onClick={() => addBulletListItem("projects", idx)}
                        className="text-[9px] font-bold text-[#111111] hover:underline flex items-baseline gap-0.5"
                      >
                        <Plus size={10} /> Outlines
                      </button>
                    </div>

                    {proj.achievements.map((ach, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-1.5 items-center">
                        <span className="text-slate-400 text-xs font-semibold">•</span>
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) => updateBulletListItem("projects", idx, bulletIdx, e.target.value)}
                          className="flex-1 text-xs p-1 border border-slate-200 bg-white rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                        />
                        <button
                          onClick={() => removeBulletListItem("projects", idx, bulletIdx)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest">Academic Degrees</h3>
                <button
                  onClick={() => handleAddField("education")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#FF6B4A] hover:text-[#FF6B4A]/80"
                >
                  <Plus size={12} /> Add University
                </button>
              </div>

              {data.education.map((edu, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 space-y-2 relative">
                  <button
                    onClick={() => handleRemoveField("education", idx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove Education"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="grid grid-cols-2 gap-2 pr-6">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.education[idx].degree = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.education[idx].institution = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Years / Period</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.education[idx].period = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.education[idx].location = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Short Notes / Achievements</label>
                    <textarea
                      value={edu.description || ""}
                      onChange={(e) => {
                        const updated = { ...data };
                        updated.education[idx].description = e.target.value;
                        onChange(updated);
                      }}
                      rows={2}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS TAB */}
          {activeTab === "certifications" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest">Certificates</h3>
                <button
                  onClick={() => handleAddField("certifications")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#8B5CF6] hover:text-[#8B5CF6]/80"
                >
                  <Plus size={12} /> Add Cert
                </button>
              </div>

              {data.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 space-y-2 relative">
                  <button
                    onClick={() => handleRemoveField("certifications", idx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove Cert"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="grid grid-cols-12 gap-2 pr-6">
                    <div className="col-span-8">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Certification Title</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.certifications[idx].name = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Year</label>
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.certifications[idx].year = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                        placeholder="2024"
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Issuer</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const updated = { ...data };
                          updated.certifications[idx].issuer = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "achievements" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-xs text-neutral-900 uppercase tracking-widest">Achievements &amp; Honors</h3>
                <button
                  onClick={() => handleAddField("achievements")}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] hover:text-[#D97706]/80"
                >
                  <Plus size={12} /> Add Laurel
                </button>
              </div>

              {(data.achievements || []).map((ach, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 space-y-2 relative">
                  <button
                    onClick={() => handleRemoveField("achievements", idx)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Remove Achievement"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="grid grid-cols-12 gap-2 pr-6">
                    <div className="col-span-12">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Laurel/Award Title</label>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => {
                          const updated = { ...data };
                          if (!updated.achievements) updated.achievements = [];
                          updated.achievements[idx].title = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md"
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Description</label>
                      <textarea
                        rows={3}
                        value={ach.description}
                        onChange={(e) => {
                          const updated = { ...data };
                          if (!updated.achievements) updated.achievements = [];
                          updated.achievements[idx].description = e.target.value;
                          onChange(updated);
                        }}
                        className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded-md resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
