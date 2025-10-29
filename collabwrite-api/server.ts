import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import folderRoutes from "./src/routes/folder.routes.js";
import documentRoutes from "./src/routes/document.routes.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { adminService } from "./src/services/admin.service.js";

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
app.use('/api/folder', folderRoutes);
app.use('/api/document', documentRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// Middleware de gestion d'erreurs (doit être le dernier)
app.use(errorHandler);

app.listen(port, async () => {
    console.log(`API running on port ${port}`);
    
    // Initialiser l'utilisateur admin par défaut
    await adminService.createDefaultAdmin();
});