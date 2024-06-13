import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import connect from '../../../../lib/db';
import User from '../../../../lib/modals/user';
import Category from '../../../../lib/modals/category';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ Message: 'userId is not found or invalid userId' }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          Message: 'categoryId is not found or invalid categoryId',
        }),
        { status: 400 }
      );
    }

    await connect();

    const checkUserId = await User.findById(userId);
    if (!checkUserId) {
      return new NextResponse(JSON.stringify({ Message: 'User not found' }), {
        status: 404,
      });
    }

    const filter = {
      userId: userId,
      categoryId: categoryId,
    };
    const category = await Category.find(filter);

    if (category) {
      return new NextResponse(JSON.stringify({ blogs: category }), {
        status: 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ Message: 'Category not found' }),
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.log('error', error);
    return new NextResponse(JSON.stringify('Error: ' + error.message), {
      status: 500,
    });
  }
};
