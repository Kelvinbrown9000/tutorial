import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import ChatConfig from '@/models/ChatConfig';

// POST /api/chat — start a new session, return sessionId + admin status
export async function POST(request) {
  try {
    await connectDB();
    const { sessionId } = await request.json();

    // Get or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({ sessionId, messages: [] });
    }

    // Check admin online (consider offline if lastSeen > 2 minutes ago)
    const config = await ChatConfig.findOne({ key: 'admin_status' });
    const isOnline =
      config?.isOnline &&
      config?.lastSeen &&
      Date.now() - new Date(config.lastSeen).getTime() < 2 * 60 * 1000;

    return Response.json({ sessionId: session.sessionId, adminOnline: isOnline });
  } catch (err) {
    console.error('Chat start error:', err);
    return Response.json({ error: 'Failed to start chat' }, { status: 500 });
  }
}
