import { ObjectId } from 'mongodb';

export enum Assess {
	Like = 'Like',
	Dislike = 'Dislike',
	None = 'None',
}

export type UserAssessType = {
	userIdLike: string;
	assess: keyof typeof Assess;
};

export type CommentatorInfoType = {
	userId: string;
	userLogin: string;
};

export type LikesInfoType = {
	dislikesCount: number;
	likesCount: number;
	myStatus: string;
};

//################################################################################################################

//COMMENT VIEW TYPE
export type CommentViewType = {
	postInfo?: { id: string; title: string; blogId: string; blogName: string };
	id: string;
	content: string;
	commentatorInfo: CommentatorInfoType;
	createdAt: string;
	likesInfo: LikesInfoType;
};

//COMMENT DATA VIEW TYPE
export type CommentDataViewType = CommentViewType & {
	postId: string;
	userAssess: UserAssessType[];
};

//COMMENT DATA TYPE
export type CommentDataType = CommentViewType & {
	_id: ObjectId;
	postId: string;
	userAssess: UserAssessType[];
	__v: number;
};

//COMMENT PAGING TYPE
export type CommentsTypeSchema = PageTypeSchema<CommentViewType | CommentDataViewType>;
