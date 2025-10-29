import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import authRoutes from "./src/routes/auth.routes.js";
import folderRoutes from "./src/routes/folder.routes.js";
import documentRoutes from "./src/routes/document.routes.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { adminService } from "./src/services/admin.service.js";
import inviteRoutes from "./src/routes/invite.routes.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 4000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/invite", inviteRoutes);
app.use('/api/document', documentRoutes);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
// Augmenter la limite de taille pour les fichiers images/PDFs en Data URL (50 MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

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
