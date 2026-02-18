import Navbar from "@/components/Navbar";
import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Brain, Zap, Star, ChevronRight, Download, Edit3, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockAnalysis = {
  atsScore: 82,
  overallScore: 78,
  strengths: [
    "Strong technical skills section with quantified achievements",
    "Clear chronological work experience with impact metrics",
    "Relevant keywords for the target role detected",
    "Education section is well-formatted and prominent",
  ],
  weaknesses: [
    "Missing LinkedIn profile URL in contact section",
    "No summary/objective statement to grab recruiter attention",
    "Projects section lacks GitHub links and technology stack details",
    "Some bullet points lack action verbs or measurable results",
  ],
  skills: [
    { name: "JavaScript", level: 90, status: "strong" },
    { name: "React", level: 85, status: "strong" },
    { name: "TypeScript", level: 78, status: "good" },
    { name: "Node.js", level: 70, status: "good" },
    { name: "System Design", level: 45, status: "weak" },
    { name: "Testing/TDD", level: 50, status: "weak" },
    { name: "DevOps/CI/CD", level: 35, status: "missing" },
    { name: "Cloud (AWS/GCP)", level: 40, status: "weak" },
  ],
  keywords: {
    found: ["React", "TypeScript", "REST API", "Git", "Agile", "MongoDB", "Redux"],
    missing: ["AWS", "Docker", "Kubernetes", "GraphQL", "Testing", "CI/CD", "Performance"],
  },
  sectionScores: [
    { section: "Contact", score: 70 },
    { section: "Summary", score: 30 },
    { section: "Experience", score: 85 },
    { section: "Skills", score: 90 },
    { section: "Education", score: 88 },
    { section: "Projects", score: 60 },
  ],
  improvements: [
    { priority: "High", task: "Add a compelling 2-3 sentence professional summary", impact: "+8 pts" },
    { priority: "High", task: "Include GitHub and LinkedIn URLs in contact info", impact: "+5 pts" },
    { priority: "High", task: "Add Docker/AWS experience or learning projects", impact: "+7 pts" },
    { priority: "Medium", task: "Quantify remaining bullet points with metrics", impact: "+4 pts" },
    { priority: "Medium", task: "Add a 'Testing & Tools' subsection to skills", impact: "+3 pts" },
    { priority: "Low", task: "Format bullet points consistently (all start with action verbs)", impact: "+2 pts" },
  ],
};

export default function ResumeAnalysis() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setUploaded(true);
    setAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setDone(true);
          return 100;
        }
        return p + 2;
      });
    }, 60);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">GPT-4 Powered · ATS Checker · Skill Gap Analysis</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">
            AI <span className="gradient-text">Resume Analyzer</span>
          </h1>
          <p className="text-muted-foreground text-lg">Upload your resume for instant AI-powered analysis, ATS scoring, and personalized improvement suggestions</p>
        </div>

        {/* Upload Area */}
        {!done && (
          <div className="max-w-2xl mx-auto mb-8">
            <div
              className={`glass-card rounded-2xl p-12 text-center border-2 border-dashed transition-all cursor-pointer ${
                dragOver ? "border-primary glow-blue" : "border-border hover:border-primary/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 glow-blue animate-float">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {dragOver ? "Drop your resume here!" : "Upload Your Resume"}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">Drag & drop or click to browse · PDF, DOC, DOCX, TXT</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold">
                <FileText className="w-4 h-4" />
                Choose File
              </div>
            </div>

            {/* Demo option */}
            <div className="text-center mt-4">
              <span className="text-muted-foreground text-sm">or </span>
              <button
                onClick={() => handleFile(new File(["demo"], "sample-resume.pdf", { type: "application/pdf" }))}
                className="text-primary text-sm hover:underline font-medium"
              >
                analyze sample resume →
              </button>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {analyzing && (
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 animate-spin-slow">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Analyzing {fileName}...</h3>
            <div className="space-y-2 mb-6 text-left">
              {[
                { label: "Parsing document structure", done: progress > 20 },
                { label: "Extracting skills & keywords", done: progress > 40 },
                { label: "Running ATS compatibility check", done: progress > 60 },
                { label: "Generating personalized recommendations", done: progress > 80 },
                { label: "Computing readiness score", done: progress > 95 },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3 py-1">
                  {step.done ? (
                    <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                  )}
                  <span className={`text-sm ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-primary rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-2">{progress}% complete</div>
          </div>
        )}

        {/* Results */}
        {done && (
          <div className="space-y-6 fade-in-up">
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="font-display text-5xl font-extrabold gradient-text mb-1">{mockAnalysis.atsScore}</div>
                <div className="text-muted-foreground text-sm font-medium">ATS Score</div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${mockAnalysis.atsScore}%` }} />
                </div>
                <div className="text-xs text-brand-green mt-2">✓ ATS Friendly</div>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="font-display text-5xl font-extrabold text-brand-cyan mb-1">{mockAnalysis.overallScore}</div>
                <div className="text-muted-foreground text-sm font-medium">Resume Quality</div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${mockAnalysis.overallScore}%` }} />
                </div>
                <div className="text-xs text-brand-gold mt-2">↑ +12 pts potential</div>
              </div>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="font-display text-5xl font-extrabold text-brand-green mb-1">{mockAnalysis.keywords.found.length}</div>
                <div className="text-muted-foreground text-sm font-medium">Keywords Found</div>
                <div className="text-xs text-muted-foreground mt-2">{mockAnalysis.keywords.missing.length} missing keywords</div>
                <div className="mt-3 flex flex-wrap gap-1 justify-center">
                  {mockAnalysis.keywords.found.slice(0, 3).map((k) => (
                    <span key={k} className="text-xs px-1.5 py-0.5 rounded bg-brand-green/20 text-brand-green">{k}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section Scores Chart */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Section Analysis
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockAnalysis.sectionScores} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 12%)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="section" type="category" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                    <Tooltip contentStyle={{ background: "hsl(220 25% 7%)", border: "1px solid hsl(220 20% 14%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
                    <Bar dataKey="score" fill="hsl(217 100% 60%)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Skills Gap */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-cyan" /> Skill Levels
                </h3>
                <div className="space-y-2.5">
                  {mockAnalysis.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{skill.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${
                            skill.status === "strong" ? "bg-brand-green" :
                            skill.status === "good" ? "bg-primary" :
                            skill.status === "weak" ? "bg-brand-gold" : "bg-destructive"
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-8 text-right">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths & Weaknesses */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-green" /> Strengths
                </h3>
                <div className="space-y-2">
                  {mockAnalysis.strengths.map((s) => (
                    <div key={s} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-display font-bold text-foreground mt-5 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" /> Areas to Improve
                </h3>
                <div className="space-y-2">
                  {mockAnalysis.weaknesses.map((w) => (
                    <div key={w} className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Plan */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-gold" /> AI Action Plan
                </h3>
                <div className="space-y-3">
                  {mockAnalysis.improvements.map((item) => (
                    <div key={item.task} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0 mt-0.5 ${
                        item.priority === "High" ? "bg-destructive/20 text-destructive" :
                        item.priority === "Medium" ? "bg-brand-gold/20 text-brand-gold" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.priority}
                      </span>
                      <div className="flex-1">
                        <span className="text-sm text-foreground">{item.task}</span>
                      </div>
                      <span className="text-xs text-brand-green font-semibold flex-shrink-0">{item.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-foreground mb-4">Keyword Analysis</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-brand-green font-semibold mb-2">✓ Found Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {mockAnalysis.keywords.found.map((k) => (
                      <span key={k} className="text-xs px-2 py-1 rounded-full bg-brand-green/15 border border-brand-green/30 text-brand-green">{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-brand-gold font-semibold mb-2">⚠ Missing Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {mockAnalysis.keywords.missing.map((k) => (
                      <span key={k} className="text-xs px-2 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { setDone(false); setUploaded(false); setFileName(""); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload New Resume
              </button>
              <Link
                to="/skills"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-blue"
              >
                View Skill Roadmap
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
