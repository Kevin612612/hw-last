import { BanInfoType } from '../../types/users.d';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { CodeDataType, UserAccountDataType, ConformationType, TokenType } from '../../types/users';
import { UserRepository } from './user.repository';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from './dto/userInputDTO';
import { JwtService } from '@nestjs/jwt';

export class User {
	public _id: ObjectId;
	public id: string;
	public accountData: UserAccountDataType;
	public emailConfirmation: ConformationType;
	public emailCodes: CodeDataType[];
	public passwordConfirmation: ConformationType;
	public passwordCodes: CodeDataType[];
	public tokens: {
		accessTokens: TokenType[];
		refreshTokens: TokenType[];
	};
	public banInfo: BanInfoType;
	public __v: number;

	constructor(
		@Inject(UserRepository) private userRepository: UserRepository,
		@Inject(JwtService) private jwtService: JwtService,
		id = 'no id', //default value before calling addAsyncParams method async
		login = 'no login',
		email = 'no email',
		passwordSalt = 'no salt', //default value before calling addAsyncParams method async
		passwordHash = 'no hash', //default value before calling addAsyncParams method async
	) {
		this._id = new ObjectId();
		this.id = id;
		this.accountData = {
			login: login,
			email: email,
			passwordSalt: passwordSalt,
			passwordHash: passwordHash,
			createdAt: new Date().toISOString(),
		};
		this.emailConfirmation = {
			confirmationCode: this.generateCode(),
			expirationDate: this.addTime(12, 0, 0),
			isConfirmed: false,
		};
		this.emailCodes = [
			{
				code: this.emailConfirmation.confirmationCode,
				sentAt: new Date().toISOString(),
			},
		];
		this.passwordConfirmation = {
			confirmationCode: this.generateCode(),
			expirationDate: this.addTime(12, 0, 0),
			isConfirmed: false,
		};
		this.passwordCodes = [
			{
				code: this.passwordConfirmation.confirmationCode,
				sentAt: new Date().toISOString(),
			},
		];
		this.tokens = {
			accessTokens: [],
			refreshTokens: [],
		};
		this.banInfo = {
			isBanned: false,
			banDate: null,
			banReason: null,
		};
		this.__v = 0;
	}

	public async addAsyncParams(dto: UserDTO) {
		const userId = await this.userRepository.createUserId();
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(dto.password, salt);
		return new User(this.userRepository, this.jwtService, userId, dto.login, dto.email, salt, hash);
	}

	private generateCode() {
		// return Math.floor(Math.random() * 10000).toString();
		return uuidv4();
	}

	private addTime(hours = 0, minutes = 0, seconds = 0) {
		const newDate = new Date();
		newDate.setHours(newDate.getHours() + hours);
		newDate.setMinutes(newDate.getMinutes() + minutes);
		newDate.setSeconds(newDate.getSeconds() + seconds);
		return newDate.toISOString();
	}
}
