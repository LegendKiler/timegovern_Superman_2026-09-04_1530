import { useEffect } from 'react';
import { setPageMeta } from '../lib/seo';
﻿import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink, Building2, FileCheck } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TimeGovern",
    location: "Melbourne CBD, VIC (Hybrid)",
    salary: "AU$110,000 – AU$130,000 + Super",
    type: "Full-time, Permanent",
    description: "Join our team to build premium time & date tools using React, Tailwind, and Vite.",
    responsibilities: ["Develop responsive UI components", "Optimize performance", "Collaborate with design"],
    requirements: ["5+ years React", "Tailwind CSS", "TypeScript"],
    immigration: {
      pathway: "Skills in Demand (Subclass 482) - Core Skills Stream",
      occupationList: "CSOL (Core Skills Occupation List) - ICT Business Analyst / Software Engineer",
      salaryThreshold: "Must meet $79,423 annual salary (as at 1 July 2026)",
      processingTime: "Generally 3-6 months",
      ageRequirement: "Under 45 years of age (for PR pathway)",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482"
    },
    applyLink: "mailto:careers@timegovern.com?subject=Senior Frontend Developer"
  },
  {
    id: 2,
    title: "Data Scientist - Astronomy",
    company: "TimeGovern",
    location: "Melbourne, VIC (Remote friendly)",
    salary: "AU$120,000 – AU$140,000 + Super",
    type: "Full-time, Permanent",
    description: "Work with astronomical data, algorithms, and ML models to improve our time calculation accuracy.",
    responsibilities: ["Analyze astronomical datasets", "Build predictive models", "Publish research insights"],
    requirements: ["Python, Pandas, NumPy", "Physics/Astronomy background", "Machine Learning"],
    immigration: {
      pathway: "Skills in Demand (Subclass 482) - Specialist Skills Stream",
      occupationList: "Specialist Skills Stream - No occupation list restriction (excluding trades, drivers, labourers)",
      salaryThreshold: "Must meet $146,576 annual salary (as at 1 July 2026)",
      processingTime: "Generally 3-6 months",
      ageRequirement: "Under 45 years of age (for PR pathway)",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482"
    },
    applyLink: "mailto:careers@timegovern.com?subject=Data Scientist"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "TimeGovern",
    location: "Melbourne, VIC (Hybrid)",
    salary: "AU$90,000 – AU$110,000 + Super",
    type: "Full-time, Contract",
    description: "Design world-class interfaces for our time, calendar, and astronomy tools.",
    responsibilities: ["Create wireframes and prototypes", "Maintain design system", "Conduct user testing"],
    requirements: ["Figma, Sketch", "Portfolio required", "5+ years UX"],
    immigration: {
      pathway: "Employer Nomination Scheme (Subclass 186) - Direct Entry Stream",
      occupationList: "CSOL - Design roles may qualify",
      salaryThreshold: "Must meet $79,423 annual salary (as at 1 July 2026)",
      processingTime: "Generally 6-12 months",
      ageRequirement: "Under 45 years of age",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186"
    },
    applyLink: "mailto:careers@timegovern.com?subject=UI/UX Designer"
  },
  {
    id: 4,
    title: "Full Stack Engineer (Node.js + React)",
    company: "TimeGovern",
    location: "Melbourne, VIC (Remote)",
    salary: "AU$100,000 – AU$125,000 + Super",
    type: "Full-time, Permanent",
    description: "Build backend services and integrate with APIs for our time and news features.",
    responsibilities: ["Develop REST APIs", "Integrate third-party services", "Manage cloud infrastructure"],
    requirements: ["Node.js, Express", "React", "AWS / Cloudflare"],
    immigration: {
      pathway: "Skills in Demand (Subclass 482) - Core Skills Stream",
      occupationList: "CSOL - Software Engineer / Developer Programmer",
      salaryThreshold: "Must meet $79,423 annual salary (as at 1 July 2026)",
      processingTime: "Generally 3-6 months",
      ageRequirement: "Under 45 years of age (for PR pathway)",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482"
    },
    applyLink: "mailto:careers@timegovern.com?subject=Full Stack Engineer"
  },
  {
    id: 5,
    title: "Content Writer - Astronomy & Time",
    company: "TimeGovern",
    location: "Melbourne, VIC (Remote friendly)",
    salary: "AU$70,000 – AU$85,000 + Super",
    type: "Part-time, Contract",
    description: "Write engaging articles about time zones, astronomy, and our tools.",
    responsibilities: ["Write blog posts", "Create guides", "Research topics"],
    requirements: ["Excellent writing skills", "Astronomy knowledge", "SEO experience"],
    immigration: {
      pathway: "Skills in Demand (Subclass 482) - Core Skills Stream",
      occupationList: "CSOL - May require specific occupation match",
      salaryThreshold: "Must meet $79,423 annual salary (as at 1 July 2026)",
      processingTime: "Generally 3-6 months",
      ageRequirement: "Under 45 years of age (for PR pathway)",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482"
    },
    applyLink: "mailto:careers@timegovern.com?subject=Content Writer"
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "TimeGovern",
    location: "Melbourne, VIC (Hybrid)",
    salary: "AU$120,000 – AU$145,000 + Super",
    type: "Full-time, Permanent",
    description: "Manage our CI/CD pipelines, cloud infrastructure, and ensure high availability.",
    responsibilities: ["Automate deployments", "Monitor systems", "Optimize performance"],
    requirements: ["Docker, Kubernetes", "Cloudflare, AWS", "CI/CD"],
    immigration: {
      pathway: "Skills in Demand (Subclass 482) - Core Skills Stream",
      occupationList: "CSOL - ICT Support Engineer / Systems Administrator",
      salaryThreshold: "Must meet $79,423 annual salary (as at 1 July 2026)",
      processingTime: "Generally 3-6 months",
      ageRequirement: "Under 45 years of age (for PR pathway)",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482"
    },
    applyLink: "mailto:careers@timegovern.com?subject=DevOps Engineer"
  },
  {
    id: 7,
    title: "Customer Support Specialist",
    company: "TimeGovern",
    location: "Melbourne, VIC (On-site)",
    salary: "AU$65,000 – AU$75,000 + Super",
    type: "Full-time, Permanent",
    description: "Provide excellent support to our users, answer queries, and improve user experience.",
    responsibilities: ["Respond to tickets", "Create help articles", "Provide product feedback"],
    requirements: ["Excellent communication", "Problem-solving", "Technical aptitude"],
    immigration: {
      pathway: "Employer Nomination Scheme (Subclass 186) - Direct Entry Stream",
      occupationList: "CSOL - May require specific occupation match",
      salaryThreshold: "Must meet $79,423 annual salary (as at 1 July 2026)",
      processingTime: "Generally 6-12 months",
      ageRequirement: "Under 45 years of age",
      link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186"
    },
    applyLink: "mailto:careers@timegovern.com?subject=Customer Support"
  }
]

export default function JobsPage() {

  useEffect(() => {
    document.title = 'Jobs | TimeGovern';
    setPageMeta();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-foreground">TimeGovern Jobs</h1>
      <Card className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-border shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="h-6 w-6" /> Careers at TimeGovern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Join our team based in Melbourne, Australia. We offer hybrid/remote options and flexible working arrangements.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <Card key={job.id} className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">{job.type}</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</p>
                <p className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> {job.salary}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {job.type}</p>
              </div>
              
              <p className="mt-3 text-sm">{job.description}</p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key Responsibilities</h4>
                <ul className="list-disc pl-4 text-sm space-y-1">
                  {job.responsibilities.map(resp => <li key={resp}>{resp}</li>)}
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Requirements</h4>
                <ul className="list-disc pl-4 text-sm space-y-1">
                  {job.requirements.map(req => <li key={req}>{req}</li>)}
                </ul>
              </div>
              
              {/* Immigration Section */}
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                  <FileCheck className="h-3 w-3" /> Immigration Requirements (International Applicants)
                </h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Pathway:</span> {job.immigration.pathway}</p>
                  <p><span className="font-medium">Occupation List:</span> {job.immigration.occupationList}</p>
                  <p><span className="font-medium">Salary Threshold:</span> {job.immigration.salaryThreshold}</p>
                  <p><span className="font-medium">Processing Time:</span> {job.immigration.processingTime}</p>
                  <p><span className="font-medium">Age Requirement:</span> {job.immigration.ageRequirement}</p>
                  <a href={job.immigration.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 mt-1">
                    <ExternalLink className="h-3 w-3" /> Visit Australian Government Website
                  </a>
                </div>
              </div>
              
              <a href={job.applyLink} className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                <ExternalLink className="h-4 w-4" /> Apply Now
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
