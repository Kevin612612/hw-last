import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createBlogDTO, createCommentDTO, createPostDTO, createUserDTO } from './functionsForTesting';
import mongoose from 'mongoose';

jest.setTimeout(100000);

describe('all tests (e2e)', () => {
	let app: INestApplication;
	const MONGO_URL = `mongodb+srv://Anton:QBgDZ7vVYskywK7d@cluster0.ksf3cyb.mongodb.net/hosting?retryWrites=true&w=majority`;

	beforeEach(async () => {
		await mongoose.connect(MONGO_URL);

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		const server = app.getHttpServer();

		await app.init();
	});

	afterAll(async () => {
		await mongoose.connection.close();
		await app.close();
	});

	it('test1', async () => {
		const server = app.getHttpServer();
		const cleanDB = async () => {
			await request(server).del(`/testing/all-data`);
		};
		const getBlogsBySisAdmin = async () => {
			const blogsResponse = await request(server)
				.get(`/sa/blogs?pageSize=5&pageNumber=1&searchNameTerm=&sortDirection=asc&sortBy=id`)
				.auth('admin', 'qwerty', { type: 'basic' });
			const createdBlogs = blogsResponse.body;
			console.log(createdBlogs);
			return createdBlogs;
		};
		const getAllBlogs = async () => {
			const blogsResponse = await request(server).get(
				`/blogs?pageSize=5&pageNumber=1&searchNameTerm=&sortDirection=asc&sortBy=id`,
			);
			const createdBlogs = blogsResponse.body;
			console.log(createdBlogs);
			return createdBlogs;
		};
		const bindBlogWithUser = async (blogId, userId) => {
			const bindingResponse = await request(server)
				.put(`/sa/blogs/${blogId}/bind-with-user/${userId}`)
				.auth('admin', 'qwerty', { type: 'basic' });
			console.log(bindingResponse.status);
		};
		const banUser = async (userId) => {
			const banUser = await request(server).put(`/sa/users/${userId}/ban`).auth('admin', 'qwerty', { type: 'basic' }).send({
				isBanned: true,
				banReason: 'the reason to ban user is just for testing',
			});
			console.log('banUser', banUser.status);
		};
		const unbanUser = async (userId) => {
			const banUser = await request(server).put(`/sa/users/${userId}/ban`).auth('admin', 'qwerty', { type: 'basic' }).send({
				isBanned: false,
			});
			console.log('banUser', banUser.status);
		};
		const banBlog = async (blogId) => {
			const banBlog = await request(server).put(`/sa/blogs/${blogId}/ban`).auth('admin', 'qwerty', { type: 'basic' }).send({
				isBanned: true,
				banReason: 'the reason to ban user is just for testing',
			});
			console.log('banBlog', banBlog.status);
		};
		const unbanBlog = async (blogId) => {
			const banUser = await request(server).put(`/sa/blogs/${blogId}/ban`).auth('admin', 'qwerty', { type: 'basic' }).send({
				isBanned: false,
			});
			console.log('banUser', banUser.status);
		};
		const banUserInBlog = async (userId, blogId, token) => {
			const banUser = await request(server).put(`/blogger/users/${userId}/ban`).auth(`${token}`, { type: 'bearer' }).send({
				isBanned: true,
				banReason: 'the reason to ban user is just for testing',
				blogId: blogId,
			});
			console.log('banUserInBlog', banUser.status);
		};
		const unbanUserInBlog = async (userId, blogId, token) => {
			const banUser = await request(server).put(`/blogger/users/${userId}/ban`).auth(`${token}`, { type: 'bearer' }).send({
				isBanned: false,
				blogId: blogId,
			});
			console.log('banUserInBlog', banUser.status);
		};
		const getUsersBySisAdmin = async () => {
			const usersResponse = await request(server).get(`/sa/users`).auth('admin', 'qwerty', { type: 'basic' });
			const users = usersResponse.body;
			console.log(users);
			return users;
		};
		const getUsersBannedInBlog = async (token, blogId) => {
			const usersResponse = await request(server)
				.get(`/blogger/users/blog/${blogId}?pageSize=9&pageNumber=1&sortBy=login&sortDirection=asc`)
				.auth(`${token}`, { type: 'bearer' });
			const users = usersResponse.body;
			console.log(users.items);
			return users;
		};
		const createUserBySisAdmin = async (userDto) => {
			const userResponse = await request(server).post(`/sa/users`).auth('admin', 'qwerty', { type: 'basic' }).send(userDto);
			const createdUser = userResponse.body;
			console.log(createdUser);
			return createdUser;
		};
		const deleteUserById = async (userId) => {
			const deletedUserResponse = await request(server).delete(`/sa/users/${userId}`).auth('admin', 'qwerty', { type: 'basic' });
			console.log('deletedUserResponse', deletedUserResponse.status);
		};
		const deleteBlogByIdByBlogger = async (blogId, accessTokenUser) => {
			const deletedBlogResponse = await request(server)
				.delete(`/blogger/blogs/${blogId}`)
				.auth(`${accessTokenUser}`, { type: 'bearer' });
			console.log('deletedBlogResponse', deletedBlogResponse.status);
		};
		const loginUser = async (userDto) => {
			const loginResponse = await request(server).post(`/auth/login`).send({
				loginOrEmail: userDto.login,
				password: userDto.password,
			});
			const accessToken = loginResponse.body.accessToken;
			console.log(accessToken);
			return accessToken;
		};
		const createBlogInDbByBlogger = async (accessTokenUser) => {
			const blogDto = createBlogDTO();
			const blogResponse = await request(server)
				.post(`/blogger/blogs`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send(blogDto);
			const createdBlog = blogResponse.body;
			console.log(createdBlog);
			return createdBlog;
		};
		const createPostInDbByBlogger = async (blogId, accessTokenUser) => {
			const postDto = createPostDTO();
			const postResponse = await request(server)
				.post(`/blogger/blogs/${blogId}/posts`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send(postDto);
			const createdPost = postResponse.body;
			console.log(createdPost);
			return createdPost;
		};
		const getBlogById = async (blogId) => {
			const blogResponse = await request(server).get(`/blogs/${blogId}`);
			const blog = blogResponse.body;
			console.log(blog);
			return blog;
		};
		const getPostById = async (postId) => {
			const postResponse = await request(server).get(`/posts/${postId}`);
			const post = postResponse.body;
			console.log(post);
			return post;
		};
		const getBlogByIdByBlogger = async (blogId) => {
			const blogResponse = await request(server).get(`/blogger/blogs/${blogId}`);
			const blog = blogResponse.body;
			console.log(blog);
			return blog;
		};
		const createCommentInDbByUser = async (postId, accessTokenUser) => {
			const commentDto = createCommentDTO();
			const commentResponse = await request(server)
				.post(`/posts/${postId}/comments`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send(commentDto);
			const createdComment = commentResponse.body;
			console.log(createdComment);
			return createdComment;
		};
		const likePost = async (postId, accessTokenUser, likeStatus) => {
			const likePostByUser = await request(server)
				.put(`/posts/${postId}/like-status`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send({
					likeStatus: likeStatus,
				});
			console.log('likePostByUser', likePostByUser.status);
		};
		const likeComment = async (commentId, accessTokenUser, likeStatus) => {
			const likeCommentByUser = await request(server)
				.put(`/comments/${commentId}/like-status`)
				.auth(`${accessTokenUser}`, { type: 'bearer' })
				.send({
					likeStatus: likeStatus,
				});
			console.log('likeCommentByUser', likeCommentByUser.status);
		};
		const getCommentByUser = async (commentId) => {
			const getCommentResponse = await request(server).get(`/comments/${commentId}`);
			const comment = getCommentResponse.body;
			console.log(comment);
			return comment;
		};
		const getAllCommentsForCurrentUserBlogs = async (token) => {
			const getAllCommentResponse = await request(server).get(`/blogger/blogs/comments`).auth(`${token}`, { type: 'bearer' });
			const allComments = getAllCommentResponse.body;
			console.log(allComments);
			return allComments;
		};

		// // scenario
		// await cleanDB();
		// // create user and login
		// const userDto = createUserDTO();
		// const user1 = await createUserBySisAdmin(userDto);
		// const token1 = await loginUser(userDto);
		// // POST => /blogger/blogs
		// const blog1 = await createBlogInDbByBlogger(token1);
		// // POST -> /sa/users,
		// const userDto2 = createUserDTO();
		// const userDto3 = createUserDTO();
		// const userDto4 = createUserDTO();
		// const userDto5 = createUserDTO();
		// const userDto6 = createUserDTO();
		// const user2 = await createUserBySisAdmin(userDto2);
		// const user3 = await createUserBySisAdmin(userDto3);
		// const user4 = await createUserBySisAdmin(userDto4);
		// const user5 = await createUserBySisAdmin(userDto5);
		// const user6 = await createUserBySisAdmin(userDto6);
		// // PUT -> /blogger/users/:id/ban;
		// await banUserInBlog(user2.id, blog1.id, token1);
		// await banUserInBlog(user3.id, blog1.id, token1);
		// await banUserInBlog(user4.id, blog1.id, token1);
		// await banUserInBlog(user5.id, blog1.id, token1);
		// await banUserInBlog(user6.id, blog1.id, token1);
		// // GET -> "blogger/users/blog/:id":
		// // should return status 200; content: banned users array with pagination; used additional methods:
		// const users = await getUsersBannedInBlog(token1, blog1.id);
	});
});
