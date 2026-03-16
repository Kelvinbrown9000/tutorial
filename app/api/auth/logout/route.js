import { clearAuthCookies, getTokenFromRequest } from '@/lib/auth';
import { logAudit, getClientIp } from '@/lib/logger';

export async function POST(request) {
  const hadToken = !!getTokenFromRequest(request);
  if (hadToken) {
    logAudit({ action: 'USER_LOGOUT', ip: request.headers.get('x-forwarded-for') || '127.0.0.1' });
  }
  const response = Response.json({ message: 'Logged out successfully' }, { status: 200 });
  return clearAuthCookies(response);
}
