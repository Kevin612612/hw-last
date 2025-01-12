import { ObjectId } from 'mongodb';

export enum Role {
	sisAdmin = 'sisAdmin',
	blogger = 'blogger',
	user = 'user',
}

export type RoleType = keyof typeof Role;

type CodeDataType = {
	code: string;
	sentAt: string;
};

type TokenType = {
	value: string;
	createdAt: string;
	expiredAt: string;
};

export type UserAccountDataType = {
	login: string;
	email: string;
	passwordSalt;
	passwordHash;
	createdAt: string;
};

export type ConformationType = {
	confirmationCode: string;
	expirationDate: string;
	isConfirmed: boolean;
};

export type BanInfoType = {
	isBanned: boolean;
	banDate: string;
	banReason: string;
};

//################################################################################################################

//USER VIEW TYPE
export type UserViewType = {
	id: string;
	login: string;
	email: string;
	createdAt: string;
	banInfo: BanInfoType;
};

//USER DATA TYPE
export type UserDataType = {
	_id: ObjectId;
	id: string;
	accountData: UserAccountDataType;
	emailConfirmation: ConformationType;
	emailCodes: CodeDataType[];
	passwordConfirmation: ConformationType;
	passwordCodes: CodeDataType[];
	tokens: {
		accessTokens: TokenType[];
		refreshTokens: TokenType[];
	};
	banInfo: BanInfoType;
	__v: number;
};

//USER PAGING TYPE
export type UserTypeSchema = PageTypeSchema<UserViewType>;
