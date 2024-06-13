import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import Blog from '../../../../../lib/modals/blog';
import connect from '@/lib/db';

export const GET = async (request: Request, context: { params: any }) => {
  const BlogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const categoryId = searchParams.get('categoryId');
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'User Id is required or invalid userId' }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: 'Category Id is required or invalid categoryId',
        }),
        { status: 400 }
      );
    }

    if (!BlogId || !Types.ObjectId.isValid(BlogId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Blog Id is required or invalid BlogId' }),
        { status: 400 }
      );
    }
    await connect();

    const blogResponse = await Blog.findOne({
      _id: BlogId,
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(categoryId),
    });
    if (blogResponse) {
      return new NextResponse(JSON.stringify(blogResponse), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: 'Blog not found' }), {
        status: 404,
      });
    }
  } catch (error: any) {
    console.log('error', error);
    return new NextResponse(JSON.stringify('error ' + error.message), {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();

    console.log(blogId, 'blogId from  the console');

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          ErrorMessage: 'blogId is not a found or invalid blog ID',
        }),
        { status: 400 }
      );
    }
    await connect();

    const { description, title } = body;
    const checkblogId = await Blog.findOne({ _id: blogId });
    if (!checkblogId) {
      return new NextResponse(
        JSON.stringify({ ErrorMessage: 'blog not found in the database' }),
        { status: 404 }
      );
    }
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { description, title },
      { new: true }
    );
    if (updatedBlog) {
      return new NextResponse(JSON.stringify(updatedBlog), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: 'Blog not updated' }), {
        status: 404,
      });
    }
  } catch (error: any) {
    console.log(error, 'Error');
    return new NextResponse(JSON.stringify('Error' + error.message));
  }
};
