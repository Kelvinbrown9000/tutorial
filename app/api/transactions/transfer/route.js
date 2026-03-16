import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { withAuth, getClientIp } from '@/lib/apiMiddleware';
import { validate, transferSchema } from '@/lib/validators';
import { logAudit } from '@/lib/logger';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export const POST = withAuth(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(transferSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { fromAccountId, toAccountId, amount, description } = data;

    if (fromAccountId === toAccountId) {
      return Response.json({ error: 'Cannot transfer to the same account' }, { status: 400 });
    }

    const fromAccount = await Account.findOne({
      _id: fromAccountId,
      userId: jwtPayload.userId,
      isActive: true,
    });
    if (!fromAccount) {
      return Response.json({ error: 'Source account not found or access denied' }, { status: 404 });
    }

    const toAccount = await Account.findOne({ _id: toAccountId, isActive: true });
    if (!toAccount) {
      return Response.json({ error: 'Destination account not found' }, { status: 404 });
    }

    if (fromAccount.balance < amount) {
      return Response.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    // Use MongoDB session for atomicity
    const session = await mongoose.startSession();
    let transferOutTxn, transferInTxn;

    try {
      await session.withTransaction(async () => {
        const updatedFrom = await Account.findByIdAndUpdate(
          fromAccountId,
          { $inc: { balance: -amount, availableBalance: -amount } },
          { new: true, session }
        );

        const updatedTo = await Account.findByIdAndUpdate(
          toAccountId,
          { $inc: { balance: amount, availableBalance: amount } },
          { new: true, session }
        );

        const ip = getClientIp(request);
        const desc = description || `Transfer to ${toAccount.accountNumber}`;

        [transferOutTxn] = await Transaction.create(
          [
            {
              type: 'transfer_out',
              amount,
              accountId: fromAccountId,
              userId: jwtPayload.userId,
              fromAccountId,
              toAccountId,
              description: desc,
              balanceAfter: updatedFrom.balance,
              status: 'completed',
              ip,
            },
          ],
          { session }
        );

        [transferInTxn] = await Transaction.create(
          [
            {
              type: 'transfer_in',
              amount,
              accountId: toAccountId,
              userId: toAccount.userId,
              fromAccountId,
              toAccountId,
              description: description || `Transfer from ${fromAccount.accountNumber}`,
              balanceAfter: updatedTo.balance,
              status: 'completed',
              ip,
            },
          ],
          { session }
        );
      });
    } finally {
      session.endSession();
    }

    logAudit({
      action: 'TRANSFER',
      userId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { fromAccountId, toAccountId, amount },
    });

    return Response.json({
      message: 'Transfer successful',
      transferOutTxn,
      transferInTxn,
      newBalance: (await Account.findById(fromAccountId)).balance,
    });
  } catch (err) {
    console.error('Transfer error:', err);
    return Response.json({ error: 'Transfer failed. Please try again.' }, { status: 500 });
  }
});
