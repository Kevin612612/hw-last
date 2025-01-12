import { Module } from '@nestjs/common';
import { DraftController } from './draft.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../ENTITIES/user/user.schema';
import { UserModule } from '../ENTITIES/user/user.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), UserModule],
	controllers: [DraftController],
	providers: [],
})
export class DraftModule {}
