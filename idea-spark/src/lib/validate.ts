import { createServerFn } from "@tanstack/react-start";

export type ValidationReport = {
  verdict: "HOT" | "CAUTION" | "DEAD";
  verdictReason: string;
  scores: {
    market: number;
    competition: number;
    timing: number;
    buildability: number;
  };
  problem: {
    description: string;
    whoFeelsIt: string;
    currentSolutions: string;
    paymentMoment: string;
  };
  idealCustomer: {
    profile: string;
    onlineHangouts: string;
    currentTools: string;
    whyCurrentSuck: string;
  };
  marketSize: {
    TAM: string;
    SAM: string;
    SOM: string;
    indiaContext: string;
  };
  competitors: Array<{
    name: string;
    weakness: string;
    threatLevel: "HIGH" | "MEDIUM" | "LOW";
  }>;
  mvpFeatures: string[];
  first100Users: string[];
  finalVerdict: {
    decision: "GO" | "NOGO";
    reasons: string[];
  };
};

const SYSTEM_PROMPT = `You are a YC-trained startup analyst for BeforeYouBuild.com. 
A founder has shared their startup idea. Research it thoroughly 
using web search and return a structured JSON report with these 
exact fields: 
- verdict: HOT or CAUTION or DEAD
- verdictReason: one sharp sentence why
- scores: { market: /10, competition: /10, timing: /10, buildability: /10 }
- problem: { description, whoFeelsIt, currentSolutions, paymentMoment }
- idealCustomer: { profile, onlineHangouts, currentTools, whyCurrentSuck }
- marketSize: { TAM, SAM, SOM, indiaContext }
- competitors: array of 3 { name, weakness, threatLevel }
- mvpFeatures: array of 3 features
- first100Users: array of 5 exact steps
- finalVerdict: { decision: GO or NOGO, reasons: array of 3 }
Be brutally honest. Use real web data. Give India-relevant 
context where applicable. Return ONLY valid JSON, no extra text.`;

export const validateIdea = createServerFn({ method: "POST" })
  .inputValidator((data: { idea: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 5,
          },
        ],
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Validate this startup idea and return ONLY a valid JSON object:\n\n${data.idea}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error ${response.status}: ${err}`);
    }

    const result = (await response.json()) as {
      content: Array<{ type: string; text?: string }>;
    };

    // Extract the final text block (after web search tool use)
    const textBlock = result.content
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");

    // Strip markdown code fences if present
    const jsonStr = textBlock
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();

    return JSON.parse(jsonStr) as ValidationReport;
  });
