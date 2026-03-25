import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import ChatSession from '@/models/ChatSession';

// GET /api/admin/chat/[sessionId] — get full session
export const GET = withAdmin(async function (request, { params }) {
  try {
    const { sessionId } = await params;
    await connectDB();

    const session = await ChatSession.findOne({ sessionId }).lean();
    if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

    return Response.json({ session });
  } catch (err) {
    console.error('Admin chat get error:', err);
    return Response.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
});

// POST /api/admin/chat/[sessionId] — admin sends reply
export const POST = withAdmin(async function (request, { params }) {
  try {
    const { sessionId } = await params;
    const { text } = await request.json();
    if (!text?.trim()) return Response.json({ error: 'Empty message' }, { status: 400 });

    await connectDB();

    const session = await ChatSession.findOne({ sessionId });
    if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

    const message = { role: 'admin', text: text.trim(), createdAt: new Date() };
    session.messages.push(message);
    session.status = 'active';
    await session.save();

    return Response.json({ message });
  } catch (err) {
    console.error('Admin chat reply error:', err);
    return Response.json({ error: 'Failed to send reply' }, { status: 500 });
  }
});

// PATCH /api/admin/chat/[sessionId] — close session
export const PATCH = withAdmin(async function (request, { params }) {
  try {
    const { sessionId } = await params;
    await connectDB();

    await ChatSession.findOneAndUpdate({ sessionId }, { status: 'closed' });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: 'Failed to close session' }, { status: 500 });
  }
});
