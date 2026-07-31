import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'eurowindow-secret-key-super-secure-2026';
  return new TextEncoder().encode(secret);
};

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecretKey());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (error) {
    return null;
  }
}
