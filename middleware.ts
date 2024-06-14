import { NextResponse } from 'next/server';
import { authMiddleware } from './middleware/api/authMiddleware';

export const config = {
  matcher: '/api/:path*',
};

export const middleware = async (request: Request) => {
  const result = await authMiddleware(request);
  console.log(result, 'result');
  if (result !== true) {
    return new NextResponse(JSON.stringify({ Error: 'unauthorized' }), {
      status: 401,
    });
  }
  return NextResponse.next();
};
