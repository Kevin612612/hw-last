import { Controller, Inject, Get, Body, Param, Query, Put, UseGuards, HttpStatus, Req, HttpCode } from '@nestjs/common';
import { BlogIdDTO_1, UserIdDTO } from '../dto/id.dto';
import { QueryDTO } from '../dto/query.dto';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { LogClassName } from '../decorators/logger.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogService } from '../ENTITIES/blog/blog.service';
import { BlogUserBanDTO } from '../ENTITIES/blog/dto/blogInputDTO';

@SkipThrottle()
@UseGuards(AuthGuardBearer)
@Controller('blogger/users')
export class BloggerUsersController {
	constructor(@Inject(BlogService) protected blogService: BlogService) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:userId/ban')
	@LogClassName()
	async banUser(@Param() userId: UserIdDTO, @Body() banDTO: BlogUserBanDTO, @Req() req) {
		const OwnerUserId = req.user?.id || null;
		return await this.blogService.banUser(userId.userId, banDTO, OwnerUserId);
	}

	@Get('/blog/:blogId')
	@LogClassName()
	async getAllBannedUsersForBlog(@Param() blogId: BlogIdDTO_1, @Query() query: QueryDTO, @Req() req) {
		const userId = req.user?.id || null;
		return await this.blogService.findAllBannedUsers(blogId.blogId, userId, query);
	}
}
