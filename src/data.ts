import { PortfolioData } from "./types";
import profileAvatar from "./assets/images/profile_avatar_1779731928811.png";

export const initialPortfolioData: PortfolioData = {
  name: "Muhammed Aslam",
  title: "Operations Head & Startup Enthusiast",
  avatarUrl: profileAvatar,
  careerObjective: "Seeking a challenging role in Startup Operations, Business Development, or Financial Planning where I can leverage my experience in logistics coordination, team leadership, and process optimization to drive growth.",
  professionalSummary: "A results-oriented B.Com graduate with a specialization in Finance and Taxation. Proven track record of operational leadership in a gifting startup and student-led entrepreneurship initiatives. Skilled in logistics management, stakeholder coordination, and implementing efficient workflows.",
  contact: {
    email: "muhammedaslam7008@gmail.com",
    phone: "+91 85476 07008",
    linkedin: "https://www.linkedin.com/in/muhammed-aslam-12853431a/",
    github: "github.com/muhammedaslam-dev",
    location: "Kerala, India",
    website: ""
  },
  education: [
    {
      degree: "B.Com – Finance & Taxation",
      institution: "St. Thomas College, Ranni",
      period: "2023 – 2026",
      location: "Kerala, India",
      description: "Focusing on Financial Accounting, Taxation laws, and Business Management. Actively involved in campus entrepreneurship through the IEDC cell."
    }
  ],
  skills: [
    {
      category: "Operational Leadership",
      skills: ["Logistics Coordination", "Process Optimization", "Team Management", "Inventory Control", "Resource Allocation"]
    },
    {
      category: "Ecosystem Builder",
      skills: ["Startup Community Engagement", "Event Coordination", "Public Speaking", "Strategic Planning", "Mentorship Coordination"]
    },
    {
      category: "Finance & Analytics",
      skills: ["Financial Accounting", "Taxation Principles", "Analytical Problem Solving", "Account Management", "Data Analysis Basics"]
    }
  ],
  experience: [
    {
      role: "Operations Head",
      company: "RegaloBox",
      period: "February 2025 – May 2026",
      location: "Gifting Startup",
      highlights: [
        "Directed end-to-end operations including supply chain logistics, inventory management, and fulfillment strategy.",
        "Streamlined packing and delivery workflows, reducing operational turnaround time by 20%.",
        "Managed a team of fulfillment associates to ensure quality standards and timely delivery of custom orders.",
        "Facilitated strategic discussions with vendors to optimize procurement costs and ensure steady supply."
      ]
    },
    {
      role: "Student Lead",
      company: "IEDC – Innovation and Entrepreneurship Development Cell",
      period: "2025 – 2026",
      location: "St. Thomas College, Ranni",
      highlights: [
        "Spearheaded innovation-driven events on campus, impacting over 500+ students across various departments.",
        "Organized 'Ideathon 2025', connecting budding student entrepreneurs with industry mentors.",
        "Managed cell budget and resources for workshop series on 'Startup Fundamentals' and 'Business Modeling'.",
        "Represented the college at regional startup summits and state-level innovation meetings."
      ]
    },
    {
      role: "Volunteer",
      company: "Huddle Global 2025",
      period: "2025",
      location: "Thiruvananthapuram, Kerala",
      highlights: [
        "Assisted in coordinating delegate flow and speaker management at one of Asia's largest startup summits.",
        "Engaged with 100+ investors and founders, gaining deep insights into the global venture capital landscape."
      ]
    },
    {
      role: "Student Volunteer",
      company: "Vijnjana Pathanamthitta Project",
      period: "2024 – 2025",
      location: "Pathanamthitta, Kerala",
      highlights: [
        "Actively supported community mobilization drives for the Kerala Knowledge Economy Mission.",
        "Coordinates local job fairs and digital skill awareness programs for unemployed youth."
      ]
    }
  ],
  certifications: [
    {
      name: "Tally Prime Professional Certification",
      issuer: "Tally Education",
      year: "2024",
      credentialUrl: "#"
    },
    {
      name: "Startup Operations Masterclass",
      issuer: "Innovation Hub",
      year: "2025",
      credentialUrl: "#"
    }
  ],
  projects: [
    {
      title: "Logistics Optimization Model",
      description: "Designed a simplified logistics tracking system using spreadsheets to monitor real-time shipment status and inventory levels for a startup.",
      techStack: ["Excel", "Operations Management", "Process Flow Design"],
      achievements: [
        "Reduced package handling errors by 15%.",
        "Implemented an automated alert system for low-stock inventory items."
      ],
      link: ""
    },
    {
      title: "Campus Startup Ecosystem Mapping",
      description: "Conducted a research study on the potential for student-led startups in rural Kerala, identifying key barriers and enablers.",
      techStack: ["Market Research", "Data Collection", "Strategic Analysis"],
      achievements: [
        "Presented findings at the District Innovation Council meeting.",
        "Secured institutional support for a dedicated co-working space on campus."
      ],
      link: ""
    }
  ],
  achievements: [
    {
      title: "Yip 7.0 District Winner",
      description: "Recognized as a District Winner in Young Innovators Programme YIP 7.0 for an innovative solution addressing local logistics challenges."
    },
    {
      title: "Self-Motivated Youngster Award",
      description: "Awarded by KCIF Computer College for demonstrating exceptional leadership and initiative in building RegaloBox from the ground up."
    }
  ],
  interests: [
    "Exploring Startup Scalability Models",
    "Advancements in FinTech and Digital Payments",
    "Logistics and Supply Chain Innovation",
    "Community Building & Mentorship"
  ]
};
