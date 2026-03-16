import { connectDB } from '@/lib/mongodb';
import { withAuth, getClientIp } from '@/lib/apiMiddleware';
import { validate, withdrawSchema } from '@/lib/validators';
import { logAudit } from '@/lib/logger';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export const POST = withAuth(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(withdrawSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { accountId, amount, description } = data;

    const account = await Account.findOne({
      _id: accountId,
      userId: jwtPayload.userId,
      isActive: true,
    });
    if (!account) {
      return Response.json({ error: 'Account not found or access denied' }, { status: 404 });
    }

    if (account.balance < amount) {
      return Response.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    const updated = await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: -amount, availableBalance: -amount } },
      { new: true }
    );

    const transaction = await Transaction.create({
      type: 'withdrawal',
      amount,
      accountId,
      userId: jwtPayload.userId,
      description: description || 'Withdrawal',
      balanceAfter: updated.balance,
      status: 'completed',
      ip: getClientIp(request),
    });

    logAudit({
      action: 'WITHDRAWAL',
      userId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { accountId, amount, transactionId: transaction.transactionId },
    });

    return Response.json({
      message: 'Withdrawal successful',
      transaction,
      newBalance: updated.balance,
    });
  } catch (err) {
    console.error('Withdrawal error:', err);
    return Response.json({ error: 'Withdrawal failed. Please try again.' }, { status: 500 });
  }
});
