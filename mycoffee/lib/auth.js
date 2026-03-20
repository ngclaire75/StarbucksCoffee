import crypto from 'crypto';

const SECRET = process.env.NEXTAUTH_SECRET || 'starbucks-secret-change-me';

export function signToken(payload) {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifyToken(token) {
  try {
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx === -1) return null;
    const encoded = token.substring(0, dotIdx);
    const sig = token.substring(dotIdx + 1);
    const expectedSig = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
    if (sig !== expectedSig) return null;
    return JSON.parse(Buffer.from(encoded, 'base64url').toString());
  } catch {
    return null;
  }
}
