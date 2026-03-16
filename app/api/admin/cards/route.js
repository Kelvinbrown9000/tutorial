import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import CardRequest from '@/models/CardRequest';

export const GET = withAdmin(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const status = searchParams.get('status');

    const filter = {};
    if (status) filter.status = status;

    const total = await CardRequest.countDocuments(filter);
    const cardRequests = await CardRequest.find(filter)
      .sort({ requestedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'firstName lastName email memberNumber')
      .populate('accountId', 'accountNumber type')
      .lean();

    return Response.json({
      cardRequests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin cards error:', err);
    return Response.json({ error: 'Failed to fetch card requests' }, { status: 500 });
  }
});
