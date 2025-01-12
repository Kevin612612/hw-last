import {
	Controller,
	Inject,
	Get,
	Post,
	Body,
	Delete,
	Param,
	Query,
	Put,
	Res,
	UseGuards,
	HttpStatus,
	Req,
	HttpCode,
} from '@nestjs/common';
import { BlogIdDTO, BlogIdDTO_1, PostIdDTO } from '../dto/id.dto';
import { PostDTO } from '../ENTITIES/post/dto/postInputDTO';
import { BaseQueryDTO, QueryDTO } from '../dto/query.dto';
import { PostService } from '../ENTITIES/post/post.service';
import { BlogTypeSchema, BlogViewType } from '../types/blog';
import { AuthGuardBearer } from '../guards/authBearer.guard';
import { PostsTypeSchema } from '../types/post';
import { LogClassName } from '../decorators/logger.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogService } from '../ENTITIES/blog/blog.service';
import { BlogDTO } from '../ENTITIES/blog/dto/blogInputDTO';

@SkipThrottle()
@UseGuards(AuthGuardBearer)
@Controller('blogger/blogs')
export class BloggerBlogsController {
	constructor(@Inject(BlogService) protected blogService: BlogService, @Inject(PostService) protected postService: PostService) {}

	//this method absents in swagger
	// @Get('/:blogId')
	// @LogClassName()
	// async getBlogById(@Param() params: BlogIdDTO_1, @Res() res: Response) {
	// 	const blog = await this.blogService.getBlogById(params.blogId);
	// 	return blog ? res.send(blog) : res.sendStatus(HttpStatus.NOT_FOUND);
	// }

	//this method absents in swagger
	// @UseGuards(AuthGuardBearer)
	// @Get('/:blogId/posts')
	// @LogClassName()
	// async getPostsByBlogId(@Param() params: BlogIdDTO, @Query() query: QueryDTO, @Req() req) {
	// 	const userId = req.user?.id || null;
	// 	return await this.postService.findAll(query, userId, params.blogId);
	// }

	@Get('/comments')
	@LogClassName()
	async getAllCommentsForCurrentUserBlogs(@Query() query: BaseQueryDTO, @Req() req) {
		const userId = req.user?.id || null;
		return await this.blogService.findAllComments(query, userId);
	}

	@Put('/:blogId')
	@LogClassName()
	async updateBlogById(@Param() params: BlogIdDTO_1, @Body() blogDto: BlogDTO, @Req() req, @Res() res) {
		const userId = req.user?.id || null;
		const result = await this.blogService.updateBlogById(params.blogId, userId, blogDto);
		return result ? res.sendStatus(HttpStatus.NO_CONTENT) : res.sendStatus(HttpStatus.NOT_FOUND);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:blogId')
	@LogClassName()
	async deleteBlog(@Param() params: BlogIdDTO_1, @Req() req) {
		const userId = req.user?.id || null;
		return await this.blogService.deleteBlog(params.blogId, userId);
	}

	@Post()
	@LogClassName()
	async createBlog(@Body() dto: BlogDTO, @Req() req): Promise<BlogViewType | string[]> {
		const userId = req.user?.id || null;
		const userLogin = req.user?.accountData.login || null;
		const blogOwnerInfo = { userId: userId, userLogin: userLogin };
		return await this.blogService.createBlog(dto, blogOwnerInfo);
	}

	@Get()
	@LogClassName()
	async getAllBlogs(@Query() query: QueryDTO, @Req() req): Promise<BlogTypeSchema> {
		const userLogin = req.user?.accountData.login || null;
		return await this.blogService.findAll(query, 'blogger', userLogin);
	}

	@Post('/:blogId/posts')
	@LogClassName()
	async createPostByBlogId(@Param() params: BlogIdDTO_1, @Body() dto: PostDTO, @Req() req) {
		const userLogin = req.user?.accountData.login || null;
		dto.blogId = params.blogId;
		return await this.postService.createPost(dto, userLogin);
	}

	@Get('/:blogId/posts')
	@LogClassName()
	async getAllPosts(@Query() dto: QueryDTO, @Param() blogId: BlogIdDTO, @Req() req): Promise<PostsTypeSchema> {
		const userId = req.user?.id || null;
		return await this.postService.findAll(dto, userId, blogId.blogId);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:blogId/posts/:postId')
	@LogClassName()
	async updatePostById(@Param() blogId: BlogIdDTO_1, @Param() postId: PostIdDTO, @Body() dto: PostDTO, @Req() req) {
		const userLogin = req.user?.accountData.login || null;
		return await this.postService.updatePostById(userLogin, postId.postId, dto, blogId.blogId);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:blogId/posts/:postId')
	@LogClassName()
	async deletePost(@Param() blogId: BlogIdDTO_1, @Param() params: PostIdDTO, @Req() req) {
		const userLogin = req.user?.accountData.login || null;
		return await this.postService.deletePost(userLogin, blogId.blogId, params.postId);
	}
}
