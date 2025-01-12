// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
// import { UsersController } from 'src/user/users.controller';
// import { UsersService } from 'src/user/users.service';
// import { AppController } from 'src/app.controller';
// import { AppService } from 'src/app.service';
// import { BloggerController } from 'src/blog/blog.controller';
// import { BlogRepository } from 'src/blog/blog.repository';
// import { BlogService } from 'src/blog/blog.service';
// import { PostController } from 'src/post/post.controller';
// import { PostRepository } from 'src/post/post.repository';
// import { PostService } from 'src/post/post.service';
// import { UserRepository } from 'src/user/users.repository';
// import { BlogExistsValidation } from 'src/validation/validation';

// describe(' (e2e)', () => {
//   let app: INestApplication;
//   let controller: UsersController;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//       controllers: [AppController, UsersController, BloggerController, PostController],
//       providers: [
//         AppService,
//         UsersService,
//         UserRepository,
//         BlogService,
//         BlogRepository,
//         PostService,
//         PostRepository,
//         BlogExistsValidation,
//       ],
//     }).compile();

//     controller = moduleFixture.get<UsersController>(UsersController);
//   });

//   it(`/GET blogs`, () => {
//     const response = request(app.getHttpServer()).get('/blogs');

//     console.log(response);
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
