import connect from '@/lib/db';
import Category from '@/lib/modals/category';
import User from '@/lib/modals/user';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get('userId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'User Id is required or invalid userId' }),
        { status: 400 }
      );
    }
    console.log(categoryId, 'categoryId');
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: 'Category Id is required or invalid categoryId',
        }),
        { status: 400 }
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
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'category not found' }),
        { status: 404 }
      );
    }

    const updateCategory = await Category.findByIdAndUpdate(categoryId, body, {
      new: true,
    });
    if (updateCategory) {
      return new NextResponse(
        JSON.stringify({ message: 'Category updated successfully' }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: 'Category not updated' }),
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

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get('userId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          ErrorMessage: 'Invalid userId  or userId is not found',
        })
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          ErrorMessage: 'Invalid category id or category id is not found ',
        })
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
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'category not found' }),
        { status: 404 }
      );
    }
    const deleteCategory = await Category.deleteOne({
      _id: new Types.ObjectId(categoryId),
    });

    if (deleteCategory) {
      return new NextResponse(
        JSON.stringify({ message: 'Category deleted successfully' }),
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error, 'Error');
    return new NextResponse(JSON.stringify('Error: ' + error.message), {
      status: 500,
    });
  }
};
