import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a customer or company admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               role: { type: string, enum: [COMPANY_ADMIN, CUSTOMER] }
 *               companyName: { type: string }
 *               companySlug: { type: string }
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and return JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token using Refresh Token cookie or body
 *     tags: [Auth]
 */
router.post('/refresh-token', AuthController.refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out user and revoke refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get currently authenticated user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authMiddleware, AuthController.getMe);
router.patch('/me', authMiddleware, AuthController.updateProfile);
router.patch('/me/password', authMiddleware, AuthController.changePassword);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Trigger Google OAuth login flow redirection
 *     tags: [Auth]
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback route
 *     tags: [Auth]
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  AuthController.googleCallback
);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 */
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password using verification token
 *     tags: [Auth]
 */
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify email using verification link token
 *     tags: [Auth]
 */
router.get('/verify-email', AuthController.verifyEmail);

export default router;


