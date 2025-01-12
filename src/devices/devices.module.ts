import { Module } from '@nestjs/common';
import { RefreshToken, RefreshTokenSchema } from '../ENTITIES/tokens/refreshtoken.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '../ENTITIES/tokens/tokens.module';
import { RefreshTokensRepository } from '../ENTITIES/tokens/refreshtoken.repository';
import { RefreshTokenService } from '../ENTITIES/tokens/refreshtoken.service';
import { DevicesController } from './devices.controller';
import { BlackListModule } from '../ENTITIES/black_list/blacklist.module';
import { UserModule } from '../ENTITIES/user/user.module';
import { DeviceExistsValidation } from '../validation/deviceValidation';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
		UserModule,
		TokenModule,
		BlackListModule,
	],
	controllers: [DevicesController],
	providers: [RefreshTokenService, RefreshTokensRepository, DeviceExistsValidation],
	exports: [],
})
export class DevicesModule {}
