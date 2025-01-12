import { IsBoolean, IsNotEmpty, IsString, Length, Matches, MinLength, Validate } from 'class-validator';
import { BlogExistsValidation } from '../../../validation/blogValidation';

export class BlogDTO {
	@IsString()
	@Matches(/^(?!\s*$).+/)
	@Length(1, 15)
	@IsNotEmpty()
	name: string;

	@Length(0, 500)
	description: string;

	@Length(0, 100)
	@Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
	websiteUrl: string;
}

export class BlogBanDTO {
	@IsBoolean()
	isBanned: boolean;
}

export class BlogUserBanDTO {
	@IsBoolean()
	isBanned: boolean;

	@MinLength(20)
	banReason: string;

	@Validate(BlogExistsValidation)
	blogId: string;
}
