import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'gt-access-secret-change-in-production';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'gt-refresh-secret-change-in-production';
const IS_PROD = process.env.NODE_ENV === 'production';

export function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  return request.cookies.get('token')?.value || null;
}

export function getRefreshTokenFromRequest(request) {
  return request.cookies.get('refreshToken')?.value || null;
}

export function setAuthCookies(response, accessToken, refreshToken) {
  const baseOpts = `; Path=/; HttpOnly; SameSite=Strict${IS_PROD ? '; Secure' : ''}`;
  response.headers.append('Set-Cookie', `token=${accessToken}; Max-Age=900${baseOpts}`);
  response.headers.append('Set-Cookie', `refreshToken=${refreshToken}; Max-Age=604800${baseOpts}`);
  return response;
}

export function clearAuthCookies(response) {
  const baseOpts = `; Path=/; HttpOnly; SameSite=Strict${IS_PROD ? '; Secure' : ''}`;
  response.headers.append('Set-Cookie', `token=; Max-Age=0${baseOpts}`);
  response.headers.append('Set-Cookie', `refreshToken=; Max-Age=0${baseOpts}`);
  return response;
}

export function buildAuthResponse(data, status, accessToken, refreshToken) {
  const response = Response.json(data, { status });
  return setAuthCookies(response, accessToken, refreshToken);
}
