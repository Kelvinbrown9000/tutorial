import { connectDB } from '@/lib/mongodb';
import { withAuth } from '@/lib/apiMiddleware';
import ExternalTransfer from '@/models/ExternalTransfer';

export const GET = withAuth(async function (_req, _ctx, jwtPayload) {
  try {
    await connectDB();
    const transfers = await ExternalTransfer.find({ userId: jwtPayload.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('fromAccountId', 'accountNumber type')
      .lean();
    return Response.json({ transfers });
  } catch (err) {
    console.error('External transfers fetch error:', err);
    return Response.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
});
