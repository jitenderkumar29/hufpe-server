import { Request, Response } from "express";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";

// Type definitions
interface ChatRequest {
  message: string;
  conversationId?: string;
}

interface ChatResponse {
  reply: string;
  conversationId?: string;
  tokensUsed?: number;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const SYSTEM_PROMPTS: Record<string, ChatCompletionMessageParam> = {
  support: {
    role: "system",
    content: `You are HufPe Support AI for https://hufpe.vercel.app/. Only answer questions strictly related to HufPe services. Politely decline any off-topic queries.

Your support areas include:
- Account issues
- Booking help (flights, hotels, cabs, etc.)
- Bill payment errors
- Refunds, cancellations
- General site help

Guidelines:
- Keep answers short and clear (max 2–3 lines)
- Never answer anything outside HufPe
- If question is unrelated, say: "I'm here to assist with HufPe services only."`,
  },
  b2b: {
    role: "system",
    content: `You are HufPe B2B Assistant for https://hufpe.vercel.app/. Only answer queries about:
- HufPe B2B services
- Channel partnerships
- Commission models
- Business tools

Guidelines:
- Stay focused on HufPe's B2B offerings
- For unrelated queries, say: "I can only help with HufPe's business solutions."
- Keep replies short, helpful, and professional`,
  },
  travel: {
    role: "system",
    content: `You are HufPe Travel Assistant. You help users book on https://hufpe.vercel.app/:
- Flights
- Hotels
- Buses, Trains
- Holidays, Cabs, Movies

Guidelines:
- Be concise and friendly
- Decline non-travel questions: "I’m here to help with HufPe travel services only."
- Replies should not exceed 2–3 lines.`,
  },
  recharge: {
    role: "system",
    content: `You are HufPe Recharge Assistant. Only assist users with:
- Mobile, DTH, broadband, electricity bill payments
- Plan selection and transaction help

Guidelines:
- Don’t answer off-topic queries. Say: "I can assist with HufPe recharge & bill services only."
- Be very concise. Max 2–3 lines per response.`,
  },
};

// System prompt variants based on intent
// const SYSTEM_PROMPTS: Record<string, ChatCompletionMessageParam> = {
//   support: {
//     role: "system",
//     content: `You are HufPe Support, a helpful customer service AI assistant for https://hufpe.vercel.app/. You assist users with queries related to:

// - Account and login issues
// - Booking problems (flight, hotel, cab, etc.)
// - Payment failures or delays
// - Refunds and cancellations
// - Recharge or bill issues
// - Partner registration and support
// - General FAQs and navigation help

// Guidelines:
// 1. Be empathetic, professional, and to-the-point
// 2. Ask follow-up questions to clarify user concerns
// 3. Do not make assumptions—stick to known information
// 4. Escalate unresolved or sensitive issues
// 5. Provide step-by-step guidance where possible`,
//   },
//   b2b: {
//     role: "system",
//     content: `You are HufPe Assistant, guiding business owners and B2B partners on using https://hufpe.vercel.app/. Your goal is to support:

// - B2B Services overview and onboarding
// - Channel partner registration
// - Explaining HufPe for Business tools and benefits
// - Commission models, support, and FAQs
// - How to grow with HufPe platform features

// Guidelines:
// 1. Maintain a business-professional tone
// 2. Use concise, value-driven responses
// 3. Help with forms, registration steps, and policies
// 4. Escalate high-value partner queries
// 5. Avoid technical jargon unless user indicates familiarity`,
//   },
//   travel: {
//     role: "system",
//     content: `You are HufPe Travel Assistant, helping users plan and manage their trips via https://hufpe.vercel.app/. Your responsibilities include:

// - Booking flights, hotels, cabs, buses, trains, holidays, and movies
// - Checking availability, fares, and timings
// - Assisting with booking changes or cancellations
// - Offering destination or package suggestions

// Guidelines:
// 1. Be friendly, energetic, and travel-savvy
// 2. Make suggestions based on travel type or intent
// 3. Clarify dates, number of travelers, and preferences
// 4. Never provide fake availability—stick to logic
// 5. Guide users through booking steps if needed`,
//   },
//   recharge: {
//     role: "system",
//     content: `You are HufPe Recharge Assistant, helping users complete mobile, DTH, broadband, electricity, and other bill payments on https://hufpe.vercel.app/. Your tasks include:

// - Explaining how to recharge or pay bills
// - Helping users select operators and plans
// - Assisting with failed transactions or confirmation delays
// - Informing users about discounts, cashback, and offers

// Guidelines:
// 1. Be clear and reassuring
// 2. Ask for operator, number, and amount if needed
// 3. Confirm status of transactions when applicable
// 4. Do not promise refunds—guide users to support
// 5. Suggest best recharge plans or bill categories`,
//   },
// };

// Detect user intent
function detectIntent(message: string): keyof typeof SYSTEM_PROMPTS {
  const lower = message.toLowerCase();

  if (
    lower.includes("refund") ||
    lower.includes("support") ||
    lower.includes("cancel") ||
    lower.includes("problem") ||
    lower.includes("help")
  )
    return "support";

  if (
    lower.includes("b2b") ||
    lower.includes("partner") ||
    lower.includes("commission") ||
    lower.includes("business")
  )
    return "b2b";

  if (
    lower.includes("flight") ||
    lower.includes("hotel") ||
    lower.includes("cab") ||
    lower.includes("train") ||
    lower.includes("bus") ||
    lower.includes("movie") ||
    lower.includes("holiday") ||
    lower.includes("book")
  )
    return "travel";

  if (
    lower.includes("recharge") ||
    lower.includes("bill") ||
    lower.includes("mobile") ||
    lower.includes("dth") ||
    lower.includes("electricity") ||
    lower.includes("broadband")
  )
    return "recharge";

  return "support"; // fallback
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // replace with secure env in production
  timeout: 10000,
  maxRetries: 2,
});

// In-memory conversation storage
const conversationHistory = new Map<string, ChatCompletionMessageParam[]>();

export const LiveChatAIHandler2 = async (req: Request, res: Response) => {
  try {
    const { message, conversationId }: ChatRequest = req.body;

    if (!message || typeof message !== "string") {
      return sendErrorResponse(
        res,
        400,
        "Message is required and must be a string"
      );
    }
    if (message.length > 1000) {
      return sendErrorResponse(
        res,
        400,
        "Message exceeds 1000 character limit"
      );
    }

    const messages = getConversationHistory(conversationId);
    messages.push({ role: "user", content: message });

    // Choose prompt based on user intent
    const intent = detectIntent(message);
    const systemPrompt = SYSTEM_PROMPTS[intent];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I couldn't generate a response. Please try again.";

    // Update conversation
    messages.push({ role: "assistant", content: reply });
    const currentConversationId = conversationId || generateConversationId();
    if (conversationHistory.size > 1000) conversationHistory.clear();
    conversationHistory.set(currentConversationId, messages);

    const response: ChatResponse = {
      reply,
      conversationId: currentConversationId,
      tokensUsed: completion.usage?.total_tokens,
    };

    logInteraction({
      conversationId: currentConversationId,
      userMessage: message,
      aiResponse: reply,
      tokensUsed: completion.usage?.total_tokens,
      ip: req.ip,
    });

    res.status(200).json(response);
  } catch (error: any) {
    handleOpenAIError(error, res);
  }
};

// Utilities
function getConversationHistory(
  conversationId?: string
): ChatCompletionMessageParam[] {
  if (!conversationId) return [];
  return conversationHistory.get(conversationId)?.slice(-10) || [];
}

function generateConversationId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function logInteraction(data: {
  conversationId: string;
  userMessage: string;
  aiResponse: string;
  tokensUsed?: number;
  ip?: string;
}) {
  console.log("Chat Interaction:", {
    conversationId: data.conversationId,
    userMessage:
      data.userMessage.substring(0, 50) +
      (data.userMessage.length > 50 ? "..." : ""),
    aiResponse:
      data.aiResponse.substring(0, 100) +
      (data.aiResponse.length > 100 ? "..." : ""),
    tokensUsed: data.tokensUsed,
    ip: data.ip,
    timestamp: new Date().toISOString(),
  });
}

function sendErrorResponse(
  res: Response,
  status: number,
  error: string,
  details?: string
) {
  const response: ErrorResponse = { error };
  if (process.env.NODE_ENV === "development" && details)
    response.details = details;
  res.status(status).json(response);
}

function handleOpenAIError(error: any, res: Response) {
  console.error("OpenAI Error:", {
    error: error.message,
    code: error.code,
    status: error.status,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });

  const statusCode = error.status || 500;
  const errorMessage =
    error.response?.data?.error?.message ||
    error.message ||
    "Failed to process chat request";

  sendErrorResponse(res, statusCode, errorMessage);
}

// Clean old conversation memory every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  conversationHistory.forEach((_, key) => {
    if (parseInt(key, 36) < oneHourAgo) {
      conversationHistory.delete(key);
    }
  });
}, 3600000);
