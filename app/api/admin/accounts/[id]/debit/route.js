import { connectDB } from '@/lib/mongodb';
import { withAdmin, getClientIp } from '@/lib/apiMiddleware';
import { validate, adminCreditDebitSchema } from '@/lib/validators';
import { logAudit } from '@/lib/logger';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export const POST = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(adminCreditDebitSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { amount, description } = data;

    const account = await Account.findById(id);
    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }
    if (account.balance < amount) {
      return Response.json({ error: 'Insufficient account balance' }, { status: 400 });
    }

    const updated = await Account.findByIdAndUpdate(
      id,
      { $inc: { balance: -amount, availableBalance: -amount } },
      { new: true }
    );

    const transaction = await Transaction.create({
      type: 'admin_debit',
      amount,
      accountId: id,
      userId: account.userId,
      description,
      balanceAfter: updated.balance,
      adminId: jwtPayload.userId,
      status: 'completed',
      ip: getClientIp(request),
    });

    logAudit({
      action: 'ADMIN_DEBIT',
      adminId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { accountId: id, amount, description },
    });

    return Response.json({
      message: 'Account debited successfully',
      transaction,
      newBalance: updated.balance,
    });
  } catch (err) {
    console.error('Admin debit error:', err);
    return Response.json({ error: 'Failed to debit account' }, { status: 500 });
  }
});
