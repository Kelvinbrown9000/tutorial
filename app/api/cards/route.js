import { connectDB } from '@/lib/mongodb';
import { withAuth, getClientIp } from '@/lib/apiMiddleware';
import { validate, cardRequestSchema } from '@/lib/validators';
import { logAudit } from '@/lib/logger';
import Account from '@/models/Account';
import CardRequest from '@/models/CardRequest';

export const GET = withAuth(async function (request, context, jwtPayload) {
  try {
    await connectDB();
    const cardRequests = await CardRequest.find({ userId: jwtPayload.userId })
      .populate('accountId', 'accountNumber type')
      .sort({ requestedAt: -1 });

    return Response.json({ cardRequests });
  } catch (err) {
    console.error('Cards GET error:', err);
    return Response.json({ error: 'Failed to fetch card requests' }, { status: 500 });
  }
});

export const POST = withAuth(async function (request, context, jwtPayload) {
  try {
    await connectDB();

    const body = await request.json();
    const { success, data, errors } = validate(cardRequestSchema, body);
    if (!success) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    const { accountId, cardType, deliveryAddress } = data;

    const account = await Account.findOne({
      _id: accountId,
      userId: jwtPayload.userId,
      isActive: true,
    });
    if (!account) {
      return Response.json({ error: 'Account not found or access denied' }, { status: 404 });
    }

    const existing = await CardRequest.findOne({
      userId: jwtPayload.userId,
      accountId,
      cardType,
      status: 'pending',
    });
    if (existing) {
      return Response.json(
        { error: 'You already have a pending request for this card type on this account' },
        { status: 409 }
      );
    }

    const cardRequest = await CardRequest.create({
      userId: jwtPayload.userId,
      accountId,
      cardType,
      deliveryAddress,
      requestedAt: new Date(),
    });

    logAudit({
      action: 'CARD_REQUEST_SUBMITTED',
      userId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { accountId, cardType, cardRequestId: cardRequest._id },
    });

    return Response.json(
      { message: 'Card request submitted successfully', cardRequest },
      { status: 201 }
    );
  } catch (err) {
    console.error('Cards POST error:', err);
    return Response.json({ error: 'Failed to submit card request' }, { status: 500 });
  }
});
