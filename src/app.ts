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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatLive", chatLiveRoutes);
app.use(errorHandler);

export default app;
