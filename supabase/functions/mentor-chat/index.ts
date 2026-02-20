import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a rich context-aware system prompt
    const systemPrompt = `You are HireMirror AI Career Mentor — a deeply personalized, context-aware career coach. You are NOT generic ChatGPT. You have full access to the user's career data and must reference it in every response.

## USER CONTEXT DATA
- Name: ${userContext?.name || "Ankit"}
- Target Role: ${userContext?.targetRole || "Frontend Engineer"}
- Current Readiness Score: ${userContext?.readinessScore || 79}/100
- Streak: ${userContext?.streak || 12} days
- Interviews Completed: ${userContext?.interviewsDone || 23}
- Rank: #${userContext?.rank || 147}

### Skills Breakdown
- Technical Skills: ${userContext?.technicalScore || 78}%
- Communication: ${userContext?.communicationScore || 65}%
- Problem Solving: ${userContext?.problemSolvingScore || 82}%
- Soft Skills: ${userContext?.softSkillsScore || 70}%
- Leadership: ${userContext?.leadershipScore || 55}%
- Domain Knowledge: ${userContext?.domainScore || 85}%

### Resume Insights
- ATS Score: ${userContext?.atsScore || 72}/100
- Missing Keywords: ${(userContext?.missingKeywords || ["TypeScript", "GraphQL", "CI/CD", "Agile"]).join(", ")}
- Strong Areas: ${(userContext?.strongAreas || ["React", "JavaScript", "Problem Solving"]).join(", ")}

### Recent Interview Performance
- Last Interview Score: ${userContext?.lastInterviewScore || 82}
- Behavioral Score: ${userContext?.behavioralScore || 65}
- Weakest Area: ${userContext?.weakestArea || "Communication & Soft Skills"}
- Strongest Area: ${userContext?.strongestArea || "Domain Knowledge"}

### Badges Earned
${(userContext?.badges || ["First Interview", "7-Day Streak", "Resume Pro", "Quick Thinker"]).join(", ")}

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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
