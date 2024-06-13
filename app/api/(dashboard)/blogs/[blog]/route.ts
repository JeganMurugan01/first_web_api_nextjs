import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import Blog from '../../../../../lib/modals/blog';

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
