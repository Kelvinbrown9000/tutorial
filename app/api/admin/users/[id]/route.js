import { connectDB } from '@/lib/mongodb';
import { withAdmin, getClientIp } from '@/lib/apiMiddleware';
import { logAudit } from '@/lib/logger';
import User from '@/models/User';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export const GET = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    await connectDB();

    const user = await User.findById(id).select('-password');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    const accounts = await Account.find({ userId: id });
    const recentTransactions = await Transaction.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('accountId', 'accountNumber type');

    return Response.json({ user, accounts, recentTransactions });
  } catch (err) {
    console.error('Admin user detail error:', err);
    return Response.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
});

export const PATCH = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const allowedFields = {};
    if (body.isActive !== undefined) allowedFields.isActive = body.isActive;
    if (body.role && ['user', 'admin'].includes(body.role)) allowedFields.role = body.role;

    const user = await User.findByIdAndUpdate(id, allowedFields, { new: true }).select('-password');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    logAudit({
      action: 'ADMIN_USER_UPDATE',
      adminId: jwtPayload.userId,
      targetUserId: id,
      ip: getClientIp(request),
      details: allowedFields,
    });

    return Response.json({ user, message: 'User updated' });
  } catch (err) {
    console.error('Admin user patch error:', err);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
});

export const DELETE = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    await connectDB();

    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select('-password');
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    logAudit({
      action: 'ADMIN_USER_DEACTIVATE',
      adminId: jwtPayload.userId,
      targetUserId: id,
      ip: getClientIp(request),
    });

    return Response.json({ message: 'User deactivated', user });
  } catch (err) {
    console.error('Admin user delete error:', err);
    return Response.json({ error: 'Failed to deactivate user' }, { status: 500 });
  }
});
