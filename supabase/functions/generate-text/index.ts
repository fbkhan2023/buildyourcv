import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, keywords, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "experience") {
      systemPrompt = `You are a professional resume writer. Generate a concise, impactful work experience description based on the keywords and context provided. 
      The description should:
      - Be 2-3 sentences long
      - Use action verbs
      - Be specific and results-oriented
      - Sound professional and confident
      Only respond with the description text, no additional formatting or explanation.`;
      
      userPrompt = `Generate a work experience description for the following:
      Position: ${context?.position || 'Not specified'}
      Company: ${context?.company || 'Not specified'}
      Keywords/Responsibilities: ${keywords}`;
    } else if (type === "summary") {
      systemPrompt = `You are a professional resume writer. Generate a compelling professional summary based on the keywords and context provided.
      The summary should:
      - Be 3-4 sentences long
      - Highlight key skills and experience
      - Be tailored to the desired job role
      - Sound confident and professional
      Only respond with the summary text, no additional formatting or explanation.`;
      
      userPrompt = `Generate a professional summary for someone with the following:
      Desired Job: ${context?.desiredJob || 'Not specified'}
      Keywords/Skills: ${keywords}
      Experience highlights: ${context?.experience || 'Not specified'}`;
    } else {
      throw new Error("Invalid type specified");
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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ text: generatedText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating text:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
