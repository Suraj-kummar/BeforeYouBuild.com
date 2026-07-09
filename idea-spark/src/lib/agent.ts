import { createServerFn } from "@tanstack/react-start";

const AGENT_SYSTEM_PROMPT = `You are Spark — a sharp, friendly AI startup advisor on BeforeYouBuild.com.
Your job is to help founders quickly gut-check their startup ideas in a chat interface.

Guidelines:
- Keep answers SHORT and punchy (2-4 sentences max unless asked for more)
- Be direct and honest — don't sugarcoat bad ideas
- Use emojis sparingly but effectively
- If someone shares an idea, give a quick gut-check: what's promising, what's risky
- If someone asks a general question, answer it with startup/founder context
- Reference India's market when relevant (UPI, kirana, tier-2, etc.)
- If the idea needs deep analysis, nudge them to use the full validator
- Never say you're Claude or mention Anthropic — you're "Spark by BeforeYouBuild"
- Respond in a warm, confident tone like a smart friend who's been through YC`;

export type AgentMessage = {
  role: "user" | "assistant";
  content: string;
};

export const chatWithAgent = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: AgentMessage[] }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Return a helpful fallback if API key not configured
      return {
        reply:
          "Hey! I'm Spark 👋 — I'm not fully configured yet, but the main validator on this site is ready to go. Drop your idea in the box and get a full report in 60 seconds!",
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 512,
        system: AGENT_SYSTEM_PROMPT,
        // Only send messages — Anthropic requires the first message to be from "user"
        messages: data.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Agent API error:", response.status, errBody);
      throw new Error(`Agent API error ${response.status}: ${errBody}`);
    }

    const result = (await response.json()) as {
      content: Array<{ type: string; text?: string }>;
    };

    const text = result.content
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");

    return { reply: text };
  });
