import { ObjectId } from 'mongodb';

export class BlackList {
	public _id: ObjectId;
	public refreshTokens: string[];
	public __v: number;

	constructor() {
		this._id = new ObjectId();
		this.refreshTokens = [];
		this.__v = 0;
	}
}
