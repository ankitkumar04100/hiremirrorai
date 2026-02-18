import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, ChevronRight, Clock, Brain, Star, Send, CheckCircle, XCircle, AlertCircle, RotateCcw, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const interviewCategories = [
  { id: "frontend", label: "Frontend Engineer", companies: ["Google", "Meta", "Netflix"], difficulty: "Hard" },
  { id: "backend", label: "Backend Engineer", companies: ["Amazon", "Microsoft", "Uber"], difficulty: "Hard" },
  { id: "data", label: "Data Scientist", companies: ["Apple", "Tesla", "OpenAI"], difficulty: "Medium" },
  { id: "pm", label: "Product Manager", companies: ["Amazon", "Airbnb", "Spotify"], difficulty: "Medium" },
  { id: "design", label: "UX Designer", companies: ["Adobe", "Figma", "Canva"], difficulty: "Easy" },
  { id: "devops", label: "DevOps Engineer", companies: ["AWS", "Google Cloud", "HashiCorp"], difficulty: "Hard" },
];

const questionBank: Record<string, Array<{ q: string; hint: string; followup: string }>> = {
  frontend: [
    {
      q: "Explain the difference between `useMemo` and `useCallback` in React. When would you use each?",
      hint: "Think about what each one memoizes — values vs. functions.",
      followup: "Can you give a real scenario where misusing one caused a performance bug?",
    },
    {
      q: "How would you optimize a React application that renders a list of 10,000 items?",
      hint: "Consider virtualization, pagination, and memoization strategies.",
      followup: "What library would you use and why?",
    },
    {
      q: "Describe your approach to making a web application fully accessible (WCAG 2.1 compliant).",
      hint: "Think about semantic HTML, ARIA labels, keyboard navigation, and color contrast.",
      followup: "How do you test for accessibility?",
    },
  ],
  backend: [
    {
      q: "Design a rate limiter that limits API calls to 100 requests per minute per user.",
      hint: "Consider sliding window, token bucket, or fixed window algorithms.",
      followup: "How would you handle distributed systems with multiple servers?",
    },
    {
      q: "What is eventual consistency and how do you handle it in a microservices architecture?",
      hint: "Think about CAP theorem, SAGA pattern, and distributed transactions.",
      followup: "Can you give an example from your past experience?",
    },
  ],
  data: [
    {
      q: "How would you handle class imbalance in a binary classification problem?",
      hint: "Consider SMOTE, undersampling, cost-sensitive learning, and threshold tuning.",
      followup: "Which metric would you optimize and why?",
    },
    {
      q: "Walk me through how you would build an A/B testing framework from scratch.",
      hint: "Think about statistical significance, sample size calculation, and avoiding p-hacking.",
      followup: "How long would you run the experiment?",
    },
  ],
  pm: [
    {
      q: "How would you prioritize features on a product roadmap when you have 10 stakeholders with conflicting needs?",
      hint: "Think about frameworks like RICE, ICE scoring, or MoSCoW method.",
      followup: "How do you communicate these decisions back to stakeholders?",
    },
    {
      q: "Describe how you would define and measure the success of a new feature launch.",
      hint: "Think about north star metrics, guardrail metrics, and leading vs. lagging indicators.",
      followup: "What would you do if the metrics showed unexpected results?",
    },
  ],
  design: [
    {
      q: "Walk me through your design process for a complex feature, from discovery to delivery.",
      hint: "Mention research, wireframing, prototyping, user testing, and iteration.",
      followup: "How do you balance user needs with business goals?",
    },
  ],
  devops: [
    {
      q: "How would you design a zero-downtime deployment pipeline for a critical production service?",
      hint: "Consider blue-green deployment, canary releases, feature flags, and rollback strategies.",
      followup: "How do you handle database migrations in this scenario?",
    },
  ],
};

const feedbackMessages = [
  "Strong answer! You clearly articulated the core concepts.",
  "Good structure! Consider adding a specific example next time.",
  "Solid foundation — try to quantify your impact with metrics.",
  "Great depth! The follow-up question revealed your expertise.",
  "Well-structured response with the STAR method. Excellent work!",
];

type Phase = "setup" | "interview" | "feedback";

export default function MockInterview() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedRole, setSelectedRole] = useState("frontend");
  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const questions = questionBank[selectedRole] || questionBank["frontend"];
  const currentQuestion = questions[currentQ];

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timer]);

  const startInterview = () => {
    setPhase("interview");
    setTimerActive(true);
    setCurrentQ(0);
    setAnswers([]);
    setScores([]);
    setTimer(120);
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    const score = Math.floor(Math.random() * 25) + 70; // Simulate score 70-95
    setScores((prev) => [...prev, score]);
    setAnswers((prev) => [...prev, currentAnswer]);
    setCurrentAnswer("");
    setShowHint(false);
    setShowFollowup(false);
    setTimer(120);

    if (currentQ + 1 >= questions.length) {
      setPhase("feedback");
      setTimerActive(false);
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Setup Phase */}
        {phase === "setup" && (
          <div className="fade-in-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">AI-Powered · Adaptive Difficulty</span>
              </div>
              <h1 className="font-display text-4xl font-bold mb-3">
                <span className="gradient-text">Mock Interview</span> Simulator
              </h1>
              <p className="text-muted-foreground text-lg">Select your target role and let AI adapt to your skill level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {interviewCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedRole(cat.id); setSelectedCompany(cat.companies[0]); }}
                  className={`glass-card rounded-xl p-5 text-left transition-all duration-200 hover:-translate-y-1 ${
                    selectedRole === cat.id ? "border-primary/50 glow-blue" : "hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      cat.difficulty === "Hard" ? "bg-destructive/20 text-destructive" :
                      cat.difficulty === "Medium" ? "bg-brand-gold/20 text-brand-gold" :
                      "bg-brand-green/20 text-brand-green"
                    }`}>
                      {cat.difficulty}
                    </span>
                    {selectedRole === cat.id && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{cat.label}</h3>
                  <div className="flex flex-wrap gap-1">
                    {cat.companies.map((c) => (
                      <span key={c} className="text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Company selector */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <h3 className="font-display font-semibold text-foreground mb-3">Target Company</h3>
              <div className="flex flex-wrap gap-2">
                {(interviewCategories.find((c) => c.id === selectedRole)?.companies || []).map((company) => (
                  <button
                    key={company}
                    onClick={() => setSelectedCompany(company)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCompany === company
                        ? "bg-gradient-primary text-primary-foreground glow-blue"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startInterview}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all glow-blue hover:scale-105"
              >
                <Mic className="w-5 h-5" />
                Start {selectedCompany} Interview
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-muted-foreground mt-3">~15 min · {questions.length} adaptive questions · AI feedback included</p>
            </div>
          </div>
        )}

        {/* Interview Phase */}
        {phase === "interview" && (
          <div className="fade-in-up">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-sm font-medium text-foreground">{selectedCompany} · {interviewCategories.find((c) => c.id === selectedRole)?.label}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video preview (simulated) */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass-card rounded-2xl overflow-hidden aspect-video relative bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                  {videoOn ? (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-2 glow-blue">
                        <span className="text-2xl font-bold text-primary-foreground">A</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Ankit Kumar</div>
                      {micOn && <div className="flex items-center justify-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="w-1 bg-brand-green rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 8}px`, animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>}
                    </div>
                  ) : (
                    <VideoOff className="w-8 h-8 text-muted-foreground" />
                  )}
                  <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${micOn ? "bg-brand-green animate-pulse" : "bg-destructive"}`} />
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${micOn ? "bg-muted/40 text-foreground hover:bg-muted/60" : "bg-destructive/20 text-destructive"}`}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    {micOn ? "Muted" : "Unmute"}
                  </button>
                  <button
                    onClick={() => setVideoOn(!videoOn)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${videoOn ? "bg-muted/40 text-foreground hover:bg-muted/60" : "bg-destructive/20 text-destructive"}`}
                  >
                    {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    {videoOn ? "Video On" : "Video Off"}
                  </button>
                </div>

                {/* Timer */}
                <div className={`glass-card rounded-xl p-4 text-center ${timer <= 30 ? "border-destructive/50" : ""}`}>
                  <Clock className={`w-5 h-5 mx-auto mb-2 ${timer <= 30 ? "text-destructive" : "text-muted-foreground"}`} />
                  <div className={`font-display text-3xl font-bold ${timer <= 30 ? "text-destructive" : "gradient-text"}`}>
                    {formatTime(timer)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Time remaining</div>
                </div>
              </div>

              {/* Question & Answer */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 font-medium">AI Interviewer · {selectedCompany}</div>
                      <p className="text-foreground font-medium leading-relaxed text-lg">{currentQuestion?.q}</p>
                    </div>
                  </div>

                  {showFollowup && (
                    <div className="mt-4 p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20">
                      <div className="text-xs text-brand-cyan font-semibold mb-1">Follow-up question:</div>
                      <p className="text-sm text-foreground">{currentQuestion?.followup}</p>
                    </div>
                  )}

                  {showHint && (
                    <div className="mt-4 p-3 rounded-lg bg-brand-gold/10 border border-brand-gold/20">
                      <div className="text-xs text-brand-gold font-semibold mb-1">💡 Hint:</div>
                      <p className="text-sm text-muted-foreground">{currentQuestion?.hint}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                    >
                      💡 Hint
                    </button>
                    <button
                      onClick={() => setShowFollowup(!showFollowup)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
                    >
                      Follow-up
                    </button>
                  </div>
                </div>

                {/* Answer area */}
                <div className="glass-card rounded-2xl p-6">
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">Your Answer</label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Use the STAR method: Situation, Task, Action, Result"
                    className="w-full h-40 bg-muted/20 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary/50 resize-none transition-colors"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">{currentAnswer.length} characters</span>
                    <button
                      onClick={submitAnswer}
                      disabled={!currentAnswer.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-blue"
                    >
                      <Send className="w-4 h-4" />
                      {currentQ + 1 >= questions.length ? "Finish Interview" : "Next Question"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Phase */}
        {phase === "feedback" && (
          <div className="fade-in-up max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 glow-blue animate-float">
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-2">Interview Complete! 🎉</h2>
              <p className="text-muted-foreground">Here's your detailed AI feedback</p>
            </div>

            {/* Score card */}
            <div className="glass-card rounded-2xl p-6 mb-6 text-center">
              <div className="font-display text-6xl font-extrabold gradient-text mb-2">{avgScore}</div>
              <div className="text-muted-foreground mb-4">Overall Performance Score</div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Technical", score: Math.min(100, avgScore + Math.floor(Math.random() * 10) - 5) },
                  { label: "Communication", score: Math.min(100, avgScore - Math.floor(Math.random() * 15)) },
                  { label: "Problem Solving", score: Math.min(100, avgScore + Math.floor(Math.random() * 8)) },
                ].map((d) => (
                  <div key={d.label} className="text-center">
                    <div className={`font-display text-2xl font-bold ${d.score >= 80 ? "text-brand-green" : "text-brand-gold"}`}>{d.score}</div>
                    <div className="text-xs text-muted-foreground">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Q&A Feedback */}
            <div className="space-y-4 mb-6">
              {answers.map((answer, i) => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-medium text-foreground flex-1">{questions[i]?.q}</p>
                    <div className={`text-lg font-bold font-display flex-shrink-0 ${scores[i] >= 80 ? "text-brand-green" : "text-brand-gold"}`}>
                      {scores[i]}/100
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3 mb-3">{answer.slice(0, 150)}...</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">{feedbackMessages[i % feedbackMessages.length]}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setPhase("setup"); setCurrentQ(0); setAnswers([]); setScores([]); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                to="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-blue"
              >
                View Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
