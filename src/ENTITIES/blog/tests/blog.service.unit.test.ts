import { Test } from '@nestjs/testing';
import { BlogController } from '../blog.controller';
import { BlogService } from '../blog.service';
import { BlogRepository } from '../blog.repository';
import { BlogExistsValidation, BlogHasOwnerValidation } from '../../../validation/blogValidation';
import { Model } from 'mongoose';
import { Blog } from '../blog.schema';
import { getModelToken } from '@nestjs/mongoose';
import { PostRepository } from '../../post/post.repository';
import { CommentRepository } from '../../comment/comment.repository';
import { UserRepository } from '../../user/user.repository';
import { PostService } from '../../post/post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { arrayOfBlogsDataType, defaultQuery } from './blog.testingData';

class MockMongooseModule {}
class MockUserModule {}
class MockPostModule {}
class MockCommentsModule {}
class MockTokenModule {}
class MockBlackListModule {}

class MockPostRepository {}
class MockCommentRepository {}
class MockUserRepository {}
class MockPostService {}
class MockBlogModel {}

describe('BlogService unit tests', () => {
	class MockBlogRepository {
		findAll = jest.fn().mockImplementation(() => {
			return arrayOfBlogsDataType;
		});
		countAllBlogs = jest.fn().mockImplementation(() => {
			return arrayOfBlogsDataType.length;
		});
	}
	let blogController: BlogController;
	let blogService: BlogService;
	let blogRepository: BlogRepository;
	let model: Model<Blog>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [MockMongooseModule, MockUserModule, MockPostModule, MockCommentsModule, MockTokenModule, MockBlackListModule],
			controllers: [BlogController],
			providers: [
				BlogService,
				{
					provide: BlogRepository,
					useClass: MockBlogRepository,
				},
				{
					provide: PostService,
					useClass: MockPostService,
				},
				{
					provide: PostRepository,
					useClass: MockPostRepository,
				},
				{
					provide: CommentRepository,
					useClass: MockCommentRepository,
				},
				{
					provide: UserRepository,
					useClass: MockUserRepository,
				},
				{
					provide: getModelToken(Blog.name),
					useClass: MockBlogModel,
				},
				BlogExistsValidation,
				BlogHasOwnerValidation,
			],
		}).compile();

		blogController = module.get<BlogController>(BlogController);
		blogService = module.get<BlogService>(BlogService);
		blogRepository = module.get<BlogRepository>(BlogRepository);
		model = module.get<Model<Blog>>(getModelToken(Blog.name));
	});

	it('service should be defined', async () => {
		expect(blogService).toBeDefined();
	});

	it('findAll', async () => {
		//jest.spyOn(blogRepository, 'findAll').mockImplementationOnce(() => Promise.resolve([]));
		jest.spyOn(blogRepository, 'findAll');
		jest.spyOn(blogService, 'findAll');
		const result = await blogService.findAll(defaultQuery, 'user');

		expect(blogService.findAll).toHaveBeenCalled(); //blogService.findAll value must be a mock or spy function
		expect(blogRepository.findAll).toHaveBeenCalled();
	});
});
