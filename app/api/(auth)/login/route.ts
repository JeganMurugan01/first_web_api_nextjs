import connect from '@/lib/db';
import User from '@/lib/modals/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    const privateKey = process.env.JWT_PRIVATE_KEY || '';
    console.log(body, 'body');
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: 'email or password not found' }),
        { status: 404 }
      );
    }
    await connect();
    const getUserData = await User.findOne({ email: email });
    if (getUserData) {
      console.log(getUserData?.password, 'getUserData');
      const isPasswordMatch = await bcrypt.compare(
        password,
        getUserData.password
      );
      if (!isPasswordMatch) {
        return new NextResponse(
          JSON.stringify({ message: 'Incorrect password' }),
          { status: 401 }
        );
      }
    }

    let ACCESS_TOKEN = jwt.sign({ email }, privateKey!, {
      expiresIn: '1h',
    });
    let REFERESH_TOKEN = jwt.sign({ email }, privateKey!, {
      expiresIn: '1d',
    });
    return new NextResponse(JSON.stringify({ ACCESS_TOKEN, REFERESH_TOKEN }), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse(JSON.stringify(error.message));
  }
};
