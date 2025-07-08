import { Request, Response, NextFunction, RequestHandler } from "express";

const LiveChatDOAIHandler: RequestHandler = async (req, res, next) => {
  try {
    const AGENT_ENDPOINT = process.env.AGENT_ENDPOINT;
    const AGENT_ACCESS_KEY = process.env.AGENT_ACCESS_KEY;

    if (!AGENT_ENDPOINT || !AGENT_ACCESS_KEY) {
      console.error("Missing env vars");
      res.status(500).json({ message: "Server misconfiguration" });
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({
        message: "Method not allowed",
        allowedMethods: ["POST"],
      });
      return;
    }

    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        message:
          "Invalid or missing 'messages'. Expected an array of messages.",
      });
      return;
    }

    const payload = {
      model: "gpt-4o-mini",
      messages,
      stream: false,
      include_functions_info: false,
      include_retrieval_info: false,
      include_guardrails_info: false,
    };

    const response = await fetch(`${AGENT_ENDPOINT}/api/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGENT_ACCESS_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Agent request failed:", {
        status: response.status,
        error: responseData,
      });
      res.status(response.status).json({
        message: "Agent request failed",
        error: responseData,
      });
      return;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Unexpected error:", error);
    next(error); // Pass to Express error handler
  }
};

export default LiveChatDOAIHandler;
