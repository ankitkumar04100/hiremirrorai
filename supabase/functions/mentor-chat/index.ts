import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const UserContextSchema = z.object({
  name: z.string().max(100).optional(),
  targetRole: z.string().max(100).optional(),
  readinessScore: z.number().min(0).max(100).optional(),
  streak: z.number().min(0).optional(),
  interviewsDone: z.number().min(0).optional(),
  rank: z.number().min(0).optional(),
  technicalScore: z.number().min(0).max(100).optional(),
  communicationScore: z.number().min(0).max(100).optional(),
  problemSolvingScore: z.number().min(0).max(100).optional(),
  softSkillsScore: z.number().min(0).max(100).optional(),
  leadershipScore: z.number().min(0).max(100).optional(),
  domainScore: z.number().min(0).max(100).optional(),
  atsScore: z.number().min(0).max(100).optional(),
  missingKeywords: z.array(z.string().max(50)).max(20).optional(),
  strongAreas: z.array(z.string().max(50)).max(20).optional(),
  lastInterviewScore: z.number().min(0).max(100).optional(),
  behavioralScore: z.number().min(0).max(100).optional(),
  weakestArea: z.string().max(200).optional(),
  strongestArea: z.string().max(200).optional(),
  badges: z.array(z.string().max(50)).max(50).optional(),
}).optional();

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  userContext: UserContextSchema,
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Limit request body size (100KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 100_000) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const validation = RequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Invalid request", details: validation.error.issues.map(i => i.message) }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, userContext } = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a rich context-aware system prompt
    const systemPrompt = `You are HireMirror AI Career Mentor — a deeply personalized, context-aware career coach. You are NOT generic ChatGPT. You have full access to the user's career data and must reference it in every response.

## USER CONTEXT DATA
- Name: ${userContext?.name || "User"}
- Target Role: ${userContext?.targetRole || "Software Engineer"}
- Current Readiness Score: ${userContext?.readinessScore ?? "N/A"}/100
- Streak: ${userContext?.streak ?? 0} days
- Interviews Completed: ${userContext?.interviewsDone ?? 0}
- Rank: #${userContext?.rank ?? "N/A"}

### Skills Breakdown
- Technical Skills: ${userContext?.technicalScore ?? "N/A"}%
- Communication: ${userContext?.communicationScore ?? "N/A"}%
- Problem Solving: ${userContext?.problemSolvingScore ?? "N/A"}%
- Soft Skills: ${userContext?.softSkillsScore ?? "N/A"}%
- Leadership: ${userContext?.leadershipScore ?? "N/A"}%
- Domain Knowledge: ${userContext?.domainScore ?? "N/A"}%

### Resume Insights
- ATS Score: ${userContext?.atsScore ?? "N/A"}/100
- Missing Keywords: ${(userContext?.missingKeywords || []).join(", ") || "N/A"}
- Strong Areas: ${(userContext?.strongAreas || []).join(", ") || "N/A"}

### Recent Interview Performance
- Last Interview Score: ${userContext?.lastInterviewScore ?? "N/A"}
- Behavioral Score: ${userContext?.behavioralScore ?? "N/A"}
- Weakest Area: ${userContext?.weakestArea || "N/A"}
- Strongest Area: ${userContext?.strongestArea || "N/A"}

### Badges Earned
${(userContext?.badges || []).join(", ") || "None yet"}

## YOUR BEHAVIOR RULES
1. ALWAYS reference the user's actual data in your responses — never give generic advice.
2. Be encouraging but HONEST. If a score is low, say so and explain why.
3. Use markdown formatting: headers, bullet points, bold, code blocks when relevant.
4. When asked about resume: reference their ATS score, missing keywords, and strong areas.
5. When asked about interview performance: cite specific scores and areas.
6. When generating plans: make them specific to their weak areas and target role.
7. Provide actionable, concrete steps — not vague platitudes.
8. Use the STAR method when coaching behavioral answers.
9. Celebrate improvements and milestones.
10. Keep responses focused and under 400 words unless a detailed plan is requested.

## RESPONSE FORMAT
When giving structured advice, use this format:
**📊 Analysis** — What the data shows
**⚠️ Key Gap** — The most critical weakness
**✅ Action Steps** — 3-5 concrete actions
**💡 Pro Tip** — One insider insight`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("mentor-chat error:", e);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
