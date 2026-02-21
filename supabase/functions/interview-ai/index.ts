import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GenerateQuestionSchema = z.object({
  action: z.literal("generate_question"),
  role: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  conversationHistory: z.array(z.string().max(500)).max(20).optional(),
});

const EvaluateAnswerSchema = z.object({
  action: z.literal("evaluate_answer"),
  role: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  question: z.string().min(1).max(2000),
  answer: z.string().min(1).max(5000),
});

const RequestSchema = z.discriminatedUnion("action", [
  GenerateQuestionSchema,
  EvaluateAnswerSchema,
]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Limit request body size (50KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 50_000) {
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

    const data = validation.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userMessage = "";

    if (data.action === "generate_question") {
      systemPrompt = `You are a senior technical interviewer at ${data.company}. You are conducting a ${data.role} interview.
Generate ONE focused, realistic interview question appropriate for this role and company culture.
The question should test genuine skills and be specific — not generic.
Return ONLY a JSON object with this exact shape:
{
  "question": "The interview question text",
  "hint": "A brief 1-sentence hint to guide the candidate",
  "followup": "A natural follow-up question to ask after their answer",
  "category": "one of: Technical | Behavioral | System Design | Problem Solving | Communication"
}
Do not include any markdown, explanation, or extra text. Return pure JSON only.`;
      userMessage = `Generate a ${data.role} interview question for ${data.company}. Previous questions in this session: ${JSON.stringify(data.conversationHistory || [])}. Make this question different and progressively challenging.`;
    } else {
      systemPrompt = `You are a senior technical interviewer at ${data.company} evaluating a ${data.role} candidate.
Provide honest, constructive, and detailed feedback on the candidate's answer.
Return ONLY a JSON object with this exact shape:
{
  "score": <integer 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "feedback": "2-3 sentence detailed feedback paragraph",
  "modelAnswer": "A brief model answer or key points that should have been mentioned"
}
Be encouraging but honest. Score strictly: 90+ is excellent, 75-89 is good, 60-74 is average, below 60 needs significant improvement.
Do not include any markdown, explanation, or extra text. Return pure JSON only.`;
      userMessage = `Question: "${data.question}"\n\nCandidate's Answer: "${data.answer}"\n\nEvaluate this answer for a ${data.role} position at ${data.company}.`;
    }

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
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse the JSON response from AI — strip potential markdown code fences
    const cleaned = content.replace(/```json?\n?/gi, "").replace(/```/g, "").trim();
    
    if (!cleaned) {
      throw new Error("AI returned empty response");
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("AI response was not valid JSON");
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("interview-ai error:", e);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
