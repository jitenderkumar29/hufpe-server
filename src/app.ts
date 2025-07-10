import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import resourcesRoutes from "./routes/resources.routes";
import chatRoutes from "./routes/chatUser.routes";
import chatLiveRoutes from "./routes/chatLive.routes";
import { errorHandler } from "./middlewares/error.middleware";
// import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
// 1. Apply CORS middleware FIRST
const corsOptions = {
  origin: "https://hufpe.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true, // if you need cookies/auth
  optionsSuccessStatus: 200, // legacy browsers choke on 204
};

// Configure CORS
app.use(cors(corsOptions));

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

console.log("🔍 AGENT_ENDPOINT:", process.env.AGENT_ENDPOINT);
console.log(
  "🔐 AGENT_ACCESS_KEY:",
  process.env.AGENT_ACCESS_KEY ? "Loaded" : "Missing"
);

// Default route
// app.use("/", (req, res) => {
//   res.json({
//     message: "Welcome to the API",
//     status: "running",
//     timestamp: new Date().toISOString(),
//   });
// });

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatLive", chatLiveRoutes);
app.use(errorHandler);

export default app;
