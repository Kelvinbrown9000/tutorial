import { connectDB } from '@/lib/mongodb';
import {
  verifyRefreshToken,
  signAccessToken,
  getRefreshTokenFromRequest,
} from '@/lib/auth';
import User from '@/models/User';

export async function POST(request) {
  try {
    const refreshToken = getRefreshTokenFromRequest(request);
    if (!refreshToken) {
      return Response.json({ error: 'No refresh token' }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return Response.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return Response.json({ error: 'User not found or inactive' }, { status: 401 });
    }

    const newPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      memberNumber: user.memberNumber,
    };
    const newAccessToken = signAccessToken(newPayload);

    const IS_PROD = process.env.NODE_ENV === 'production';
    const cookieOpts = `; Path=/; HttpOnly; SameSite=Strict${IS_PROD ? '; Secure' : ''}`;
    const response = Response.json({ message: 'Token refreshed' }, { status: 200 });
    response.headers.append('Set-Cookie', `token=${newAccessToken}; Max-Age=900${cookieOpts}`);
    return response;
  } catch (err) {
    console.error('Refresh error:', err);
    return Response.json({ error: 'Token refresh failed' }, { status: 500 });
  }
}
