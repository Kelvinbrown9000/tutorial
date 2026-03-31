import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import ExternalTransfer from '@/models/ExternalTransfer';

// GET /api/admin/external-transfers?status=pending
export const GET = withAdmin(async function (request) {
  try {
    await connectDB();
    const status = request.nextUrl.searchParams.get('status') || 'pending';
    const query = status === 'all' ? {} : { status };

    const transfers = await ExternalTransfer.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'firstName lastName email memberNumber')
      .populate('fromAccountId', 'accountNumber type balance')
      .lean();

    const pendingCount = await ExternalTransfer.countDocuments({ status: 'pending' });

    return Response.json({ transfers, pendingCount });
  } catch (err) {
    console.error('Admin external transfers error:', err);
    return Response.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
});
