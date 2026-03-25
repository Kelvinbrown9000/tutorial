import { connectDB } from '@/lib/mongodb';
import ChatConfig from '@/models/ChatConfig';

export async function GET() {
  try {
    await connectDB();
    const config = await ChatConfig.findOne({ key: 'admin_status' });
    const adminOnline =
      !!config?.isOnline &&
      !!config?.lastSeen &&
      Date.now() - new Date(config.lastSeen).getTime() < 2 * 60 * 1000;
    return Response.json({ adminOnline });
  } catch {
    return Response.json({ adminOnline: false });
  }
}
