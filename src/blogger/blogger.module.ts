import { Module } from '@nestjs/common';
import { BloggerBlogsController } from './blogger-blog.controller';
import { BloggerUsersController } from './blogger-user.controller';
import { TokenModule } from '../ENTITIES/tokens/tokens.module';
import { UserModule } from '../ENTITIES/user/user.module';
import { BlogModule } from '../ENTITIES/blog/blog.module';
import { PostModule } from '../ENTITIES/post/post.module';

@Module({
	imports: [TokenModule, UserModule, BlogModule, PostModule],
	controllers: [BloggerUsersController, BloggerBlogsController],
	providers: [],
})
export class BloggerModule {}
