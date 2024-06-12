import connect from '@/lib/db';
import User from '@/lib/modals/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
export const GET = async () => {
  try {
    await connect();
    const user = await User.find();
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (err: any) {
    return new NextResponse(JSON.stringify('Error: ' + err.message), {
      status: 500,
    });
  }
};

const saltRounds = 10;

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body, 'original body');
    await connect();

    const { Password, ...rest } = body;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    console.log(hashedPassword, 'hashed password');

    const modifiedBody = {
      ...rest,
      password: hashedPassword,
    };
    console.log(modifiedBody, 'modified body');

    const user = new User(modifiedBody);

    const response = await user.save();

    if (response) {
      return new NextResponse(
        JSON.stringify({ message: 'User created successfully!' }),
        { status: 200 }
      );
    } else {
      throw new Error('User creation failed');
    }
  } catch (err: any) {
    console.error(err, 'error');
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    await connect();

    const body = await request.json();
    const { userId, userName } = body;

    if (!userId || !userName) {
      return new NextResponse(
        JSON.stringify({ error: 'ID or username not found' }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid user ID format' }),
        { status: 400 }
      );
    }

    const updateUserData = await User.findByIdAndUpdate(userId, {
      username: userName,
    });

    if (!updateUserData) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: 'User updated successfully',
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err, 'error');
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    await connect();
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'ID or username not found' }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid user ID format' }),
        { status: 400 }
      );
    }
    const result = await User.findByIdAndDelete(userId);
    if (result) {
      return new NextResponse(
        JSON.stringify({ message: 'User deleted successfully' }),
        { status: 200 }
      );
    } else {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }
  } catch (error: any) {
    console.log(error);
    return new NextResponse(JSON.stringify(error.message));
  }
};
