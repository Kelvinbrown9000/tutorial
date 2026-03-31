import { connectDB } from '@/lib/mongodb';
import { withAuth, getClientIp } from '@/lib/apiMiddleware';
import { logAudit } from '@/lib/logger';
import Account from '@/models/Account';
import ExternalTransfer from '@/models/ExternalTransfer';

export const POST = withAuth(async function (request, _ctx, jwtPayload) {
  try {
    await connectDB();
    const body = await request.json();
    const { fromAccountId, recipientName, recipientBank, routingNumber, recipientAccountNumber, amount, description } = body;

    // Validate required fields
    if (!fromAccountId || !recipientName?.trim() || !routingNumber || !recipientAccountNumber?.trim() || !amount) {
      return Response.json({ error: 'All required fields must be provided' }, { status: 400 });
    }
    if (!/^\d{9}$/.test(routingNumber)) {
      return Response.json({ error: 'Routing number must be exactly 9 digits' }, { status: 400 });
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }
    if (parsed > 25000) {
      return Response.json({ error: 'Single external transfer limit is $25,000' }, { status: 400 });
    }

    // Verify source account belongs to user and has sufficient balance
    const fromAccount = await Account.findOne({
      _id: fromAccountId,
      userId: jwtPayload.userId,
      isActive: true,
    });
    if (!fromAccount) {
      return Response.json({ error: 'Source account not found' }, { status: 404 });
    }
    if (fromAccount.balance < parsed) {
      return Response.json({ error: 'Insufficient funds' }, { status: 400 });
    }

    const transfer = await ExternalTransfer.create({
      userId: jwtPayload.userId,
      fromAccountId,
      recipientName: recipientName.trim(),
      recipientBank: recipientBank?.trim() || undefined,
      routingNumber,
      recipientAccountNumber: recipientAccountNumber.trim(),
      amount: parsed,
      description: description?.trim() || undefined,
      status: 'pending',
    });

    logAudit({
      action: 'EXTERNAL_TRANSFER_SUBMITTED',
      userId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { referenceId: transfer.referenceId, amount: parsed, routingNumber },
    });

    return Response.json({
      message: 'External transfer request submitted successfully. It is under review and will be processed within 1–2 business days.',
      referenceId: transfer.referenceId,
      status: transfer.status,
    });
  } catch (err) {
    console.error('External transfer error:', err);
    return Response.json({ error: 'Failed to submit transfer request' }, { status: 500 });
  }
});
