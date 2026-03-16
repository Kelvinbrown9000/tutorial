import { verifyAccessToken, getTokenFromRequest } from '@/lib/auth';

// In-memory rate limit store: key -> { count, resetAt }
const rateLimitStore = new Map();

export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

export function withRateLimit(handler, { limit = 10, windowMs = 60_000 } = {}) {
  return async function (request, context) {
    const ip = getClientIp(request);
    const key = `${ip}:${request.nextUrl?.pathname || ''}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count += 1;
      if (entry.count > limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return Response.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        );
      }
    }

    return handler(request, context);
  };
}

export function withAuth(handler) {
  return async function (request, context) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
      return Response.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
    }
    return handler(request, context, payload);
  };
}

export function withAdmin(handler) {
  return async function (request, context) {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
      return Response.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
    }
    if (payload.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    return handler(request, context, payload);
  };
}
