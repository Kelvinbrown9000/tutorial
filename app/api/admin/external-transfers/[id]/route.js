import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { withAdmin, getClientIp } from '@/lib/apiMiddleware';
import { logAudit } from '@/lib/logger';
import ExternalTransfer from '@/models/ExternalTransfer';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

// PATCH /api/admin/external-transfers/[id]
// body: { action: 'approve' | 'contact_support', adminNote?: string }
export const PATCH = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    await connectDB();
    const { id } = await params;
    const { action, adminNote } = await request.json();

    if (!['approve', 'contact_support'].includes(action)) {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const transfer = await ExternalTransfer.findById(id);
    if (!transfer) {
      return Response.json({ error: 'Transfer not found' }, { status: 404 });
    }
    if (transfer.status !== 'pending') {
      return Response.json({ error: 'Transfer has already been processed' }, { status: 400 });
    }

    if (action === 'contact_support') {
      transfer.status = 'contact_support';
      transfer.adminNote = adminNote || 'Please contact support to complete this transfer.';
      transfer.adminId = jwtPayload.userId;
      transfer.processedAt = new Date();
      await transfer.save();

      logAudit({
        action: 'ADMIN_EXTERNAL_TRANSFER_CONTACT_SUPPORT',
        adminId: jwtPayload.userId,
        targetId: id,
        ip: getClientIp(request),
        details: { referenceId: transfer.referenceId },
      });

      return Response.json({ transfer, message: 'Transfer marked as contact support required' });
    }

    // action === 'approve' — debit the account and create transaction record
    const fromAccount = await Account.findOne({
      _id: transfer.fromAccountId,
      isActive: true,
    });
    if (!fromAccount) {
      return Response.json({ error: 'Source account not found or inactive' }, { status: 404 });
    }
    if (fromAccount.balance < transfer.amount) {
      return Response.json({ error: 'Insufficient funds in source account' }, { status: 400 });
    }

    // Use a MongoDB session for atomicity
    const dbSession = await mongoose.startSession();
    let txn;
    try {
      await dbSession.withTransaction(async () => {
        const updatedAccount = await Account.findByIdAndUpdate(
          transfer.fromAccountId,
          { $inc: { balance: -transfer.amount, availableBalance: -transfer.amount } },
          { new: true, session: dbSession }
        );

        const desc = transfer.description
          ? `External transfer to ${transfer.recipientName}: ${transfer.description}`
          : `External transfer to ${transfer.recipientName} (${transfer.routingNumber})`;

        [txn] = await Transaction.create(
          [
            {
              type: 'transfer_out',
              amount: transfer.amount,
              accountId: transfer.fromAccountId,
              userId: transfer.userId,
              description: desc,
              balanceAfter: updatedAccount.balance,
              status: 'completed',
              metadata: {
                externalTransferId: transfer._id,
                referenceId: transfer.referenceId,
                routingNumber: transfer.routingNumber,
                recipientAccountNumber: transfer.recipientAccountNumber,
                recipientName: transfer.recipientName,
                recipientBank: transfer.recipientBank,
              },
            },
          ],
          { session: dbSession }
        );

        transfer.status = 'approved';
        transfer.adminNote = adminNote || undefined;
        transfer.adminId = jwtPayload.userId;
        transfer.processedAt = new Date();
        transfer.resultTransactionId = txn._id;
        await transfer.save({ session: dbSession });
      });
    } finally {
      dbSession.endSession();
    }

    logAudit({
      action: 'ADMIN_EXTERNAL_TRANSFER_APPROVED',
      adminId: jwtPayload.userId,
      targetId: id,
      ip: getClientIp(request),
      details: { referenceId: transfer.referenceId, amount: transfer.amount },
    });

    return Response.json({ transfer, transaction: txn, message: 'Transfer approved and processed' });
  } catch (err) {
    console.error('Admin external transfer patch error:', err);
    return Response.json({ error: 'Failed to process transfer' }, { status: 500 });
  }
});
