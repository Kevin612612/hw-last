import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

jest.setTimeout(100000);

//create function for creating random string
export const generateRandomString = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

//create random user
export function createUser() {
	return {
		login: generateRandomString(5) + 'user',
		password: generateRandomString(6),
		email: generateRandomString(10) + '@gmail.com',
	};
}
//create random blog
export function createBlog() {
	return {
		name: generateRandomString(5) + 'user',
		description: generateRandomString(10),
		websiteUrl: 'https://' + generateRandomString(5) + '@gmail.com',
	};
}
//create random post
export function createPost() {
	return {
		content: generateRandomString(5) + 'post',
		shortDescription: 'about' + generateRandomString(10),
		title: 'title' + generateRandomString(5),
		blogId: '0',
	};
}
//create random comment
export function createComment() {
	return {
		content: generateRandomString(15) + ' comment',
	};
}

describe('PostController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('test1', async () => {
		//create 4 users
		//login 4 users
		//ctreate blog
		//create post
		//like post by each user
		//get post by user1

		const users = [];
		const accessTokens = [];
		for (let index = 0; index < 4; index++) {
			users.push(createUser());
		}
		const blog_1 = createBlog();
		const post_1 = createPost();

		//clear data
		const cleanAll = await request(app.getHttpServer()).del(`/testing/all-data`);
		//users
		const user_1Response = await request(app.getHttpServer())
			.post(`/users`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send(users[0]);
		const user_2Response = await request(app.getHttpServer())
			.post(`/users`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send(users[1]);
		const user_3Response = await request(app.getHttpServer())
			.post(`/users`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send(users[2]);
		const user_4Response = await request(app.getHttpServer())
			.post(`/users`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send(users[3]);
		const createdUser1 = user_1Response.body;
		const createdUser2 = user_2Response.body;
		const createdUser3 = user_3Response.body;
		const createdUser4 = user_4Response.body;
		//login users
		const login_1Response = await request(app.getHttpServer()).post(`/auth/login`).send({
			loginOrEmail: users[0].login,
			password: users[0].password,
		});
		const login_2Response = await request(app.getHttpServer()).post(`/auth/login`).send({
			loginOrEmail: users[1].login,
			password: users[1].password,
		});
		const login_3Response = await request(app.getHttpServer()).post(`/auth/login`).send({
			loginOrEmail: users[2].login,
			password: users[2].password,
		});
		const login_4Response = await request(app.getHttpServer()).post(`/auth/login`).send({
			loginOrEmail: users[3].login,
			password: users[3].password,
		});
		const accessTokenUser_1 = login_1Response.body.accessToken;
		const accessTokenUser_2 = login_2Response.body.accessToken;
		const accessTokenUser_3 = login_3Response.body.accessToken;
		const accessTokenUser_4 = login_4Response.body.accessToken;
		accessTokens.push(accessTokenUser_1, accessTokenUser_2, accessTokenUser_3, accessTokenUser_4);

		//blog
		const blogResponse = await request(app.getHttpServer()).post(`/blogs`).auth('admin', 'qwerty', { type: 'basic' }).send(blog_1);
		const createdBlog1 = blogResponse.body;

		//
		post_1.blogId = createdBlog1.id;
		//post
		const postResponse = await request(app.getHttpServer()).post(`/posts`).auth('admin', 'qwerty', { type: 'basic' }).send(post_1);
		const createdPost1 = postResponse.body;

		//like post by users
		for (let i = 0; i < 4; i++) {
			const likePost_1byUsers = await request(app.getHttpServer())
				.put(`/posts/${createdPost1.id}/like-status`)
				.auth(`${accessTokens[i]}`, { type: 'bearer' })
				.send({
					likeStatus: 'Like',
				});
		}

		//get post by user_1
		const getPostResponse = await request(app.getHttpServer())
			.get(`/posts/${createdPost1.id}`)
			.auth(`${accessTokens[0]}`, { type: 'bearer' });
		console.log(getPostResponse.body);
	});

	it('test2', async () => {
		// PUT -> "/posts/:id": should update post by id; status 204;
		// used additional methods: POST -> /blogs, POST -> /posts, GET -> /posts/:id;

		const blog_1 = createBlog();
		const post_1 = createPost();
		// create blog
		const blogResponse = await request(app.getHttpServer()).post(`/blogs`).auth('admin', 'qwerty', { type: 'basic' }).send(blog_1);
		const createdBlog1 = blogResponse.body;
		console.log(createdBlog1);
		// create post
		post_1.blogId = createdBlog1.id;
		const postResponse = await request(app.getHttpServer()).post(`/posts`).auth('admin', 'qwerty', { type: 'basic' }).send(post_1);
		const createdPost1 = postResponse.body;
		console.log(createdPost1);
		// update post
		const postResponseUpdate = await request(app.getHttpServer())
			.put(`/posts/${createdPost1.id}`)
			.auth('admin', 'qwerty', { type: 'basic' })
			.send({
				content: 'content after update',
				shortDescription: 'shortDescription after update',
				title: 'title updated',
				blogId: '5',
			});
		const updatedPost1 = postResponseUpdate;
		console.log(updatedPost1);
		// get post by id
		const getPostResponse = await request(app.getHttpServer()).get(`/posts/${createdPost1.id}`);
		console.log(getPostResponse.body);
	});

	it('test 3', async () => {
		// GET -> "/posts/:postId/comments": create 6 comments then:
		// like comment 1 by user 1, user 2;
		// like comment 2 by user 2, user 3;
		// dislike comment 3 by user 1;
		// like comment 4 by user 1, user 4, user 2, user 3;
		// like comment 5 by user 2, dislike by user 3;
		// like comment 6 by user 1, dislike by user 2.
		// Get the comments by user 1 after all likes ;
		// status 200; content: comments array for post with pagination;
		// used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, PUT -> /posts/:postId/like-status;
		const users = [];
		const responsesUsers = [];
		const createdUsers = [];
		const responsesLogin = [];
		const accessTokens = [];
		const comments = [];
		const responsesComments = [];
		const createdComments = [];

		for (let index = 0; index < 6; index++) {
			users.push(createUser());
		}

		const blog_1 = createBlog();

		const post_1 = createPost();

		for (let i = 0; i < 6; i++) {
			comments.push(createComment());
		}

		//clear data
		const cleanAll = await request(app.getHttpServer()).del(`/testing/all-data`);

		//create 6 users and login
		for (let i = 0; i < 6; i++) {
			responsesUsers.push(
				await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(users[i]),
			);
			createdUsers.push(responsesUsers[i].body);

			responsesLogin.push(
				await request(app.getHttpServer()).post(`/auth/login`).send({
					loginOrEmail: users[i].login,
					password: users[i].password,
				}),
			);
			accessTokens.push(responsesLogin[i].body.accessToken);
		}

		//blog
		const blogResponse = await request(app.getHttpServer()).post(`/blogs`).auth('admin', 'qwerty', { type: 'basic' }).send(blog_1);
		const createdBlog1 = blogResponse.body;

		//post
		post_1.blogId = createdBlog1.id;
		const responsePost = await request(app.getHttpServer()).post(`/posts`).auth('admin', 'qwerty', { type: 'basic' }).send(post_1);
		const createdPost = responsePost.body;

		// create 6 comments
		for (let i = 0; i < 6; i++) {
			responsesComments.push(
				await request(app.getHttpServer())
					.post(`/posts/${createdPost.id}/comments`)
					.auth(`${accessTokens[i]}`, { type: 'bearer' })
					.send(comments[i]),
			);
			createdComments.push(responsesComments[i].body);
		}
		// like comment 1 by user 1, user 2;
		for (let i = 0; i < 2; i++) {
			const likeComment_1byUsers = await request(app.getHttpServer())
				.put(`/comments/1/like-status`)
				.auth(`${accessTokens[i]}`, { type: 'bearer' })
				.send({
					likeStatus: 'Like',
				});
		}
		// like comment 2 by user 2, user 3;
		for (let i = 1; i < 3; i++) {
			const likeComment_2byUsers = await request(app.getHttpServer())
				.put(`/comments/2/like-status`)
				.auth(`${accessTokens[i]}`, { type: 'bearer' })
				.send({
					likeStatus: 'Like',
				});
		}
		// dislike comment 3 by user 1;
		const likeComment_3byUsers = await request(app.getHttpServer())
			.put(`/comments/3/like-status`)
			.auth(`${accessTokens[0]}`, { type: 'bearer' })
			.send({
				likeStatus: 'Dislike',
			});
		// like comment 4 by user 1, user 4, user 2, user 3;
		for (let i = 0; i < 4; i++) {
			const likeComment_4byUsers = await request(app.getHttpServer())
				.put(`/comments/4/like-status`)
				.auth(`${accessTokens[i]}`, { type: 'bearer' })
				.send({
					likeStatus: 'Like',
				});
		}
		// like comment 5 by user 2, dislike by user 3;
		const likeComment_5byUser_2 = await request(app.getHttpServer())
			.put(`/comments/5/like-status`)
			.auth(`${accessTokens[1]}`, { type: 'bearer' })
			.send({
				likeStatus: 'Like',
			});
		const likeComment_5byUser_3 = await request(app.getHttpServer())
			.put(`/comments/5/like-status`)
			.auth(`${accessTokens[2]}`, { type: 'bearer' })
			.send({
				likeStatus: 'Dislike',
			});
		// like comment 6 by user 1, dislike by user 2
		const likeComment_6byUser_1 = await request(app.getHttpServer())
			.put(`/comments/6/like-status`)
			.auth(`${accessTokens[0]}`, { type: 'bearer' })
			.send({
				likeStatus: 'Like',
			});
		const likeComment_6byUser_2 = await request(app.getHttpServer())
			.put(`/comments/6/like-status`)
			.auth(`${accessTokens[1]}`, { type: 'bearer' })
			.send({
				likeStatus: 'Dislike',
			});
		// Get the comments by user 1 after all likes
		const getCommentsResponse = await request(app.getHttpServer())
			.get(`/posts/${createdPost.id}/comments`)
			.auth(`${accessTokens[0]}`, { type: 'bearer' });
		console.log(getCommentsResponse.body.items);
	});
});
