import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import { CommentsModule } from '../comment/comment.module';

import { BlogExistsValidation, BlogHasOwnerValidation } from '../../validation/blogValidation';
import { BlackListModule } from '../black_list/blacklist.module';
import { PostModule } from '../post/post.module';
import { TokenModule } from '../tokens/tokens.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
		UserModule,
		PostModule,
		CommentsModule,
		TokenModule,
		BlackListModule,
	],
	controllers: [BlogController],
	providers: [BlogService, BlogRepository, BlogExistsValidation, BlogHasOwnerValidation],
	exports: [BlogService, BlogRepository],
})
export class BlogModule {
	// configure(consumer: MiddlewareConsumer) {
	// 	consumer
	// 		.apply(LoggerMiddleware)
	// 		.exclude({ path: 'blogs', method: RequestMethod.POST })
	// 		.forRoutes({ path: 'blogs', method: RequestMethod.GET });
	// }
}
