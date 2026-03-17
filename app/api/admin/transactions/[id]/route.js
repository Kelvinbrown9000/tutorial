import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { withAdmin, getClientIp } from '@/lib/apiMiddleware';
import { logAudit } from '@/lib/logger';
import Transaction from '@/models/Transaction';

export const PATCH = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    if (!body.createdAt) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const date = new Date(body.createdAt);
    if (isNaN(date.getTime())) {
      return Response.json({ error: 'Invalid date' }, { status: 400 });
    }

    const oid = new mongoose.Types.ObjectId(id);

    // Use raw MongoDB driver to bypass Mongoose timestamps:true protection on createdAt
    const result = await Transaction.collection.updateOne(
      { _id: oid },
      { $set: { createdAt: date } }
    );
    if (result.matchedCount === 0) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transaction = await Transaction.findById(id)
      .populate('userId', 'firstName lastName email memberNumber')
      .populate('accountId', 'accountNumber type')
      .lean();

    logAudit({
      action: 'ADMIN_TRANSACTION_DATE_UPDATE',
      adminId: jwtPayload.userId,
      targetId: id,
      ip: getClientIp(request),
      details: { createdAt: date },
    });

    return Response.json({ transaction, message: 'Transaction updated' });
  } catch (err) {
    console.error('Admin transaction patch error:', err);
    return Response.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
});
