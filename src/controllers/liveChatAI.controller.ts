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

// System prompt configuration
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

HufPe provides payment services.

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
// const SYSTEM_PROMPT: ChatCompletionMessageParam = {
//   role: "system",
//   content: `You are HufPe, a friendly airline assistant. Your role includes:
//   - Flight bookings and reservations
//   - Check-in procedures
//   - Baggage policies
//   - Flight status updates
//   - General travel queries

//   Guidelines:
//   1. Be concise but thorough
//   2. Maintain professional tone
//   3. Ask clarifying questions when needed
//   4. Never provide false information
//   5. Escalate complex issues`,
// };

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // replace with secure env in production
});

// Conversation history store (in-memory, consider Redis for production)
const conversationHistory = new Map<string, ChatCompletionMessageParam[]>();

export const LiveChatAIHandler = async (req: Request, res: Response) => {
  console.log("LiveChatAIHandler Before try req.body:", req.body);
  try {
    const { message }: ChatRequest = req.body;
    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { role: "user", content: `Respond briefly and precisely: ${message}` },
      ],
      // messages: [{ role: "user", content: message }],
      max_tokens: 50,
    });

    const response = await completion.then((result) => {
      setTimeout(() => {
        console.log(
          "completion.then((result)----------",
          result.choices[0].message
        );
        res.status(200).json({
          role: result.choices[0].message.role,
          content: result.choices[0].message.content,
          refusal: result.choices[0].message.refusal,
          annotations: result.choices[0].message.annotations,
        });

        // res.status(200).json(response);
      }, 1000); // 1000 ms = 1 second delay
    });

    // const response = completion.then((result) =>
    //   console.log("completion.then((result)", result.choices[0].message)
    // );
    // console.log("LiveChatAIHandler After try:", response);
    // res.status(200).json(response);
  } catch (error: any) {
    handleOpenAIError(error, res);
  }
};

// Helper functions

function sendErrorResponse(
  res: Response,
  status: number,
  error: string,
  details?: string
) {
  const response: ErrorResponse = { error };
  if (process.env.NODE_ENV === "development" && details) {
    response.details = details;
  }
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

// Optional: Add cleanup for conversation history
