import { Controller, Delete, Get, HttpCode, HttpStatus, Inject, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { BlogRepository } from './ENTITIES/blog/blog.repository';
import { CommentRepository } from './ENTITIES/comment/comment.repository';
import { join } from 'path';
import { createReadStream } from 'fs';
import { PostRepository } from './ENTITIES/post/post.repository';
import { RefreshTokensRepository } from './ENTITIES/tokens/refreshtoken.repository';
import { UserRepository } from './ENTITIES/user/user.repository';

@Controller()
export class AppController {
	constructor(
		@Inject(AppService) private readonly appService: AppService,
		@Inject(UserRepository) protected userRepository: UserRepository,
		@Inject(BlogRepository) protected blogRepository: BlogRepository,
		@Inject(PostRepository) protected postRepository: PostRepository,
		@Inject(RefreshTokensRepository) protected refreshTokensRepository: RefreshTokensRepository,
		@Inject(CommentRepository) protected commentRepository: CommentRepository,
	) {}

	@Get()
	hello() {
		return this.appService.getHello();
	}

	//that is end-point for browser working
	@Get('favicon.ico')
	serveFavicon(@Res() res: Response) {
		const file = createReadStream(join(__dirname, '../src', 'public', 'favicon.ico'));
		return new StreamableFile(file);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('testing/all-data')
	async allData() {
		await this.userRepository.deleteAll();
		await this.blogRepository.deleteAll();
		await this.postRepository.deleteAll();
		await this.refreshTokensRepository.deleteAll();
		await this.commentRepository.deleteAll();
	}
}
