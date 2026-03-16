import { connectDB } from '@/lib/mongodb';
import { withAuth } from '@/lib/apiMiddleware';
import Account from '@/models/Account';

export const GET = withAuth(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    await connectDB();

    const account = await Account.findOne({ _id: id, userId: jwtPayload.userId, isActive: true });
    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    return Response.json({ account });
  } catch (err) {
    console.error('Account detail error:', err);
    return Response.json({ error: 'Failed to fetch account' }, { status: 500 });
  }
});

export const PATCH = withAuth(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const account = await Account.findOne({ _id: id, userId: jwtPayload.userId });
    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    if (body.nickname !== undefined) {
      account.nickname = body.nickname?.slice(0, 50) || '';
      await account.save();
    }

    return Response.json({ account, message: 'Account updated' });
  } catch (err) {
    console.error('Account patch error:', err);
    return Response.json({ error: 'Failed to update account' }, { status: 500 });
  }
});
