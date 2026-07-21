import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository';
import { authConfig } from '../config/auth';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../utils/errors';

export interface TokenPayload {
  userId: string;
  role: string;
  companyId: string | null;
  companyRoleId?: string | null;
  permissions?: string[];
}

export class AuthService {
  // Load permissions from user's company role
  private static async loadPermissions(userId: string, role: string, companyRoleId?: string | null): Promise<{ companyRoleId?: string | null; permissions?: string[] }> {
    if (role !== 'EMPLOYEE' || !companyRoleId) return {};
    try {
      const companyRole = await prisma.companyRole.findUnique({
        where: { id: companyRoleId },
        select: { permissions: true },
      });
      return { companyRoleId, permissions: (companyRole?.permissions as string[]) || [] };
    } catch {
      return { companyRoleId };
    }
  }

  // Build token payload with permissions
  private static async buildTokenPayload(userId: string, role: string, companyId: string | null, companyRoleId?: string | null): Promise<TokenPayload> {
    const base = { userId, role: role as any, companyId };
    if (role !== 'EMPLOYEE') return base;
    const extra = await this.loadPermissions(userId, role, companyRoleId);
    return { ...base, ...extra };
  }

  // Hash a plain text password
  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Generate Access and Refresh tokens
  public static generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      authConfig.jwtRefreshSecret,
      {
        expiresIn: authConfig.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
      }
    );

    return { accessToken, refreshToken };
  }

  // Register a new user (customer or company admin)
  public static async register(userData: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
    companyName?: string;
    companySlug?: string;
  }) {
    // 1. Check if user already exists
    const existingUser = await AuthRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    // 2. If registering as company admin, verify company slug is unique
    if (userData.role === 'COMPANY_ADMIN' && userData.companySlug) {
      const existingCompany = await prisma.company.findUnique({
        where: { slug: userData.companySlug.toLowerCase() },
      });
      if (existingCompany) {
        throw new ConflictError('This company slug/URL is already taken');
      }
    }

    // 3. Hash password if provided
    let passwordHash: string | undefined;
    if (userData.password) {
      passwordHash = await this.hashPassword(userData.password);
    }

    // 4. Create user (strip raw password, only pass hash)
    const { password: _rawPassword, ...cleanUserData } = userData;
    const newUser = await AuthRepository.createUser({
      ...cleanUserData,
      passwordHash,
    });

    // 5. Generate mock email verification token
    const verificationToken = jwt.sign(
      { userId: newUser.id },
      authConfig.jwtSecret,
      { expiresIn: '24h' }
    );
    // In production, we would send this token via email.
    // For now, we will log it for local debugging
    console.log(`[Email Verification Link]: http://localhost:5000/api/v1/auth/verify-email?token=${verificationToken}`);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Login a user
  public static async login(credentials: { email: string; password?: string }) {
    const user = await AuthRepository.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Google-only users might not have passwordHash set
    if (!user.passwordHash) {
      throw new BadRequestError('This account uses Google Login. Please sign in with Google');
    }

    if (credentials.password) {
      const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }
    } else {
      throw new BadRequestError('Password is required');
    }

    // Check if company is suspended
    if (user.company && !user.company.isActive) {
      throw new UnauthorizedError('Your company account has been suspended. Please contact support');
    }

    const payload = await this.buildTokenPayload(user.id, user.role, user.companyId, (user as any).companyRoleId);
    const tokens = this.generateTokens(payload);

    // Save refresh token to Redis for revocation support (optional key-value storage)
    await redis.setex(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    const { passwordHash: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, ...tokens };
  }

  // Refresh access token
  public static async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as { userId: string };
      
      // Verify token exists in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      const user = await AuthRepository.findById(decoded.userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const payload = await this.buildTokenPayload(user.id, user.role, user.companyId, (user as any).companyRoleId);
      const tokens = this.generateTokens(payload);
      
      // Update refresh token in Redis
      await redis.setex(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  // Logout a user
  public static async logout(userId: string) {
    await redis.del(`refresh_token:${userId}`);
    return { success: true };
  }

  // Google Login / OAuth Flow callback verification
  public static async googleLogin(googleUser: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }) {
    // 1. Check if user with googleId exists
    let user = await AuthRepository.findByGoogleId(googleUser.googleId);

    if (!user) {
      // 2. Check if email exists
      user = await AuthRepository.findByEmail(googleUser.email);

      if (user) {
        // Link Google ID to existing account
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.googleId, emailVerified: true },
          include: { company: true, companyRole: { select: { id: true, name: true, description: true, permissions: true } } },
        });
      } else {
        // Create new Customer account via Google
        user = await AuthRepository.createUser({
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          role: 'CUSTOMER',
          googleId: googleUser.googleId,
          emailVerified: true,
          avatar: googleUser.avatar,
        });
      }
    }

    if (!user) throw new Error('Failed to create or find user');

    const payload = await this.buildTokenPayload(user.id, user.role, user.companyId, (user as any).companyRoleId);
    const tokens = this.generateTokens(payload);
    await redis.setex(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    const { passwordHash: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, ...tokens };
  }

  // Trigger Forgot Password Flow
  public static async forgotPassword(email: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      // Return success to avoid user enumeration
      return { message: 'If this email exists, a password reset link has been sent.' };
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = jwt.sign({ userId: user.id }, authConfig.jwtSecret, {
      expiresIn: '1h',
    });

    // Store in Redis
    await redis.setex(`reset_token:${resetToken}`, 3600, user.id);

    console.log(`[Password Reset Link]: http://localhost:3000/reset-password?token=${resetToken}`);
    return { message: 'If this email exists, a password reset link has been sent.' };
  }

  // Reset password using token
  public static async resetPassword(token: string, newPasswordHash: string) {
    // 1. Verify token exists in Redis
    const userId = await redis.get(`reset_token:${token}`);
    if (!userId) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    // 2. Hash new password
    const hashed = await this.hashPassword(newPasswordHash);

    // 3. Update database
    await AuthRepository.updatePassword(userId, hashed);

    // 4. Revoke token
    await redis.del(`reset_token:${token}`);

    return { success: true };
  }

  // Update profile (name, email)
  public static async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; email?: string; currentPassword?: string; currentEmail?: string }
  ) {
    const user = await AuthRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    // If email is being changed, verify current password + old email
    if (data.email && data.email !== user.email) {
      if (!data.currentPassword || !data.currentEmail) {
        throw new BadRequestError('Current email and password are required to change your email');
      }
      if (data.currentEmail.toLowerCase() !== user.email.toLowerCase()) {
        throw new BadRequestError('Old email does not match our records');
      }
      if (!user.passwordHash || !(await bcrypt.compare(data.currentPassword, user.passwordHash))) {
        throw new UnauthorizedError('Current password is incorrect');
      }
      // Check if new email is already taken
      const existing = await AuthRepository.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new ConflictError('This email is already in use by another account');
      }
    }

    const updated = await AuthRepository.updateUser(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });

    const { passwordHash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  // Change password (requires current password verification)
  public static async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string }
  ) {
    const user = await AuthRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    if (!user.passwordHash) {
      throw new BadRequestError('This account uses Google Login. Set a password first.');
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const hashed = await this.hashPassword(data.newPassword);
    await AuthRepository.updatePassword(userId, hashed);
    return { success: true };
  }

  // Verify email using verification token
  public static async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as { userId: string };
      await AuthRepository.updateUserVerification(decoded.userId, true);
      return { success: true };
    } catch (error) {
      throw new BadRequestError('Invalid or expired email verification token');
    }
  }
}


