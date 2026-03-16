import { connectDB } from '@/lib/mongodb';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { withRateLimit, getClientIp } from '@/lib/apiMiddleware';
import { validate, loginSchema } from '@/lib/validators';
import { logAudit, logSecurity } from '@/lib/logger';
import User from '@/models/User';

async function handler(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(loginSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { identifier, password } = data;
    const ip = getClientIp(request);

    // Find by email or member number
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { memberNumber: identifier.toUpperCase() },
      ],
    }).select('+password');

    if (!user) {
      logSecurity({ action: 'LOGIN_FAILED_USER_NOT_FOUND', identifier, ip });
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return Response.json({ error: 'Account is disabled. Please contact support.' }, { status: 403 });
    }

    // Check account lock
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const secondsRemaining = Math.ceil((user.lockedUntil - Date.now()) / 1000);
      logSecurity({ action: 'LOGIN_ATTEMPT_LOCKED', userId: user._id.toString(), ip });
      return Response.json(
        {
          error: `Account temporarily locked. Try again in ${Math.ceil(secondsRemaining / 60)} minute(s).`,
          lockedUntil: user.lockedUntil,
        },
        { status: 423 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        logSecurity({ action: 'ACCOUNT_LOCKED', userId: user._id.toString(), ip, attempts: user.failedLoginAttempts });
      }
      await user.save({ validateBeforeSave: false });
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      memberNumber: user.memberNumber,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    logAudit({ action: 'USER_LOGIN', userId: user._id.toString(), ip });

    const responseData = {
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        memberNumber: user.memberNumber,
        role: user.role,
      },
    };

    const response = Response.json(responseData, { status: 200 });
    return setAuthCookies(response, accessToken, refreshToken);
  } catch (err) {
    console.error('Login error:', err);
    return Response.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, { limit: 5, windowMs: 15 * 60 * 1000 });
