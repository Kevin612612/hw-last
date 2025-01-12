import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { createUser } from '../ENTITIES/entity_blog/blog.controller.spec';

jest.setTimeout(100000);

describe('UserController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('create user', async () => {
		//create user
		const user = createUser();
		//expected result
		const expectedResult = {
			id: expect.any(String),
			login: user.login,
			email: user.email,
			createdAt: expect.any(String),
		};
		//response
		const response = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user);
		const createdUser1 = response.body;
		console.log(createdUser1);
	});
});
