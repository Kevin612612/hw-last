import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';

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

describe('PostController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('test', async () => {
		// GET -> "/blogs/:blogId/posts": create 6 posts then:
		// like post 1 by user 1, user 2; like post 2 by user 2, user 3; dislike post 3 by user 1;
		// like post 4 by user 1, user 4, user 2, user 3; like post 5 by user 2, dislike by user 3;
		// like post 6 by user 1, dislike by user 2. Get the posts by user 1 after all likes NewestLikes should be sorted in descending;
		// status 200; content: posts array with pagination;
		// used additional methods: POST -> /blogs, POST -> /blogs/:blogId/posts, PUT -> posts/:postId/like-status;

		//create 4 users +
		//login 4 users +
		//ctreate blog +
		//create 6 post +
		//like post 1 by user 1, user 2 +
		//like post 2 by user 2, user 3
		//dislike post 3 by user 1;
		//like post 4 by user 1, user 4, user 2, user 3
		//like post 5 by user 2, dislike by user 3
		//like post 6 by user 1, dislike by user 2
		//get posts by user 1

		const users = [];
		const responsesUsers = [];
		const createdUsers = [];
		const responsesLogin = [];
		const accessTokens = [];
		const posts = [];
		const responsesPosts = [];
		const createdPosts = [];

		for (let index = 0; index < 4; index++) {
			users.push(createUser());
		}

		const blog_1 = createBlog();

		for (let i = 0; i < 6; i++) {
			posts.push(createPost());
		}

		//clear data
		const cleanAll = await request(app.getHttpServer()).del(`/testing/all-data`);
		//create users and login
		for (let i = 0; i < 4; i++) {
			responsesUsers.push(
				await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(users[i]),
			);
			createdUsers.push(responsesUsers[i].body);
			responsesLogin.push(
				await request(app.getHttpServer()).post(`/auth/login`).send({
					loginOrEmail: users[0].login,
					password: users[0].password,
				}),
			);
			accessTokens.push(responsesLogin[i].body.accessToken);
		}

		//blog
		const blogResponse = await request(app.getHttpServer()).post(`/blogs`).auth('admin', 'qwerty', { type: 'basic' }).send(blog_1);
		const createdBlog1 = blogResponse.body;

		//post
		for (let i = 0; i < 6; i++) {
			posts[i].blogId = createdBlog1.id;
			responsesPosts.push(
				await request(app.getHttpServer()).post(`/posts`).auth('admin', 'qwerty', { type: 'basic' }).send(posts[i]),
			);
			createdPosts.push(responsesPosts[i].body);
		}

		//like post 1 by user 1, 2
		for (let i = 0; i < 2; i++) {
			const likePost_1byUsers = await request(app.getHttpServer())
				.put(`/posts/${createdPosts[0].id}/like-status`)
				.auth(`${accessTokens[i]}`, { type: 'bearer' })
				.send({
					likeStatus: 'Like',
				});
		}
		//like post 2 by user 2, user 3
		for (let i = 1; i < 3; i++) {
			const likePost_2byUsers = await request(app.getHttpServer())
				.put(`/posts/${createdPosts[1].id}/like-status`)
				.auth(`${accessTokens[i]}`, { type: 'bearer' })
				.send({
					likeStatus: 'Like',
				});
		}
		//dislike post 3 by user 1;
		const likePost_3byUsers = await request(app.getHttpServer())
			.put(`/posts/${createdPosts[2].id}/like-status`)
			.auth(`${accessTokens[0]}`, { type: 'bearer' })
			.send({
				likeStatus: 'Dislike',
			});
		//like post 4 by user 1, user 4, user 2, user 3
		//like post 5 by user 2, dislike by user 3
		//like post 6 by user 1, dislike by user 2

		//get posts by user 1
		const getPostResponse = await request(app.getHttpServer()).get(`/posts`).auth(`${accessTokens[1]}`, { type: 'bearer' });
		console.log(getPostResponse.body.items);
	});
});
