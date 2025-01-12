import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { appSettings } from '../app.settings';
import { createUserDTO } from '../test/functionsForTesting';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { MailerModule, MailerOptions, MailerService, MailerTransportFactory } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { BlackListRepository } from '../ENTITIES/black_list/blacklist.repository';
import { BlackListDocument } from '../ENTITIES/black_list/blacklist.schema';
import { ObjectId } from 'mongodb';
import { AccessTokenService } from '../ENTITIES/tokens/accesstoken.service';
import { RefreshTokenService } from '../ENTITIES/tokens/refreshtoken.service';

jest.setTimeout(30_000);

describe('integration tests for authService', () => {
	// ################################################################################
	let mongoServer: MongoMemoryServer;
	//let app: INestApplication;

	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();
		await mongoose.connect(mongoUri);
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EmailService,
				{
					provide: MailerService, // Provide the mailer service dependency
					useValue: {
						sendEmail: jest.fn(), // Mock the sendEmail method
					},
				},
			],
		}).compile();

		const emailService = module.get<EmailService>(EmailService);
		const mailerService = module.get<MailerService>(MailerService);

		// app = moduleFixture.createNestApplication();
		// appSettings(app);
		// await app.init();

		const jwtService = new JwtService();
		const configService = new ConfigService();
		const accessTokenService = new AccessTokenService(jwtService, userRepository, configService);
		const refreshTokenService = new RefreshTokenService(
			jwtService,
			refreshTokensRepository,
			blackListRepository,
			userRepository,
			configService,
		);
		const usersService = new UsersService(userRepository, jwtService, emailService);
		const authService = new AuthService(usersService, jwtService, emailService, accessTokenService, refreshTokenService);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
		//await app.close();
	});

	// ################################################################################

	describe('test -> create User', () => {
		it('test1', async () => {
			expect(true).toBe(true);
		});
	});

	it('integration test for authService', async () => {
		expect(true).toBe(true);
	});

	// it('test 1', async () => {
	//   const user = createUser();
	//   const userResponse = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user);
	//   const createdUser = userResponse.body;

	//   //login
	//   const loginResponse = await request(app.getHttpServer()).post(`/auth/login`).send({
	//     loginOrEmail: user.login,
	//     password: user.password,
	//   });
	//   const accessToken = loginResponse.body.accessToken;
	//   const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
	//   console.log('accessToken login:', accessToken);
	//   console.log('refreshToken login:', refreshToken);
	//   //delay
	//   setTimeout(() => {}, 12000);

	//   //new pair of tokens
	//   const res = await request(app.getHttpServer()).post(`/auth/refresh-token`).set('Cookie', `refreshToken=${refreshToken}`);
	//   const newAccessToken = res.body.accessToken;
	//   const newRefreshToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
	//   console.log('newAccessToken:', newAccessToken);
	//   console.log('newRefreshToken', newRefreshToken);
	//   console.log(res.statusCode);

	//   //logout
	//   const res1 = await request(app.getHttpServer())
	//     .post(`/auth/logout`)
	//     .auth(`${newAccessToken}`, { type: 'bearer' })
	//     .set('Cookie', `refreshToken=${newRefreshToken}`);
	//   console.log(res1.statusCode);
	// });

	// it('auth/me', async () => {
	// 	//create user
	// 	const user = createUserDTO();
	// 	const userResponse = await request(app.getHttpServer()).post(`/users`).auth('admin', 'qwerty', { type: 'basic' }).send(user);
	// 	const createdUser = userResponse.body;
	// 	console.log('created user:', createdUser);

	// 	//login
	// 	const loginResponse = await request(app.getHttpServer()).post(`/auth/login`).send({
	// 		loginOrEmail: user.login,
	// 		password: user.password,
	// 	});
	// 	const accessToken = loginResponse.body.accessToken;
	// 	const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
	// 	console.log('accessToken login:', accessToken);
	// 	console.log('refreshToken login:', refreshToken);

	// 	//delay
	// 	//setTimeout(() => {}, 11000);

	// 	//auth/me
	// 	const res1 = await request(app.getHttpServer()).get(`/auth/me`).auth(`${accessToken}`, { type: 'bearer' });
	// 	console.log(res1.statusCode);
	// 	console.log(res1.body);
	// });
});
