import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import ChatConfig from '@/models/ChatConfig';
import { sendAdminChatAlert } from '@/lib/email';

// GET /api/chat/[sessionId]?after=ISO_DATE — poll for new messages
export async function GET(request, { params }) {
  try {
    const { sessionId } = await params;
    const after = request.nextUrl.searchParams.get('after');
    await connectDB();

    const session = await ChatSession.findOne({ sessionId });
    if (!session) return Response.json({ messages: [] });

    // Check admin online
    const config = await ChatConfig.findOne({ key: 'admin_status' });
    const adminOnline =
      config?.isOnline &&
      config?.lastSeen &&
      Date.now() - new Date(config.lastSeen).getTime() < 2 * 60 * 1000;

    // Fire delayed auto-reply if:
    // — auto-reply hasn't been sent yet
    // — last message is from customer (admin hasn't replied)
    // — 1 minute has passed since the last customer message
    if (
      !session.autoReplySent &&
      session.lastCustomerMessageAt &&
      Date.now() - new Date(session.lastCustomerMessageAt).getTime() >= 60_000
    ) {
      const lastMsg = session.messages[session.messages.length - 1];
      if (lastMsg?.role === 'customer') {
        const autoReply = {
          role: 'admin',
          text: "Thank you for reaching out! Our team will be with you shortly. In the meantime, you can call us at (800) 555-4827 or email support@guardiantrustfederal.org.",
          createdAt: new Date(),
        };
        session.messages.push(autoReply);
        session.autoReplySent = true;
        await session.save();
      }
    }

    const messages = after
      ? session.messages.filter((m) => new Date(m.createdAt) > new Date(after))
      : session.messages;

    return Response.json({ messages, adminOnline, status: session.status });
  } catch (err) {
    console.error('Chat poll error:', err);
    return Response.json({ messages: [] });
  }
}

// POST /api/chat/[sessionId] — customer sends a message
export async function POST(request, { params }) {
  try {
    const { sessionId } = await params;
    const { text } = await request.json();
    if (!text?.trim()) return Response.json({ error: 'Empty message' }, { status: 400 });

    await connectDB();

    const session = await ChatSession.findOne({ sessionId });
    if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

    const message = { role: 'customer', text: text.trim(), createdAt: new Date() };
    session.messages.push(message);
    session.lastCustomerMessageAt = new Date();

    // Check admin online status
    const config = await ChatConfig.findOne({ key: 'admin_status' });
    const adminOnline =
      config?.isOnline &&
      config?.lastSeen &&
      Date.now() - new Date(config.lastSeen).getTime() < 2 * 60 * 1000;

    if (adminOnline) {
      session.status = 'active';
    } else {
      // Send email alert immediately (once per session) so admin knows to come online
      if (!session.emailSent) {
        session.emailSent = true;
        sendAdminChatAlert(sessionId, text.trim()).catch((e) =>
          console.error('Email alert failed:', e)
        );
      }
      // Auto-reply is NOT sent here — the poll will send it after 1 minute
      // if admin hasn't responded by then
    }

    await session.save();

    return Response.json({ message, adminOnline });
  } catch (err) {
    console.error('Chat send error:', err);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
