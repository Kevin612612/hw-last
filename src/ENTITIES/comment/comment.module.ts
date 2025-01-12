import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../blog/blog.schema';
import { Post, PostSchema } from '../post/post.schema';
import { Comment, CommentSchema } from './comment.schema';
import { PostRepository } from '../post/post.repository';
import { BlogRepository } from '../blog/blog.repository';
import { TokenModule } from '../tokens/tokens.module';
import { UserModule } from '../user/user.module';
import { BlackListModule } from '../black_list/blacklist.module';
import { CommentExistsValidation } from '../../validation/commentValidation';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Comment.name, schema: CommentSchema },
			{ name: Blog.name, schema: BlogSchema },
			{ name: Post.name, schema: PostSchema },
		]),
		TokenModule,
		UserModule,
		BlackListModule,
	],
	controllers: [CommentController],
	providers: [CommentService, CommentRepository, PostRepository, BlogRepository, CommentExistsValidation],
	exports: [CommentService, CommentRepository],
})
export class CommentsModule {}
