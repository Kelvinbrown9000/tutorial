import { connectDB } from '@/lib/mongodb';
import { withAuth } from '@/lib/apiMiddleware';
import Account from '@/models/Account';

export const GET = withAuth(async function (request, context, jwtPayload) {
  try {
    await connectDB();
    const accounts = await Account.find({
      userId: jwtPayload.userId,
      isActive: true,
    }).sort({ type: 1, createdAt: 1 });

    return Response.json({ accounts });
  } catch (err) {
    console.error('Accounts error:', err);
    return Response.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
});
