import axios from "axios";
import { Request, Response, RequestHandler, NextFunction } from "express";

// Interfaces
interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
  apiVersion: string;
}

interface WhatsAppMessage {
  type: string;
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
  };
}

interface WebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          type: string;
          text?: { body: string };
        }>;
      };
    }>;
  }>;
}

// Config
const config: WhatsAppConfig = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  verifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "",
  apiVersion: "v22.0",
};
// const config: WhatsAppConfig = {
//   phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
//   accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
//   verifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
//   apiVersion: "v22.0",
// };

const whatsappApiUrl = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}`;

// Core message sending function
const sendMessage = async (
  to: string,
  message: WhatsAppMessage
): Promise<any> => {
  try {
    const response = await axios.post(
      `${whatsappApiUrl}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        ...message,
      },
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("WhatsApp API error:", err.response?.data || err.message);
    throw error;
  }
};

// Webhook verification handler
export const verifyWebhook: RequestHandler = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

// Webhook message handler
export const handleWebhook: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as WebhookPayload;
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      console.log(`Received message from ${from}:`, message);

      if (message.type === "text" && message.text?.body) {
        await sendTextMessage(from, `You said: ${message.text.body}`);
      }
    }

    res.sendStatus(200);
    return;
  } catch (error: unknown) {
    next(error);
    return;
  }
};

// Helper functions
export const sendTextMessage = (to: string, text: string): Promise<any> => {
  return sendMessage(to, {
    type: "text",
    text: { body: text },
  });
};

export const sendTemplateMessage = (
  to: string,
  templateName: string,
  languageCode = "en_US"
): Promise<any> => {
  return sendMessage(to, {
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
    },
  });
};

// Main WhatsApp handler
export const whatsAppChatAIHandler: RequestHandler = async (req, res, next) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      res.status(400).json({ error: "Phone and message are required" });
      return;
    }

    const result = await sendTextMessage(phone, message);
    res.json(result);
    return;
  } catch (error: unknown) {
    next(error);
    return;
  }
};

export default whatsAppChatAIHandler;
