import { connectDB } from '@/lib/mongodb';
import { withAdmin } from '@/lib/apiMiddleware';
import ChatSession from '@/models/ChatSession';
import ChatConfig from '@/models/ChatConfig';

// GET /api/admin/chat — list all active/waiting sessions
export const GET = withAdmin(async function () {
  try {
    await connectDB();

    const sessions = await ChatSession.find({ status: { $ne: 'closed' } })
      .sort({ updatedAt: -1 })
      .lean();

    const config = await ChatConfig.findOne({ key: 'admin_status' });
    const isOnline =
      config?.isOnline &&
      config?.lastSeen &&
      Date.now() - new Date(config.lastSeen).getTime() < 2 * 60 * 1000;

    return Response.json({ sessions, isOnline: !!isOnline });
  } catch (err) {
    console.error('Admin chat list error:', err);
    return Response.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
});

// PATCH /api/admin/chat — toggle online status or send heartbeat
// body: { action: 'online' | 'offline' | 'heartbeat' }
export const PATCH = withAdmin(async function (request) {
  try {
    const { action } = await request.json();
    await connectDB();

    const update =
      action === 'offline'
        ? { isOnline: false, lastSeen: new Date() }
        : { isOnline: true, lastSeen: new Date() };

    await ChatConfig.findOneAndUpdate(
      { key: 'admin_status' },
      { $set: update },
      { upsert: true, new: true }
    );

    return Response.json({ ok: true, isOnline: action !== 'offline' });
  } catch (err) {
    console.error('Admin status error:', err);
    return Response.json({ error: 'Failed to update status' }, { status: 500 });
  }
});
