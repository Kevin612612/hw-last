import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './ENTITIES/blog/blog.module';
import { EmailModule } from './email/email.module';
import { CommentsModule as CommentModule } from './ENTITIES/comment/comment.module';
import { BlackListModule } from './ENTITIES/black_list/blacklist.module';
import { DevicesModule } from './devices/devices.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MyInterceptor } from './interceptors/logger.interceptor';
import { SysAdminModule } from './sys-admin/sys-admin.module';
import { BloggerModule } from './blogger/blogger.module';
import { DatabaseModule } from './database/database.module';
import { DraftModule } from './draft/draft.module';
import DatabaseConfiguration from './config/database.config';
import { PostModule } from './ENTITIES/post/post.module';
import { TokenModule } from './ENTITIES/tokens/tokens.module';
import { UserModule } from './ENTITIES/user/user.module';
import { getEnvFile } from './environments/env';

const entityModules = [UserModule, BlogModule, PostModule, CommentModule, TokenModule, BlackListModule];
const rolesModules = [SysAdminModule, BloggerModule];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `src/environments/${getEnvFile()}`,
            load: [DatabaseConfiguration, , ],
            validationSchema: Joi.object({
                PORT: Joi.number().default(3000).required(),
                MONGO_URL: Joi.string().required(),
                NODE_ENV: Joi.string().default('development').valid('development', 'production', 'deployment'),
            }),
        }), //add first
        CqrsModule.forRoot(),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGO_URL'),
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        EmailModule,
        CacheModule.register({ isGlobal: false }),
        DevicesModule,
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3,
            },
            {
                name: 'medium',
                ttl: 10000,
                limit: 20,
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100,
            },
        ]),
        ...rolesModules,
        ...entityModules,
        DatabaseModule,
        DraftModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    // 	consumer
    // 		.apply(PutRequestIntoCacheMiddleware, CheckRequestNumberMiddleware)
    // 		.forRoutes('/auth/registration-confirmation', '/auth/registration-email-resending', '/auth/login', '/auth/registration')
    // }
}
