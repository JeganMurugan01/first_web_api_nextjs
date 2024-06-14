import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const verifyToken = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split(' ')[1];
  console.log(token, 'token');
  if (!token) {
    return false;
  }

  const JWT_KEY = process.env.JWT_PRIVATE_KEY || '';
  const encoder = new TextEncoder();
  const secret = encoder.encode(JWT_KEY);

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log(payload, 'decodedToken');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const authMiddleware = async (request: Request) => {
  const isVerified = await verifyToken(request);
  console.log(isVerified, 'isVerified');
  if (!isVerified) {
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), {
      status: 401,
    });
  }
  return true;
};
