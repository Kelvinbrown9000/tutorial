import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import User from '@/models/User';
import Account from '@/models/Account';

export const GET = withAdmin(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const filter = {};
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { firstName: re },
        { lastName: re },
        { email: re },
        { memberNumber: re },
      ];
    }
    if (role) filter.role = role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Attach account summary to each user
    const userIds = users.map((u) => u._id);
    const accounts = await Account.find({ userId: { $in: userIds } }).lean();

    const accountMap = {};
    for (const acc of accounts) {
      const uid = acc.userId.toString();
      if (!accountMap[uid]) accountMap[uid] = { count: 0, totalBalance: 0 };
      accountMap[uid].count += 1;
      accountMap[uid].totalBalance += acc.balance;
    }

    const enriched = users.map((u) => ({
      ...u,
      accountCount: accountMap[u._id.toString()]?.count || 0,
      totalBalance: accountMap[u._id.toString()]?.totalBalance || 0,
    }));

    return Response.json({
      users: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin users error:', err);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
});
