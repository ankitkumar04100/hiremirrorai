import Navbar from "@/components/Navbar";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, ChevronRight, Clock, Brain, Send, CheckCircle, RotateCcw, Trophy, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const interviewCategories = [
  { id: "Frontend Engineer", label: "Frontend Engineer", companies: ["Google", "Meta", "Netflix"], difficulty: "Hard" },
  { id: "Backend Engineer", label: "Backend Engineer", companies: ["Amazon", "Microsoft", "Uber"], difficulty: "Hard" },
  { id: "Data Scientist", label: "Data Scientist", companies: ["Apple", "Tesla", "OpenAI"], difficulty: "Medium" },
  { id: "Product Manager", label: "Product Manager", companies: ["Amazon", "Airbnb", "Spotify"], difficulty: "Medium" },
  { id: "UX Designer", label: "UX Designer", companies: ["Adobe", "Figma", "Canva"], difficulty: "Easy" },
  { id: "DevOps Engineer", label: "DevOps Engineer", companies: ["AWS", "Google Cloud", "HashiCorp"], difficulty: "Hard" },
];

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-ai`;

interface AIQuestion {
  question: string;
  hint: string;
  followup: string;
  category: string;
}

interface AIFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  modelAnswer: string;
}

type Phase = "setup" | "interview" | "feedback";

export default function MockInterview() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedRole, setSelectedRole] = useState("Frontend Engineer");
  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [currentQ, setCurrentQ] = useState(0);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<AIFeedback[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [timer, setTimer] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [totalQuestions] = useState(3);
  const timerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = questions[currentQ];

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timer]);

  const fetchQuestion = async (questionIndex: number, prevQs: AIQuestion[]) => {
    setLoadingQuestion(true);
    try {
      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_question",
          role: selectedRole,
          company: selectedCompany,
          conversationHistory: prevQs.map((q) => q.question),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch question");
      }
      const q: AIQuestion = await res.json();
      setQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex] = q;
        return updated;
      });
    } catch (e) {
      toast({
        title: "AI Error",
        description: e instanceof Error ? e.message : "Failed to generate question",
        variant: "destructive",
      });
    } finally {
      setLoadingQuestion(false);
    }
  };

  const startInterview = async () => {
    setPhase("interview");
    setTimerActive(true);
    setCurrentQ(0);
    setAnswers([]);
    setFeedbacks([]);
    setQuestions([]);
    setTimer(180);
    await fetchQuestion(0, []);
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim() || !currentQuestion) return;
    setLoadingFeedback(true);
    setTimerActive(false);

    try {
      const res = await fetch(EDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_answer",
          role: selectedRole,
          company: selectedCompany,
          question: currentQuestion.question,
          answer: currentAnswer,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to evaluate answer");
      }
      const feedback: AIFeedback = await res.json();
      const newAnswers = [...answers, currentAnswer];
      const newFeedbacks = [...feedbacks, feedback];
      setAnswers(newAnswers);
      setFeedbacks(newFeedbacks);
      setCurrentAnswer("");
      setShowHint(false);
      setShowFollowup(false);

      if (currentQ + 1 >= totalQuestions) {
        setPhase("feedback");
      } else {
        const nextIdx = currentQ + 1;
        setCurrentQ(nextIdx);
        setTimer(180);
        setTimerActive(true);
        await fetchQuestion(nextIdx, questions.slice(0, nextIdx));
      }
    } catch (e) {
      toast({
        title: "Evaluation Error",
        description: e instanceof Error ? e.message : "Failed to evaluate your answer",
        variant: "destructive",
      });
    } finally {
      setLoadingFeedback(false);
    }
  };

  const avgScore =
    feedbacks.length > 0 ? Math.round(feedbacks.reduce((a, b) => a + b.score, 0) / feedbacks.length) : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Setup Phase */}
        <AnimatePresence mode="wait">
          {phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">Real AI · Powered by Gemini</span>
                </div>
                <h1 className="font-display text-4xl font-bold mb-3">
                  <span className="gradient-text">Mock Interview</span> Simulator
                </h1>
                <p className="text-muted-foreground text-lg">AI generates fresh, role-specific questions for every session</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {interviewCategories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
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
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-xl p-6 mb-8"
              >
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
              </motion.div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startInterview}
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all glow-blue"
                >
                  <Mic className="w-5 h-5" />
                  Start {selectedCompany} Interview
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <p className="text-xs text-muted-foreground mt-3">~15 min · {totalQuestions} AI-generated questions · real-time evaluation</p>
              </div>
            </motion.div>
          )}

          {/* Interview Phase */}
          {phase === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Question {currentQ + 1} of {totalQuestions}</span>
                  <span className="text-sm font-medium text-foreground">{selectedCompany} · {selectedRole}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQ / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video preview */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="glass-card rounded-2xl overflow-hidden aspect-video relative bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                    {videoOn ? (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-2 glow-blue">
                          <span className="text-2xl font-bold text-primary-foreground">A</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Ankit Kumar</div>
                        {micOn && (
                          <div className="flex items-center justify-center gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-brand-green rounded-full"
                                animate={{ height: [`${8 + Math.random() * 16}px`, `${8 + Math.random() * 20}px`, `${8 + Math.random() * 12}px`] }}
                                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: "mirror" }}
                                style={{ height: "8px" }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <VideoOff className="w-8 h-8 text-muted-foreground" />
                    )}
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${micOn ? "bg-brand-green animate-pulse" : "bg-destructive"}`} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setMicOn(!micOn)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${micOn ? "bg-muted/40 text-foreground hover:bg-muted/60" : "bg-destructive/20 text-destructive"}`}
                    >
                      {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      {micOn ? "Mute" : "Unmute"}
                    </button>
                    <button
                      onClick={() => setVideoOn(!videoOn)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${videoOn ? "bg-muted/40 text-foreground hover:bg-muted/60" : "bg-destructive/20 text-destructive"}`}
                    >
                      {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      {videoOn ? "Video On" : "Video Off"}
                    </button>
                  </div>

                  <div className={`glass-card rounded-xl p-4 text-center ${timer <= 30 ? "border-destructive/50" : ""}`}>
                    <Clock className={`w-5 h-5 mx-auto mb-2 ${timer <= 30 ? "text-destructive" : "text-muted-foreground"}`} />
                    <motion.div
                      key={timer}
                      className={`font-display text-3xl font-bold ${timer <= 30 ? "text-destructive" : "gradient-text"}`}
                    >
                      {formatTime(timer)}
                    </motion.div>
                    <div className="text-xs text-muted-foreground mt-1">Time remaining</div>
                  </div>
                </div>

                {/* Question & Answer */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence mode="wait">
                    {loadingQuestion ? (
                      <motion.div
                        key="loading-q"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-4"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-8 h-8 text-primary" />
                        </motion.div>
                        <p className="text-muted-foreground font-medium">AI is crafting your question...</p>
                      </motion.div>
                    ) : currentQuestion ? (
                      <motion.div
                        key={`question-${currentQ}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="glass-card rounded-2xl p-6"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground font-medium">AI Interviewer · {selectedCompany}</span>
                              {currentQuestion.category && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{currentQuestion.category}</span>
                              )}
                            </div>
                            <p className="text-foreground font-medium leading-relaxed text-lg">{currentQuestion.question}</p>
                          </div>
                        </div>

                        {showFollowup && currentQuestion.followup && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20"
                          >
                            <div className="text-xs text-brand-cyan font-semibold mb-1">Follow-up question:</div>
                            <p className="text-sm text-foreground">{currentQuestion.followup}</p>
                          </motion.div>
                        )}

                        {showHint && currentQuestion.hint && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 p-3 rounded-lg bg-brand-gold/10 border border-brand-gold/20"
                          >
                            <div className="text-xs text-brand-gold font-semibold mb-1">💡 Hint:</div>
                            <p className="text-sm text-muted-foreground">{currentQuestion.hint}</p>
                          </motion.div>
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
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Answer area */}
                  <div className="glass-card rounded-2xl p-6">
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Your Answer</label>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here... Use the STAR method: Situation, Task, Action, Result"
                      className="w-full h-40 bg-muted/20 rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary/50 resize-none transition-colors"
                      disabled={loadingFeedback || loadingQuestion}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{currentAnswer.length} characters</span>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={submitAnswer}
                        disabled={!currentAnswer.trim() || loadingFeedback || loadingQuestion}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-blue"
                      >
                        {loadingFeedback ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            {currentQ + 1 >= totalQuestions ? "Finish Interview" : "Next Question"}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feedback Phase */}
          {phase === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 glow-blue"
                >
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h2 className="font-display text-3xl font-bold mb-2">Interview Complete! 🎉</h2>
                <p className="text-muted-foreground">Here's your detailed AI feedback</p>
              </div>

              {/* Score card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 mb-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="font-display text-6xl font-extrabold gradient-text mb-2"
                >
                  {avgScore}
                </motion.div>
                <div className="text-muted-foreground mb-4">Overall Performance Score</div>
                <div className="grid grid-cols-3 gap-4">
                  {feedbacks[0] && [
                    { label: "Avg Score", score: avgScore },
                    { label: "Best Answer", score: Math.max(...feedbacks.map((f) => f.score)) },
                    { label: "Consistency", score: Math.max(0, 100 - (Math.max(...feedbacks.map((f) => f.score)) - Math.min(...feedbacks.map((f) => f.score)))) },
                  ].map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className={`font-display text-2xl font-bold ${d.score >= 80 ? "text-brand-green" : "text-brand-gold"}`}>{d.score}</div>
                      <div className="text-xs text-muted-foreground">{d.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Q&A Feedback */}
              <div className="space-y-4 mb-6">
                {answers.map((answer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="glass-card rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-sm font-medium text-foreground flex-1">{questions[i]?.question}</p>
                      <div className={`text-lg font-bold font-display flex-shrink-0 ${feedbacks[i]?.score >= 80 ? "text-brand-green" : "text-brand-gold"}`}>
                        {feedbacks[i]?.score}/100
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3 mb-3 line-clamp-3">{answer}</p>

                    {feedbacks[i] && (
                      <>
                        <p className="text-sm text-foreground mb-3">{feedbacks[i].feedback}</p>

                        {feedbacks[i].strengths.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs font-semibold text-brand-green mb-1">✓ Strengths</div>
                            <ul className="space-y-0.5">
                              {feedbacks[i].strengths.map((s, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                  <CheckCircle className="w-3 h-3 text-brand-green mt-0.5 flex-shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedbacks[i].improvements.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-brand-gold mb-1">↑ Improve</div>
                            <ul className="space-y-0.5">
                              {feedbacks[i].improvements.map((s, j) => (
                                <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                  <AlertCircle className="w-3 h-3 text-brand-gold mt-0.5 flex-shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {feedbacks[i].modelAnswer && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="text-xs font-semibold text-primary mb-1">💡 Model Answer</div>
                            <p className="text-xs text-muted-foreground">{feedbacks[i].modelAnswer}</p>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-3"
              >
                <button
                  onClick={() => { setPhase("setup"); setCurrentQ(0); setAnswers([]); setFeedbacks([]); setQuestions([]); }}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
