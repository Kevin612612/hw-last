import { UserDataType } from './users';
import { BlogDataType } from './blog';
import { PostDataType } from './post';
import { SortDirectionEnum } from '../dto/query.dto';

//expanding type Request
declare global {
	namespace Express {
		export interface Request {
			user: UserDataType | undefined | null;
			blog: BlogDataType | undefined | null;
			post: PostDataType | undefined | null;
			useragent: string | string[] | undefined;
			device: unknown;
			bot: unknown;
			resultClient: unknown;
			resultOs: unknown;
			result: unknown;
			userId: string;
		}
	}
}

//APIErrorResult
export type errors = { errorsMessages: fieldError[] };
type fieldError = { message: string; field: string };

//Page Type Schema
export type PageTypeSchema<T> = {
	pagesCount: number;
	page: number;
	pageSize: number;
	totalCount: number;
	items: T[];
};

export type PageParamsType = {
	sortBy: string;
	sortDirection: SortDirectionEnum;
	pageNumber: number;
	pageSize: number;
	searchNameTerm?: string | RegExp;
	searchLoginTerm?: string | RegExp;
	searchEmailTerm?: string | RegExp;
	banStatus?: string | RegExp;
};
