import { type Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { emailService } from "../services/email.service.js";

export const inviteController = {
  async sendInvitation(req: AuthRequest, res: Response) {
    try {
      const { email, documentId, documentName } = req.body;

      // Validation des données
      if (!email || !documentId) {
        return res.status(400).json({
          error: "Email et ID du document sont requis",
        });
      }

      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Adresse email invalide",
        });
      }

      // Récupérer l'email de l'utilisateur qui envoie l'invitation (optionnel)
      // const inviterEmail = req.userId ? undefined : undefined; // On pourrait récupérer l'email depuis la DB si nécessaire
      const inviterEmail = undefined;

      // Envoyer l'email d'invitation
      await emailService.sendInvitationEmail(
        email,
        documentName || "Document",
        documentId,
        inviterEmail
      );

      res.status(200).json({
        message: "Invitation envoyée avec succès",
        recipient: email,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'invitation:", error);
      res.status(500).json({
        error: "Erreur lors de l'envoi de l'invitation",
      });
    }
  },

  async verifyEmailConfig(_req: AuthRequest, res: Response) {
    try {
      const isConfigured = await emailService.verifyConnection();

      if (isConfigured) {
        res.status(200).json({
          message: "Configuration email valide",
          configured: true,
        });
      } else {
        res.status(500).json({
          error: "Configuration email invalide",
          configured: false,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la configuration email:",
        error
      );
      res.status(500).json({
        error: "Erreur lors de la vérification de la configuration email",
        configured: false,
      });
    }
  },
};
