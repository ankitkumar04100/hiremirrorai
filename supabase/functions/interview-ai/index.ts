import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, role, company, question, answer, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userMessage = "";

    if (action === "generate_question") {
      systemPrompt = `You are a senior technical interviewer at ${company}. You are conducting a ${role} interview.
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
      userMessage = `Generate a ${role} interview question for ${company}. Previous questions in this session: ${JSON.stringify(conversationHistory || [])}. Make this question different and progressively challenging.`;
    } else if (action === "evaluate_answer") {
      systemPrompt = `You are a senior technical interviewer at ${company} evaluating a ${role} candidate.
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
      userMessage = `Question: "${question}"\n\nCandidate's Answer: "${answer}"\n\nEvaluate this answer for a ${role} position at ${company}.`;
    } else {
      throw new Error("Invalid action");
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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON response from AI — strip potential markdown code fences
    const cleaned = content.replace(/```json?\n?/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("interview-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
