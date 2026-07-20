import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { redis } from '../config/redis';

export class AuthController {
  // Register a new user
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Verification email sent.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login a user
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(req.body);

      // Set Refresh Token in secure HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          status: 'error',
          message: 'Refresh token is missing',
        });
      }

      const tokens = await AuthService.refresh(refreshToken);

      // Update Cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 'success',
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout a user
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (userId) {
        await AuthService.logout(userId);
      }

      res.clearCookie('refreshToken');
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Google OAuth Success Callback
  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
      }

      const userProfile = await AuthRepository.findById(req.user.userId);
      if (!userProfile) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=user_not_found`);
      }

      const payload = {
        userId: userProfile.id,
        role: userProfile.role,
        companyId: userProfile.companyId,
      };
      const { accessToken, refreshToken } = AuthService.generateTokens(payload);

      // Set cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Save refresh token to Redis
      redis.setex(`refresh_token:${userProfile.id}`, 7 * 24 * 60 * 60, refreshToken).catch(() => {});

      // Redirect back to frontend with short-lived access token
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-callback?token=${accessToken}`
      );
    } catch (error) {
      next(error);
    }
  }

  // Forgot password
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(req.body.token, req.body.password);
      res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify email
  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      await AuthService.verifyEmail(token);
      res.status(200).json({
        status: 'success',
        message: 'Email verified successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Not authenticated' });
      }

      const userProfile = await AuthRepository.findById(userId);

      if (!userProfile) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      const { passwordHash: _, ...userWithoutPassword } = userProfile;
      res.status(200).json({
        status: 'success',
        data: { user: userWithoutPassword },
      });
    } catch (error) {
      next(error);
    }
  }
}


