import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type BlackListDocument = HydratedDocument<BlackList>;

@Schema()
export class BlackList {
	@Prop({ type: ObjectId, required: true, default: new ObjectId() })
	_id: ObjectId;

	@Prop({ required: true, default: [] })
	refreshTokens: string[];

	@Prop({ versionKey: true })
	__v: number;
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList);
