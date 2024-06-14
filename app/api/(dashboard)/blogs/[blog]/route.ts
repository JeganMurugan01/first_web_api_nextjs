import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import Blog from '../../../../../lib/modals/blog';
import connect from '@/lib/db';
import User from '@/lib/modals/user';

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
    console.log('hello user ');
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
    const query: any = {
      _id: BlogId,
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(categoryId),
    };

   
    await connect();
  
    const blogResponse = await Blog.findOne(query)
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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log(blogId, 'blogId from  the console');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'User Id is required or invalid userId' }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          ErrorMessage: 'blogId is not a found or invalid blog ID',
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
    const { description, title } = body;
    const checkblogId = await Blog.findOne({ _id: blogId, userId });
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

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: 'User Id is required or invalid userId' }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: 'blogId is required or invalid blogId' }),
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
    const checkBlog = await Blog.findOne({ _id: blogId, userId });
    if (!checkBlog) {
      return new NextResponse(
        JSON.stringify({ ErrorMessage: 'Blog not found' }),
        { status: 404 }
      );
    }
    const deleteBlog = await Blog.findByIdAndDelete({ _id: blogId });
    if (deleteBlog) {
      return new NextResponse(
        JSON.stringify({ message: 'Blog has been deleted successfully' }),
        { status: 200 }
      );
    } else {
      return new NextResponse(JSON.stringify({ message: 'Blog not deleted' }), {
        status: 404,
      });
    }
  } catch (error: any) {
    console.log(error);
    return new NextResponse(JSON.stringify('Error' + error.message));
  }
};
