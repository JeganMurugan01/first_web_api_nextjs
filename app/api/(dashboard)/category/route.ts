import connect from '@/lib/db';
import User from '@/lib/modals/user';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import Category from '@/lib/modals/category';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get('userId');

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: 'User Id is required' }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid user' }), {
        status: 400,
      });
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'user not found ' }), {
        status: 400,
      });
    }

    const category = await Category.find({ user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'category not found ' }),
        {
          status: 400,
        }
      );
    }
    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error: any) {
    console.log('error', error);
    return new NextResponse(JSON.stringify('Error: ' + error.message), {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    console.log('Body', body);

    const { userId, category } = body;

    if (!userId || !category) {
      return new NextResponse(
        JSON.stringify({ message: 'userId and category not found' }),
        { status: 404 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid userId ' }), {
        status: 404,
      });
    }

    await connect();

    const result = new Category({
      title: category,
      user: userId,
    });

    const saveCategory = await result.save();
    if (saveCategory) {
      return new NextResponse(
        JSON.stringify({ message: 'Category saved successfully !' }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: 'Category not saved' }),
        {
          status: 404,
        }
      );
    }
  } catch (error: any) {
    console.log('Error', error);
    return new NextResponse(JSON.stringify('Error: ' + error.message), {
      status: 500,
    });
  }
};
