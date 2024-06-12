import { NextResponse } from 'next/server';

export const GET = () => {
  return new NextResponse('These is the first api response from next !');
};
