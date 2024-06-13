import { Schema, model, models } from 'mongoose';

const blogSchema = new Schema(
  {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model('Blog', blogSchema);

export default Blog;
