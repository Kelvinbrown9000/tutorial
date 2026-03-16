import { connectDB } from '@/lib/mongodb';
import { withAdmin, getClientIp } from '@/lib/apiMiddleware';
import { validate, depositSchema } from '@/lib/validators';
import { logAudit } from '@/lib/logger';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export const POST = withAdmin(async function (request, _context, jwtPayload) {
  try {
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(depositSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { accountId, amount, description } = data;

    const account = await Account.findOne({ _id: accountId, isActive: true });
    if (!account) {
      return Response.json({ error: 'Account not found or access denied' }, { status: 404 });
    }

    // Atomic balance update
    const updated = await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: amount, availableBalance: amount } },
      { new: true }
    );

    const transaction = await Transaction.create({
      type: 'deposit',
      amount,
      accountId,
      userId: jwtPayload.userId,
      description: description || 'Deposit',
      balanceAfter: updated.balance,
      status: 'completed',
      ip: getClientIp(request),
    });

    logAudit({
      action: 'DEPOSIT',
      userId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { accountId, amount, transactionId: transaction.transactionId },
    });

    return Response.json({
      message: 'Deposit successful',
      transaction,
      newBalance: updated.balance,
    });
  } catch (err) {
    console.error('Deposit error:', err);
    return Response.json({ error: 'Deposit failed. Please try again.' }, { status: 500 });
  }
});
