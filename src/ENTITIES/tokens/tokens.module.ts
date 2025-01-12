import { Module } from '@nestjs/common';
import { RefreshTokensRepository } from './refreshtoken.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './refreshtoken.schema';
import { RefreshTokenService } from './refreshtoken.service';
import { AccessTokenService } from './accesstoken.service';
import { UserRepository } from '../user/user.repository';
import { User, UserSchema } from '../user/user.schema';
import { BlackListModule } from '../black_list/blacklist.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: RefreshToken.name, schema: RefreshTokenSchema },
			{ name: User.name, schema: UserSchema },
		]),
		BlackListModule,
	],
	providers: [AccessTokenService, RefreshTokenService, RefreshTokensRepository, UserRepository],
	exports: [AccessTokenService, RefreshTokenService, RefreshTokensRepository],
})
export class TokenModule {}
