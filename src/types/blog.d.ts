import { ObjectId } from 'mongodb';

export type BlogOwnerInfoType = { userId: string; userLogin: string };

export type BlogBanInfoType = {
	isBanned: boolean;
	banDate: string;
};

export type UsersBanInfoType = {
	id: string;
	login: string;
	banInfo: {
		isBanned: boolean;
		banDate: Date;
		banReason: string;
	};
};

//################################################################################################################

//BLOG VIEW TYPE
export type BlogViewType = {
	id: string;
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: string;
	isMembership: boolean;
};

//BLOG DATA VIEW TYPE
export type BlogDataViewType = BlogViewType & {
	blogOwnerInfo: BlogOwnerInfoType;
	banInfo: BlogBanInfoType;
	usersBanInfo: UsersBanInfoType[];
};

//BLOG DATA VIEW TYPE FOR SYSADMIN
export type BlogDataViewTypeSA = BlogViewType & {
	blogOwnerInfo: BlogOwnerInfoType;
	banInfo: BlogBanInfoType;
};

//BLOG DATA TYPE
export type BlogDataType = BlogDataViewType & {
	_id: ObjectId;
	__v: number;
};

//BLOG PAGING TYPE
export type BlogTypeSchema = PageTypeSchema<BlogViewType | BlogDataViewType>;
