import { connectDB } from '@/lib/mongodb';
import { withAuth } from '@/lib/apiMiddleware';
import User from '@/models/User';

export const GET = withAuth(async function (request, context, jwtPayload) {
  try {
    await connectDB();
    const user = await User.findById(jwtPayload.userId).select('-password');
    if (!user || !user.isActive) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        memberNumber: user.memberNumber,
        role: user.role,
        membershipType: user.membershipType,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Me error:', err);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
});
