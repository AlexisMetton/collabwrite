import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

// Routes protégées
router.get('/me', authenticateToken, (req, res) => {
  authController.getCurrentUser(req as any, res);
});
router.post('/setup-2fa', authenticateToken, (req, res) => {
  authController.setup2FA(req as any, res);
});
router.post('/verify-2fa', authenticateToken, (req, res) => {
  authController.verify2FA(req as any, res);
});
router.post('/disable-2fa', authenticateToken, (req, res) => {
  authController.disable2FA(req as any, res);
});
router.put('/profile', authenticateToken, (req, res) => {
  authController.updateProfile(req as any, res);
});
router.put('/password', authenticateToken, (req, res) => {
  authController.updatePassword(req as any, res);
});

export default router;
