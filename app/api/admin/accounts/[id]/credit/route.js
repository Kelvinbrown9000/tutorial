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

    const account = await Account.findByIdAndUpdate(
      id,
      { $inc: { balance: amount, availableBalance: amount } },
      { new: true }
    );
    if (!account) {
      return Response.json({ error: 'Account not found' }, { status: 404 });
    }

    const transaction = await Transaction.create({
      type: 'admin_credit',
      amount,
      accountId: id,
      userId: account.userId,
      description,
      balanceAfter: account.balance,
      adminId: jwtPayload.userId,
      status: 'completed',
      ip: getClientIp(request),
    });

    logAudit({
      action: 'ADMIN_CREDIT',
      adminId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { accountId: id, amount, description },
    });

    return Response.json({
      message: 'Account credited successfully',
      transaction,
      newBalance: account.balance,
    });
  } catch (err) {
    console.error('Admin credit error:', err);
    return Response.json({ error: 'Failed to credit account' }, { status: 500 });
  }
});
