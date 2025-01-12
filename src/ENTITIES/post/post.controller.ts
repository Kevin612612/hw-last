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
	Req,
	UseGuards,
	HttpCode,
	HttpStatus,
	Res,
} from '@nestjs/common';

import { PostDTO } from './dto/postInputDTO';
import { QueryDTO } from '../../dto/query.dto';
import { PostsTypeSchema } from '../../types/post';
import { PostService } from './post.service';
import { LikeStatusDTO, PostIdDTO } from '../../dto/id.dto';
import { AuthGuardBearer } from '../../guards/authBearer.guard';
import { AuthGuardBasic } from '../../guards/authBasic.guard';
import { CommentService } from '../comment/comment.service';
import { CommentDTO } from '../comment/dto/commentsInputDTO';
import { LogClassName } from '../../decorators/logger.decorator';
import { SkipThrottle } from '@nestjs/throttler';

//(1) changeLikeStatus
//(2) getAllCommentsByPost
//(3) createCommentByPost
//(4) getAllPosts
//(5) createPost
//(6) getPostById
//(7) updatePostById
//(8) deletePost

@SkipThrottle()
@Controller('posts')
export class PostController {
	constructor(
		@Inject(PostService) protected postService: PostService,
		@Inject(CommentService) protected commentService: CommentService,
	) {}

	//(1)
	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:postId/like-status')
	@LogClassName()
	async changeLikeStatus(@Param() dto: PostIdDTO, @Body() body: LikeStatusDTO, @Req() req) {
		const user = req.user ? req.user : null;
		return await this.postService.changeLikeStatus(dto.postId, body.likeStatus, user);
	}

	//(2)
	@UseGuards(AuthGuardBearer)
	@Get('/:postId/comments')
	@LogClassName()
	async getAllCommentsByPost(@Query() dto: QueryDTO, @Param() param: PostIdDTO, @Req() req) {
		const userId = req.user?.id || null;
		return await this.commentService.getAllCommentsByPost(dto, param.postId, userId);
	}

	//(3)
	@UseGuards(AuthGuardBearer)
	@HttpCode(HttpStatus.CREATED)
	@Post('/:postId/comments')
	@LogClassName()
	async createCommentByPost(@Param() param: PostIdDTO, @Body() body: CommentDTO, @Req() req) {
		const userId = req.user?.id || null;
		const userName = req.user?.accountData.login || null;
		return await this.commentService.newPostedCommentByPostId(param.postId, body.content, userId, userName);
	}

	//(4)
	@Get()
	@LogClassName()
	async getAllPosts(@Query() dto: QueryDTO): Promise<PostsTypeSchema> {
		return await this.postService.findAll(dto, null);
	}

	//(5)
	@UseGuards(AuthGuardBasic)
	@Post()
	@LogClassName()
	async createPost(@Body() dto: PostDTO) {
		return await this.postService.createPost(dto, null);
	}

	//(6)
	@Get('/:postId')
	@LogClassName()
	async getPostById(@Param() params: PostIdDTO, @Res() res) {
		const post = await this.postService.findPostById(params.postId, null);
		return post ? res.send(post) : res.sendStatus(HttpStatus.NOT_FOUND);
	}

	//(7)
	@UseGuards(AuthGuardBasic)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:postId')
	@LogClassName()
	async updatePostById(@Param() params: PostIdDTO, @Body() dto: PostDTO) {
		return await this.postService.updatePostById(null, params.postId, dto);
	}

	//(8)
	@UseGuards(AuthGuardBasic)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:postId')
	@LogClassName()
	async deletePost(@Param() params: PostIdDTO) {
		return await this.postService.deletePost(null, null, params.postId);
	}
}
