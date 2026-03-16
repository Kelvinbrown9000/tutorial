import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import Transaction from '@/models/Transaction';

export const GET = withAdmin(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const accountId = searchParams.get('accountId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    const filter = {};
    if (type) filter.type = type;
    if (userId) filter.userId = userId;
    if (accountId) filter.accountId = accountId;
    if (status) filter.status = status;
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'firstName lastName email memberNumber')
      .populate('accountId', 'accountNumber type')
      .lean();

    // Aggregate stats for filtered set (all pages)
    const statsAgg = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          depositTotal: {
            $sum: { $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0] },
          },
          withdrawalTotal: {
            $sum: { $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0] },
          },
          transferTotal: {
            $sum: { $cond: [{ $eq: ['$type', 'transfer_out'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const stats = statsAgg[0] || { totalAmount: 0, depositTotal: 0, withdrawalTotal: 0, transferTotal: 0 };

    return Response.json({
      transactions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats,
    });
  } catch (err) {
    console.error('Admin transactions error:', err);
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
});
