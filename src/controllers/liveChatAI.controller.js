"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveChatAIHandler = void 0;
const openai_1 = require("openai");
// System prompt configuration
const SYSTEM_PROMPTS = {
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
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY ||
        "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // replace with secure env in production
});
// Conversation history store (in-memory, consider Redis for production)
const conversationHistory = new Map();
const LiveChatAIHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("LiveChatAIHandler Before try req.body:", req.body);
    try {
        const { message } = req.body;
        const completion = openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { role: "user", content: `Respond briefly and precisely: ${message}` },
            ],
            // messages: [{ role: "user", content: message }],
            max_tokens: 50,
        });
        const response = yield completion.then((result) => {
            setTimeout(() => {
                console.log("completion.then((result)----------", result.choices[0].message);
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
    }
    catch (error) {
        handleOpenAIError(error, res);
    }
});
exports.LiveChatAIHandler = LiveChatAIHandler;
// Helper functions
function sendErrorResponse(res, status, error, details) {
    const response = { error };
    if (process.env.NODE_ENV === "development" && details) {
        response.details = details;
    }
    res.status(status).json(response);
}
function handleOpenAIError(error, res) {
    var _a, _b, _c;
    console.error("OpenAI Error:", {
        error: error.message,
        code: error.code,
        status: error.status,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    const statusCode = error.status || 500;
    const errorMessage = ((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) ||
        error.message ||
        "Failed to process chat request";
    sendErrorResponse(res, statusCode, errorMessage);
}
// Optional: Add cleanup for conversation history
