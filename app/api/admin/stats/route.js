import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import User from '@/models/User';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';
import CardRequest from '@/models/CardRequest';

export const GET = withAdmin(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const [
      totalUsers,
      activeUsers,
      totalAccounts,
      transactionCount,
      pendingCardRequests,
      balanceAgg,
      txByType,
      recentTransactions,
      dailyTx,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Account.countDocuments({ isActive: true }),
      Transaction.countDocuments(),
      CardRequest.countDocuments({ status: 'pending' }),
      Account.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$balance' } } },
      ]),
      Transaction.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'firstName lastName email')
        .populate('accountId', 'accountNumber type')
        .lean(),
      Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return Response.json({
      totalUsers,
      activeUsers,
      totalAccounts,
      transactionCount,
      pendingCardRequests,
      totalBalance: balanceAgg[0]?.total || 0,
      transactionsByType: txByType,
      recentTransactions,
      dailyTransactions: dailyTx,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
});
