import { Module } from '@nestjs/common';
import { SysAdminBlogController } from './sys-admin-blog.controller';
import { SysAdminUsersController } from './sys-admin-user.controller';
import { BlogModule } from '../ENTITIES/blog/blog.module';
import { UserModule } from '../ENTITIES/user/user.module';

@Module({
	imports: [UserModule, BlogModule],
	controllers: [SysAdminUsersController, SysAdminBlogController],
	providers: [],
})
export class SysAdminModule {}
