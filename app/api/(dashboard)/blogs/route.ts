import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import connect from '../../../../lib/db';
import User from '../../../../lib/modals/user';
import Blog from '../../../../lib/modals/blog';

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
    const blogResponse = await Blog.find(filter);

    if (blogResponse) {
      return new NextResponse(JSON.stringify({ blogResponse }), {
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

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');
    const body = await request.json();
    const { description, title } = body;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'userId not found or invalid userId ' }),
        { status: 404 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: 'categoryId not found or invalid categoryId ',
        }),
        { status: 404 }
      );
    }
    await connect();
    const checkUserId = await User.findById(userId);

    if (!checkUserId) {
      return new NextResponse(
        JSON.stringify({ ErrorMessage: 'User not found' }),
        { status: 404 }
      );
    }
    const blogs = new Blog({
      description,
      title,
      userId,
      categoryId,
    });

    const addedBolgs = await blogs.save();
    if (addedBolgs) {
      return new NextResponse(
        JSON.stringify({ message: 'Blog has been added successfully!' }),
        { status: 200 }
      );
    } else {
      return new NextResponse(JSON.stringify({ message: 'Blog not added' }), {
        status: 404,
      });
    }
  } catch (error: any) {
    console.log('error', error);
    return new NextResponse(JSON.stringify('Error:' + error.message), {
      status: 500,
    });
  }
};
