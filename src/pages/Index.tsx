import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Brain, Zap, Target, TrendingUp, Award, Users, Star, CheckCircle, Play, ChevronRight, Mic, FileText, BarChart3, Trophy, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "94%", label: "Interview Success Rate" },
  { value: "50K+", label: "Candidates Prepared" },
  { value: "2.3x", label: "Faster Job Placement" },
  { value: "4.9★", label: "User Rating" },
];

const features = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
    desc: "GPT-powered parsing evaluates your resume, gaps, and ATS compatibility in seconds.",
    color: "brand-blue",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Mic,
    title: "Adaptive Mock Interviews",
    desc: "Real-time AI interviews that adapt difficulty based on your responses and target role.",
    color: "brand-cyan",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    icon: BarChart3,
    title: "Job Readiness Score",
    desc: "Comprehensive 0-100 score across technical, soft skills, and behavioral dimensions.",
    color: "brand-purple",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: Target,
    title: "Personalized Roadmap",
    desc: "AI-generated improvement plans with courses, exercises, and practice projects.",
    color: "brand-green",
    gradient: "from-green-500/20 to-green-600/5",
  },
  {
    icon: Trophy,
    title: "Gamification & Streaks",
    desc: "Earn badges, maintain streaks, and compete on leaderboards to stay motivated.",
    color: "brand-gold",
    gradient: "from-yellow-500/20 to-yellow-600/5",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    desc: "Visual dashboards tracking skill growth, score trends, and interview performance.",
    color: "brand-blue",
    gradient: "from-blue-500/20 to-indigo-600/5",
  },
];

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer @ Google", text: "HireMirror AI transformed my interview prep. The adaptive questions felt like real Google interviews!", avatar: "PS" },
  { name: "Marcus Johnson", role: "Data Scientist @ Meta", text: "The readiness score feature gave me a clear picture of exactly where I needed to improve.", avatar: "MJ" },
  { name: "Aisha Patel", role: "Product Manager @ Amazon", text: "The video analysis feature caught communication habits I didn't even know I had!", avatar: "AP" },
];

const typingTexts = ["Dream Job", "Perfect Career", "Next Interview", "Ideal Role"];

export default function Index() {
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = typingTexts[currentText];
    const speed = isDeleting ? 60 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === target) {
        setTimeout(() => setIsDeleting(true), 1500);
        return;
      }
      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentText((prev) => (prev + 1) % typingTexts.length);
        return;
      }
      setDisplayText(isDeleting ? target.slice(0, displayText.length - 1) : target.slice(0, displayText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentText]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="Hero background" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-cyan/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 fade-in-up">
              <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Powered by GPT-4 · Whisper AI · Computer Vision</span>
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">AI That Builds Your</span>
              <br />
              <span className="gradient-text">Perfect </span>
              <span className="text-foreground inline-block min-w-[280px] sm:min-w-[380px] text-left typing-cursor">
                {displayText}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
              All-in-one AI career platform. Resume analysis, adaptive mock interviews, 
              multi-layered feedback, and gamified progress — everything to land your dream job.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-blue hover:scale-105"
              >
                <Brain className="w-5 h-5" />
                Start Your Career Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/interview"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl glass border border-white/10 text-foreground font-semibold text-lg hover:border-primary/40 transition-all"
              >
                <Play className="w-5 h-5 text-primary" />
                Try Mock Interview
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                  <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Platform Features</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Everything You Need to <span className="gradient-text">Ace Any Interview</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From resume parsing to body language analysis — one platform, complete career readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`glass-card rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 text-${f.color}`} />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Your <span className="gradient-text">Career Transformation</span> in 4 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload Resume", desc: "Drop your resume and let AI analyze your skills, gaps, and ATS score", icon: FileText },
              { step: "02", title: "Get Your Score", desc: "Receive a comprehensive 0-100 Job Readiness Score across all dimensions", icon: Target },
              { step: "03", title: "Practice Interviews", desc: "Do adaptive AI mock interviews with real-time video and audio feedback", icon: Mic },
              { step: "04", title: "Land the Job", desc: "Track progress, earn badges, and apply with confidence to your dream role", icon: Trophy },
            ].map((step, i) => (
              <div key={step.step} className="relative text-center group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 mx-auto glow-blue group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted border border-border text-xs font-bold flex items-center justify-center text-muted-foreground">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Candidates Who <span className="gradient-text">Landed Their Dream Jobs</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-12 relative overflow-hidden gradient-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-brand-cyan/10" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 glow-blue animate-float">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-4xl font-extrabold mb-4">
                Ready to <span className="gradient-text">Mirror Your Potential?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join 50,000+ candidates who transformed their careers with AI-powered preparation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity glow-blue"
                >
                  <Sparkles className="w-5 h-5" />
                  Launch Your Dashboard
                </Link>
                <Link
                  to="/resume"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-primary/40 text-primary font-semibold text-lg hover:bg-primary/10 transition-colors"
                >
                  Analyze My Resume
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                {["No credit card required", "Free to start", "AI-powered results"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <Brain className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-bold gradient-text">HireMirror AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 HireMirror AI · Built by Ankit Kumar · Empowering careers worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}
