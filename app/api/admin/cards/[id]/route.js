import { connectDB } from '@/lib/mongodb';
import { withAdmin, getClientIp } from '@/lib/apiMiddleware';
import { logAudit } from '@/lib/logger';
import CardRequest from '@/models/CardRequest';

const VALID_STATUSES = ['pending', 'under_review', 'approved', 'denied', 'shipped'];

export const PATCH = withAdmin(async function (request, { params }, jwtPayload) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return Response.json(
        { error: `Status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const cardRequest = await CardRequest.findByIdAndUpdate(
      id,
      {
        status: body.status,
        adminNotes: body.adminNotes || undefined,
        reviewedBy: jwtPayload.userId,
        reviewedAt: new Date(),
      },
      { new: true }
    )
      .populate('userId', 'firstName lastName email memberNumber')
      .populate('accountId', 'accountNumber type');

    if (!cardRequest) {
      return Response.json({ error: 'Card request not found' }, { status: 404 });
    }

    logAudit({
      action: 'ADMIN_CARD_REQUEST_UPDATE',
      adminId: jwtPayload.userId,
      ip: getClientIp(request),
      details: { cardRequestId: id, newStatus: body.status },
    });

    return Response.json({ message: 'Card request updated', cardRequest });
  } catch (err) {
    console.error('Admin card update error:', err);
    return Response.json({ error: 'Failed to update card request' }, { status: 500 });
  }
});
