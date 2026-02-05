import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, keywords, tone, companyName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "overview") {
      systemPrompt = `You are a professional corporate copywriter. Write company overviews that are:
- Professional and ${tone || 'corporate'} in tone
- Clear and concise
- Factual without making false claims
- Between 100-200 words`;
      
      userPrompt = `Write a company overview for ${companyName || 'the company'} based on these keywords: ${keywords}. 
Write in a ${tone || 'corporate'} tone. Do not use placeholder text or make up specific numbers unless provided.`;
    } else if (type === "service") {
      systemPrompt = `You are a professional corporate copywriter. Write service descriptions that are:
- Professional and business-focused
- Clear about value proposition
- Between 50-100 words`;
      
      userPrompt = `Write a service description for "${keywords}" offered by ${companyName || 'the company'}. 
Be professional and avoid generic marketing language.`;
    } else if (type === "project") {
      systemPrompt = `You are a professional corporate copywriter. Write project scope descriptions that are:
- Professional and technical
- Clear about deliverables
- Between 50-100 words`;
      
      userPrompt = `Write a professional scope of work summary for a project called "${keywords}" by ${companyName || 'the company'}.`;
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
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-company-text error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
