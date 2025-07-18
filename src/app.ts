import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import resourcesRoutes from "./routes/resources.routes";
import chatRoutes from "./routes/chatUser.routes";
import chatLiveRoutes from "./routes/chatLive.routes";
import whatsAppRoutes from "./routes/whatsAppChat.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Configure CORS
console.log();
// const allowedOrigins = [
//   "http://localhost:3000/",
//   "https://hufpe.vercel.app/",
//   "https://hufpe-app-2l62y.ondigitalocean.app/",
// ];

// const corsOptions: CorsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//       console.log(error);
//     }
//   },
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

app.get("/", (req, res) => {
  res.send("Hello, Welcome to HufPe Services!");
});

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatLive", chatLiveRoutes);
app.use("/api/whatsApp", whatsAppRoutes);
app.use(errorHandler);

export default app;
