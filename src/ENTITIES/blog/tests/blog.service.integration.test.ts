import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlogController } from '../blog.controller';
import { Test } from '@nestjs/testing';
import { BlogService } from '../blog.service';
import { arrayOfBlogsDataType, defaultQuery } from './blog.testingData';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BlogExistsValidation, BlogHasOwnerValidation } from '../../../validation/blogValidation';
import { CommentRepository } from '../../comment/comment.repository';
import { PostRepository } from '../../post/post.repository';
import { PostService } from '../../post/post.service';
import { UserRepository } from '../../user/user.repository';
import { BlogRepository } from '../blog.repository';
import { Blog } from '../blog.schema';
import { UserModule } from '../../user/user.module';
import { CommentDocument } from '../../comment/comment.schema';

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
class MockBlogRepository {
	findAll = jest
		.fn(() => {
			return arrayOfBlogsDataType;
		})
		.mockImplementation(() => {
			return arrayOfBlogsDataType;
		});
	countAllBlogs = jest.fn().mockImplementation(() => {
		return arrayOfBlogsDataType.length;
	});
}

describe('BlogService integration tests', () => {
	//connect to fake mongoServer
	let mongoMemoryServer;
	beforeAll(async () => {
		mongoMemoryServer = await MongoMemoryServer.create();
		const mongoUri = mongoMemoryServer.getUri(); //mongodb://127.0.0.1:58023/
		await mongoose.connect(mongoUri);
	});

	//disconnect
	afterAll(async () => {
		await mongoose.disconnect();
		await mongoMemoryServer.stop();
	});

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

	describe('findAll', () => {
		it('findAll', async () => {
			jest.spyOn(blogRepository, 'findAll');
			jest.spyOn(blogService, 'findAll');
			const result = await blogService.findAll(defaultQuery, 'user');

			expect(blogService.findAll).toHaveBeenCalled(); //blogService.findAll value must be a mock or spy function
			expect(blogRepository.findAll).toHaveBeenCalled();
		});
	});
});
