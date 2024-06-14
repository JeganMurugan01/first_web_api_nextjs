import { NextResponse } from 'next/server';
import { authMiddleware } from './middleware/api/authMiddleware';

export const config = {
  matcher: '/api/:path*',
};

export const middleware = async (request: Request) => {
  const result = await authMiddleware(request);
  console.log(result, 'result');
  if (
    result !== true &&
    !request.url.includes('/api/login') &&
    !request.url.includes('/api/user')
  ) {
    return new NextResponse(JSON.stringify({ Error: 'unauthorized' }), {
      status: 401,
    });
  }
  return NextResponse.next();
};
