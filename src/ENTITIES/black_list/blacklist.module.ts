import { Module } from '@nestjs/common';
import { BlackListRepository } from './blacklist.repository';
import { BlackListService } from './blacklist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlackList, BlackListSchema } from './blacklist.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: BlackList.name, schema: BlackListSchema }])],
	controllers: [],
	providers: [BlackListService, BlackListRepository],
	exports: [BlackListService, BlackListRepository],
})
export class BlackListModule {}
