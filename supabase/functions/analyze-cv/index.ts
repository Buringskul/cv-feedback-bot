import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText } = await req.json();
    console.log('Analyzing CV, text length:', cvText?.length);

    if (!cvText) {
      throw new Error('No CV text provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert CV/resume analyzer. Analyze the provided CV and return a comprehensive evaluation.

Evaluate these key areas (score each 0-20):
1. Professional Summary/Objective (clarity, impact, tailoring)
2. Work Experience (relevance, quantifiable achievements, clarity)
3. Skills & Competencies (relevance, organization, technical vs soft skills)
4. Education & Certifications (relevance, presentation)
5. Format & Presentation (readability, structure, consistency, ATS-friendliness)

Provide:
- Overall score (0-100)
- Individual section scores
- Specific strengths (3-5 points)
- Areas for improvement (3-5 actionable suggestions)
- ATS optimization tips

Be constructive, specific, and actionable.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this CV:\n\n${cvText}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_cv",
              description: "Return detailed CV analysis with scores and feedback",
              parameters: {
                type: "object",
                properties: {
                  overall_score: {
                    type: "number",
                    description: "Overall CV score 0-100"
                  },
                  section_scores: {
                    type: "object",
                    properties: {
                      professional_summary: { type: "number", description: "Score 0-20" },
                      work_experience: { type: "number", description: "Score 0-20" },
                      skills: { type: "number", description: "Score 0-20" },
                      education: { type: "number", description: "Score 0-20" },
                      format: { type: "number", description: "Score 0-20" }
                    },
                    required: ["professional_summary", "work_experience", "skills", "education", "format"]
                  },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 specific strengths"
                  },
                  improvements: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 actionable improvement suggestions"
                  },
                  ats_tips: {
                    type: "array",
                    items: { type: "string" },
                    description: "ATS optimization recommendations"
                  }
                },
                required: ["overall_score", "section_scores", "strengths", "improvements", "ats_tips"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_cv" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error('No analysis data in response');
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log('Analysis completed, score:', analysis.overall_score);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-cv function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to analyze CV' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
