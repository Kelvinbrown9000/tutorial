import { connectDB } from '@/lib/mongodb';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { withRateLimit, getClientIp } from '@/lib/apiMiddleware';
import { validate, registerSchema } from '@/lib/validators';
import { logAudit, logSecurity } from '@/lib/logger';
import User from '@/models/User';
import Account from '@/models/Account';

async function handler(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(registerSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { firstName, lastName, email, password, phone, membershipType, adminKey } = data;

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const role =
      adminKey && adminKey === process.env.ADMIN_REGISTRATION_KEY ? 'admin' : 'user';

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      membershipType,
      role,
    });

    // Auto-create checking + savings accounts
    await Account.create([
      { userId: user._id, type: 'checking' },
      { userId: user._id, type: 'savings' },
    ]);

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      memberNumber: user.memberNumber,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    logAudit({
      action: 'USER_REGISTERED',
      userId: user._id.toString(),
      ip: getClientIp(request),
      details: { email, role },
    });

    const responseData = {
      message: 'Registration successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        memberNumber: user.memberNumber,
        role: user.role,
      },
    };

    const response = Response.json(responseData, { status: 201 });
    return setAuthCookies(response, accessToken, refreshToken);
  } catch (err) {
    console.error('Register error:', err);
    return Response.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

export const POST = withRateLimit(handler, { limit: 10, windowMs: 60_000 });
