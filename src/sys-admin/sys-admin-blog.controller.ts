import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Put, Query, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { LogClassName } from '../decorators/logger.decorator';
import { BlogIdDTO_1, BlogIdDTO, UserIdDTO } from '../dto/id.dto';
import { QueryDTO } from '../dto/query.dto';
import { BlogService } from '../ENTITIES/blog/blog.service';
import { BlogBanDTO } from '../ENTITIES/blog/dto/blogInputDTO';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { BlogTypeSchema } from '../types/blog';

@SkipThrottle()
@UseGuards(AuthGuardBasic)
@Controller('sa/blogs')
export class SysAdminBlogController {
	constructor(@Inject(BlogService) protected blogService: BlogService) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:blogId/ban')
	@LogClassName()
	async banBlog(@Param() blogId: BlogIdDTO_1, @Body() banDTO: BlogBanDTO) {
		return await this.blogService.banBlog(blogId.blogId, banDTO);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:blogId/bind-with-user/:userId')
	@LogClassName()
	async bindBlogWithUser(@Param() blogId: BlogIdDTO, @Param() userId: UserIdDTO) {
		return await this.blogService.bindBlogWithUser(blogId.blogId, userId.userId);
	}

	@Get()
	@LogClassName()
	async getAllBlogs(@Query() query: QueryDTO): Promise<BlogTypeSchema> {
		return await this.blogService.findAll(query, 'sisAdmin', null);
	}
}
