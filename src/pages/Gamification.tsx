import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Trophy, Flame, Star, Award, Target, Zap, Users, TrendingUp, Crown, Medal, Gift } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const allBadges = [
  { id: 1, name: "First Steps", icon: "🚀", desc: "Completed your first mock interview", earned: true, rarity: "Common", points: 50 },
  { id: 2, name: "7-Day Streak", icon: "🔥", desc: "Practiced 7 days in a row", earned: true, rarity: "Uncommon", points: 100 },
  { id: 3, name: "Resume Pro", icon: "📄", desc: "Resume scored 80+ on ATS check", earned: true, rarity: "Common", points: 75 },
  { id: 4, name: "Quick Thinker", icon: "⚡", desc: "Answered 10 rapid-fire questions", earned: true, rarity: "Uncommon", points: 120 },
  { id: 5, name: "Top Scorer", icon: "🎯", desc: "Scored 90+ in a mock interview", earned: false, rarity: "Rare", points: 200 },
  { id: 6, name: "Communication Star", icon: "⭐", desc: "Achieved 90+ communication score", earned: false, rarity: "Rare", points: 200 },
  { id: 7, name: "Technical Wizard", icon: "🧙", desc: "Aced 5 technical interviews", earned: false, rarity: "Epic", points: 500 },
  { id: 8, name: "30-Day Champion", icon: "🏆", desc: "Completed 30-day streak", earned: false, rarity: "Legendary", points: 1000 },
  { id: 9, name: "Speed Runner", icon: "💨", desc: "Finished 3 interviews in one day", earned: false, rarity: "Rare", points: 150 },
  { id: 10, name: "Skill Master", icon: "🎓", desc: "Reached 90+ on all skill categories", earned: false, rarity: "Legendary", points: 800 },
  { id: 11, name: "Feedback Seeker", icon: "📊", desc: "Reviewed feedback for 20 interviews", earned: false, rarity: "Uncommon", points: 100 },
  { id: 12, name: "LinkedIn Pro", icon: "💼", desc: "LinkedIn audit score 85+", earned: false, rarity: "Common", points: 75 },
];

const leaderboard = [
  { rank: 1, name: "Rahul Verma", score: 94, interviews: 45, badge: "🏆", change: 0 },
  { rank: 2, name: "Priya Sharma", score: 92, interviews: 38, badge: "🥈", change: 1 },
  { rank: 3, name: "Aditya Kumar", score: 89, interviews: 52, badge: "🥉", change: -1 },
  { rank: 4, name: "Sanya Patel", score: 87, interviews: 31, badge: "⭐", change: 2 },
  { rank: 5, name: "Marcus Chen", score: 85, interviews: 29, badge: "⭐", change: -1 },
  { rank: 147, name: "You (Ankit)", score: 79, interviews: 23, badge: "🎯", change: 23, isMe: true },
];

const weeklyData = [
  { day: "Mon", points: 120, interviews: 2 },
  { day: "Tue", points: 80, interviews: 1 },
  { day: "Wed", points: 200, interviews: 3 },
  { day: "Thu", points: 150, interviews: 2 },
  { day: "Fri", points: 180, interviews: 2 },
  { day: "Sat", points: 90, interviews: 1 },
  { day: "Sun", points: 220, interviews: 3 },
];

const rarityColors = {
  Common: "text-muted-foreground border-muted-foreground/30 bg-muted/20",
  Uncommon: "text-brand-green border-brand-green/30 bg-brand-green/10",
  Rare: "text-primary border-primary/30 bg-primary/10",
  Epic: "text-brand-purple border-brand-purple/30 bg-brand-purple/10",
  Legendary: "text-brand-gold border-brand-gold/30 bg-brand-gold/10",
};

export default function Gamification() {
  const [activeTab, setActiveTab] = useState<"badges" | "leaderboard" | "points">("badges");
  const totalPoints = 345;
  const nextMilestone = 500;
  const earnedBadges = allBadges.filter((b) => b.earned);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-4">
            <Trophy className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-xs font-semibold text-brand-gold">Achievements · Leaderboard · Points</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">
            Your <span className="gradient-text-gold">Achievements</span> & Ranking
          </h1>
          <p className="text-muted-foreground text-lg">Compete, earn badges, and track your journey to the top</p>
        </div>

        {/* Profile card */}
        <div className="glass-card rounded-2xl p-6 mb-6 gradient-border">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground glow-blue">
                A
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center text-sm glow-gold">
                🎯
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold text-foreground">Ankit Kumar</h2>
              <p className="text-muted-foreground text-sm mb-3">Frontend Engineer · Level 8</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-semibold text-brand-gold">12-Day Streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-brand-cyan" />
                  <span className="text-sm font-semibold text-brand-cyan">Rank #147</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-purple" />
                  <span className="text-sm font-semibold text-brand-purple">{earnedBadges.length}/{allBadges.length} Badges</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-4xl font-extrabold gradient-text-gold">{totalPoints}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
              <div className="mt-2 text-xs text-brand-gold">{nextMilestone - totalPoints} to next milestone</div>
              <div className="mt-2 h-2 rounded-full bg-muted w-32">
                <div className="h-full rounded-full bg-gradient-gold" style={{ width: `${(totalPoints / nextMilestone) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "badges", label: "Badges", icon: Award },
            { id: "leaderboard", label: "Leaderboard", icon: Crown },
            { id: "points", label: "Points History", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-primary text-primary-foreground glow-blue"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        {activeTab === "badges" && (
          <div className="fade-in-up">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`glass-card rounded-2xl p-5 text-center transition-all hover:-translate-y-1 ${
                    badge.earned ? "" : "opacity-40 grayscale"
                  }`}
                >
                  <div className={`text-4xl mb-3 ${badge.earned ? "" : "filter blur-[2px]"}`}>{badge.icon}</div>
                  <div className="font-display font-bold text-sm text-foreground mb-1">{badge.name}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full border inline-block mb-2 ${rarityColors[badge.rarity as keyof typeof rarityColors]}`}>
                    {badge.rarity}
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">{badge.desc}</div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-brand-gold">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-semibold">{badge.points} pts</span>
                  </div>
                  {badge.earned && (
                    <div className="mt-2 text-xs text-brand-green font-semibold">✓ Earned</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="fade-in-up">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Crown className="w-4 h-4 text-brand-gold" />
                <span className="font-display font-bold text-foreground">Global Ranking</span>
                <span className="text-xs text-muted-foreground ml-auto">50,247 candidates</span>
              </div>
              <div className="divide-y divide-border">
                {leaderboard.map((user, i) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 p-4 transition-colors ${
                      user.isMe ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/20"
                    }`}
                  >
                    <div className={`font-display text-lg font-bold w-8 text-center ${
                      user.rank === 1 ? "text-brand-gold" :
                      user.rank === 2 ? "text-muted-foreground" :
                      user.rank === 3 ? "text-brand-gold/70" : "text-muted-foreground"
                    }`}>
                      {user.rank <= 3 ? user.badge : `#${user.rank}`}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${user.isMe ? "text-primary" : "text-foreground"}`}>
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{user.interviews} interviews completed</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-display text-lg font-bold ${user.score >= 90 ? "text-brand-green" : user.score >= 80 ? "text-primary" : "text-brand-gold"}`}>
                        {user.score}
                      </div>
                      <div className={`text-xs font-medium ${user.change > 0 ? "text-brand-green" : user.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {user.change > 0 ? `↑${user.change}` : user.change < 0 ? `↓${Math.abs(user.change)}` : "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {leaderboard.length > 5 && (
              <div className="mt-3 text-center">
                <div className="text-muted-foreground text-sm">· · · 141 spots above you · · ·</div>
              </div>
            )}
          </div>
        )}

        {/* Points History */}
        {activeTab === "points" && (
          <div className="fade-in-up space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-foreground mb-4">Weekly Points Earned</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 12%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(220 25% 7%)", border: "1px solid hsl(220 20% 14%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
                  <Bar dataKey="points" fill="hsl(45 100% 58%)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <Gift className="w-4 h-4 text-brand-cyan" /> Points Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { activity: "Completed Mock Interview (Hard)", points: "+120", time: "2 hrs ago", icon: "🎯" },
                  { activity: "7-Day Streak Bonus", points: "+100", time: "1 day ago", icon: "🔥" },
                  { activity: "Resume uploaded & analyzed", points: "+50", time: "2 days ago", icon: "📄" },
                  { activity: "Completed Skills Assessment", points: "+75", time: "3 days ago", icon: "⭐" },
                  { activity: "Mock Interview (Medium)", points: "+80", time: "4 days ago", icon: "🎤" },
                ].map((item) => (
                  <div key={item.activity} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{item.activity}</div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                    <span className="text-brand-green font-bold text-sm">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
