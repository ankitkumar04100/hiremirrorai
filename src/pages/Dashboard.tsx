import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Brain, Target, Flame, Zap, Trophy, Users, Lightbulb, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const radarData = [
  { skill: "Technical", score: 78 },
  { skill: "Communication", score: 65 },
  { skill: "Problem Solving", score: 82 },
  { skill: "Soft Skills", score: 70 },
  { skill: "Leadership", score: 55 },
  { skill: "Domain", score: 85 },
];

const progressData = [
  { week: "W1", score: 42, interviews: 1 },
  { week: "W2", score: 51, interviews: 2 },
  { week: "W3", score: 58, interviews: 3 },
  { week: "W4", score: 63, interviews: 2 },
  { week: "W5", score: 70, interviews: 4 },
  { week: "W6", score: 74, interviews: 3 },
  { week: "W7", score: 79, interviews: 5 },
];

const badges = [
  { name: "First Interview", icon: "🎯", earned: true, desc: "Completed your first mock interview" },
  { name: "7-Day Streak", icon: "🔥", earned: true, desc: "Practiced 7 days in a row" },
  { name: "Resume Pro", icon: "📄", earned: true, desc: "Resume scored 80+" },
  { name: "Quick Thinker", icon: "⚡", earned: true, desc: "Answered 10 rapid-fire questions" },
  { name: "Communication Star", icon: "⭐", earned: false, desc: "Score 90+ on communication" },
  { name: "Technical Wizard", icon: "🧙", earned: false, desc: "Ace 5 technical interviews" },
];

const recentInterviews = [
  { role: "Frontend Engineer", company: "Google", score: 82, date: "2 hrs ago", difficulty: "Hard" },
  { role: "Product Manager", company: "Amazon", score: 75, date: "1 day ago", difficulty: "Medium" },
  { role: "Data Scientist", company: "Meta", score: 88, date: "3 days ago", difficulty: "Hard" },
];

const improvementTasks = [
  { task: "Practice STAR method answers", priority: "High", done: false },
  { task: "Review system design concepts", priority: "High", done: false },
  { task: "Watch communication tips video", priority: "Medium", done: true },
  { task: "Complete React hooks quiz", priority: "Medium", done: true },
];

/* ── Animated Gauge ── */
function ReadinessGauge({ score }: { score: number }) {
  const [animScore, setAnimScore] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setAnimScore(Math.min(current, score));
        if (current >= score) clearInterval(interval);
      }, 18);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, [score, isInView]);

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (animScore / 100) * circumference;
  const color = animScore >= 75 ? "#22d3ee" : animScore >= 50 ? "#3b82f6" : "#f59e0b";

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <svg width="200" height="200" className="-rotate-90">
        <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(220 20% 12%)" strokeWidth="12" />
        <circle
          cx="100" cy="100" r="80" fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.div
          className="font-display text-5xl font-extrabold gradient-text"
          key={animScore}
        >
          {animScore}
        </motion.div>
        <div className="text-xs text-muted-foreground font-medium mt-1">Job Readiness</div>
        <div className="text-xs text-brand-green font-semibold mt-0.5">+7 this week</div>
      </div>
    </div>
  );
}

/* ── Animated Skill Bar ── */
function SkillBar({ label, val, color, delay }: { label: string; val: number; color: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${val}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs font-semibold text-foreground mt-1">{val}%</div>
    </div>
  );
}

/* ── Container variants ── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, <span className="gradient-text">Ankit</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">You're on a <span className="text-brand-gold font-semibold">12-day streak</span> 🔥 Keep it up!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-gold" />
              <span className="text-sm font-semibold text-brand-gold">12 Day Streak</span>
            </div>
            <Link to="/interview" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-blue">
              <Zap className="w-4 h-4" />
              Start Interview
            </Link>
          </div>
        </motion.div>

        {/* KPI row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: "Job Readiness", value: "79/100", change: "+7", icon: Target, color: "text-primary" },
            { label: "Interviews Done", value: "23", change: "+4", icon: Brain, color: "text-brand-cyan" },
            { label: "Badges Earned", value: "4/12", change: "+1", icon: Trophy, color: "text-brand-gold" },
            { label: "Rank", value: "#147", change: "↑23", icon: Users, color: "text-brand-green" },
          ].map((kpi) => (
            <motion.div key={kpi.label} variants={cardVariant} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-brand-green font-medium mt-1">{kpi.change} this week</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Gauge */}
          <motion.div variants={cardVariant} className="glass-card rounded-2xl p-6 flex flex-col items-center">
            <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Overall Score</h3>
            <ReadinessGauge score={79} />
            <div className="mt-4 grid grid-cols-3 gap-2 w-full">
              <SkillBar label="Technical" val={78} color="bg-primary" delay={0.2} />
              <SkillBar label="Soft Skills" val={70} color="bg-brand-cyan" delay={0.4} />
              <SkillBar label="Behavioral" val={65} color="bg-brand-purple" delay={0.6} />
            </div>
          </motion.div>

          {/* Radar */}
          <motion.div variants={cardVariant} className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Skill Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 20% 18%)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="hsl(217 100% 60%)" fill="hsl(217 100% 60%)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Area chart */}
          <motion.div variants={cardVariant} className="glass-card rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Score Progress</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 100%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 100%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 12%)" />
                <XAxis dataKey="week" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 100]} />
                <Tooltip contentStyle={{ background: "hsl(220 25% 7%)", border: "1px solid hsl(220 20% 14%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
                <Area type="monotone" dataKey="score" stroke="hsl(217 100% 60%)" strokeWidth={2} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Bottom grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Recent Interviews */}
          <motion.div variants={cardVariant} className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent Interviews</h3>
              <Link to="/interview" className="text-xs text-primary hover:underline flex items-center gap-1">
                New Interview <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentInterviews.map((interview, i) => (
                <motion.div
                  key={interview.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {interview.company[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{interview.role}</div>
                      <div className="text-xs text-muted-foreground">{interview.company} · {interview.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${interview.difficulty === "Hard" ? "bg-destructive/20 text-destructive" : "bg-brand-cyan/20 text-brand-cyan"}`}>
                      {interview.difficulty}
                    </span>
                    <div className={`font-display text-lg font-bold ${interview.score >= 80 ? "text-brand-green" : "text-brand-gold"}`}>
                      {interview.score}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Action Plan */}
          <motion.div variants={cardVariant} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-brand-gold" />
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Action Plan</h3>
            </div>
            <div className="space-y-3">
              {improvementTasks.map((task, i) => (
                <motion.div
                  key={task.task}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${task.done ? "opacity-50" : ""}`}
                >
                  <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${task.done ? "text-brand-green" : "text-muted"}`} />
                  <div className="flex-1">
                    <div className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.task}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded text-xs font-medium mt-1 inline-block ${task.priority === "High" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}>
                      {task.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/skills" className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors">
              View Full Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card rounded-2xl p-6 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Achievements</h3>
            <Link to="/gamification" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + i * 0.07, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.07, y: -2 }}
                className={`text-center p-3 rounded-xl transition-all cursor-default ${
                  badge.earned
                    ? "bg-gradient-to-br from-brand-gold/15 to-yellow-600/5 border border-brand-gold/30 glow-gold"
                    : "bg-muted/20 border border-muted/20 opacity-40 grayscale"
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-semibold text-foreground leading-tight">{badge.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
