import { BlackListModule } from '../ENTITIES/black_list/blacklist.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import {
	UserExistsByLoginOrEmailValidation,
	UserExistsByLoginValidation,
	UserExistsByEmailValidation,
	EmailAlreadyConfirmedValidation,
	BannedUserValidation,
} from '../validation/userValidation';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenSchema } from '../ENTITIES/tokens/refreshtoken.schema';
import { TokenModule } from '../ENTITIES/tokens/tokens.module';
import { UserModule } from '../ENTITIES/user/user.module';
import { UserSchema } from '../ENTITIES/user/user.schema';

@Module({
	imports: [
		UserModule,
		BlackListModule,
		EmailModule,
		TokenModule,
		JwtModule.registerAsync({
			global: true,
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
			}),
			inject: [ConfigService],
		}),
		MongooseModule.forFeature([
			{ name: 'User', schema: UserSchema },
			{ name: 'RefreshToken', schema: RefreshTokenSchema },
		]),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserExistsByLoginOrEmailValidation,
		UserExistsByLoginValidation,
		UserExistsByEmailValidation,
		EmailAlreadyConfirmedValidation,
		BannedUserValidation,
	],
	exports: [AuthService],
})
export class AuthModule {}
