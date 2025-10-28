import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// Middleware de gestion d'erreurs (doit être le dernier)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});