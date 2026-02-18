import Navbar from "@/components/Navbar";
import { useState } from "react";
import { CheckCircle, Circle, ChevronRight, BookOpen, Code, Brain, Star, Flame, ExternalLink, BarChart3, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

const skillCategories = [
  {
    id: "technical",
    label: "Technical Skills",
    icon: Code,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    skills: [
      { name: "Data Structures & Algorithms", level: 72, target: 90, status: "in-progress" },
      { name: "System Design", level: 45, target: 80, status: "weak" },
      { name: "React & Frontend", level: 85, target: 92, status: "strong" },
      { name: "Node.js & Backend", level: 68, target: 85, status: "in-progress" },
      { name: "Databases (SQL/NoSQL)", level: 74, target: 85, status: "in-progress" },
      { name: "TypeScript", level: 78, target: 90, status: "in-progress" },
      { name: "DevOps & CI/CD", level: 35, target: 70, status: "weak" },
      { name: "Cloud (AWS/GCP/Azure)", level: 40, target: 75, status: "weak" },
    ],
  },
  {
    id: "soft",
    label: "Soft Skills",
    icon: Brain,
    color: "text-brand-cyan",
    bgColor: "bg-brand-cyan/10",
    borderColor: "border-brand-cyan/30",
    skills: [
      { name: "Communication", level: 65, target: 85, status: "in-progress" },
      { name: "Problem Solving", level: 80, target: 92, status: "strong" },
      { name: "Leadership", level: 55, target: 75, status: "weak" },
      { name: "Teamwork & Collaboration", level: 82, target: 90, status: "strong" },
      { name: "Time Management", level: 70, target: 85, status: "in-progress" },
      { name: "Critical Thinking", level: 78, target: 88, status: "in-progress" },
    ],
  },
  {
    id: "behavioral",
    label: "Behavioral",
    icon: Target,
    color: "text-brand-purple",
    bgColor: "bg-brand-purple/10",
    borderColor: "border-brand-purple/30",
    skills: [
      { name: "STAR Method Storytelling", level: 60, target: 88, status: "in-progress" },
      { name: "Handling Conflict", level: 70, target: 85, status: "in-progress" },
      { name: "Growth Mindset", level: 85, target: 95, status: "strong" },
      { name: "Adaptability", level: 80, target: 90, status: "strong" },
      { name: "Interview Confidence", level: 62, target: 88, status: "in-progress" },
    ],
  },
];

const radarData = [
  { skill: "DSA", score: 72 },
  { skill: "Frontend", score: 85 },
  { skill: "Backend", score: 68 },
  { skill: "System Design", score: 45 },
  { skill: "Soft Skills", score: 70 },
  { skill: "Behavioral", score: 65 },
];

const learningResources = [
  { title: "System Design Interview", type: "Course", platform: "Educative", priority: "High", duration: "20 hrs", icon: "🏗️" },
  { title: "AWS Solutions Architect", type: "Certification", platform: "AWS", priority: "High", duration: "40 hrs", icon: "☁️" },
  { title: "Advanced DSA Patterns", type: "Practice", platform: "LeetCode", priority: "High", duration: "30 hrs", icon: "⚡" },
  { title: "Communication Masterclass", type: "Course", platform: "Coursera", priority: "Medium", duration: "8 hrs", icon: "🗣️" },
  { title: "Docker & Kubernetes", type: "Course", platform: "Udemy", priority: "Medium", duration: "15 hrs", icon: "🐳" },
  { title: "STAR Method Workshop", type: "Workshop", platform: "HireMirror", priority: "Medium", duration: "2 hrs", icon: "⭐" },
];

const weeklyTasks = [
  { week: "Week 1-2", tasks: ["Complete 30 LeetCode medium problems", "Build a system design project", "Watch 10 AWS tutorial videos"], done: [true, false, false] },
  { week: "Week 3-4", tasks: ["Practice 5 mock behavioral interviews", "Build and deploy a full-stack app on AWS", "Complete Docker basics course"], done: [false, false, false] },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("technical");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (key: string) => setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));

  const currentCategory = skillCategories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">AI Skill Assessment · Personalized Roadmap</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">
            Skills <span className="gradient-text">Assessment & Roadmap</span>
          </h1>
          <p className="text-muted-foreground text-lg">AI-identified skill gaps with a personalized 30-day improvement plan</p>
        </div>

        {/* Radar + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
            <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Skill Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 20% 18%)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Radar name="Current" dataKey="score" stroke="hsl(217 100% 60%)" fill="hsl(217 100% 60%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
              <div>
                <div className="text-brand-green font-bold">Strong</div>
                <div className="text-xs text-muted-foreground">3 skills</div>
              </div>
              <div>
                <div className="text-brand-gold font-bold">Growing</div>
                <div className="text-xs text-muted-foreground">8 skills</div>
              </div>
              <div>
                <div className="text-destructive font-bold">Weak</div>
                <div className="text-xs text-muted-foreground">5 skills</div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-gold" /> Recommended Learning Resources
            </h3>
            <div className="space-y-3">
              {learningResources.map((res) => (
                <div key={res.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group">
                  <span className="text-xl">{res.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-foreground">{res.title}</div>
                    <div className="text-xs text-muted-foreground">{res.platform} · {res.duration} · {res.type}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    res.priority === "High" ? "bg-destructive/20 text-destructive" : "bg-brand-gold/20 text-brand-gold"
                  }`}>
                    {res.priority}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? `${cat.bgColor} ${cat.color} ${cat.borderColor} border`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skill bars */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {currentCategory.skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      skill.status === "strong" ? "bg-brand-green/20 text-brand-green" :
                      skill.status === "in-progress" ? "bg-primary/20 text-primary" :
                      "bg-destructive/20 text-destructive"
                    }`}>
                      {skill.status === "in-progress" ? "Growing" : skill.status === "strong" ? "Strong" : "Needs Work"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{skill.level}%</span> → {skill.target}%
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`absolute h-full rounded-full animate-progress ${
                      skill.status === "strong" ? "bg-brand-green" :
                      skill.status === "in-progress" ? "bg-primary" : "bg-brand-gold"
                    }`}
                    style={{ width: `${skill.level}%` }}
                  />
                  <div
                    className="absolute h-full w-0.5 bg-foreground/20"
                    style={{ left: `${skill.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Plan */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-gold" /> 30-Day AI Improvement Plan
          </h3>
          <div className="space-y-4">
            {weeklyTasks.map((week) => (
              <div key={week.week} className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted/30 px-4 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-gold" />
                  <span className="font-semibold text-sm text-foreground">{week.week}</span>
                </div>
                <div className="p-4 space-y-2">
                  {week.tasks.map((task, i) => {
                    const key = `${week.week}-${i}`;
                    const done = completedTasks[key] || week.done[i];
                    return (
                      <div
                        key={task}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 cursor-pointer transition-colors"
                        onClick={() => toggleTask(key)}
                      >
                        {done ? (
                          <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/interview"
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-blue"
          >
            Practice These Skills in Mock Interview
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
