import { IsNotEmpty, IsNumberString, IsOptional, Length, Matches, Validate } from 'class-validator';
import { BlogExistsValidation } from '../../../validation/blogValidation';

export class PostDTO {
	@Length(1, 30)
	@Matches(/^(?!\s*$).+/)
	@IsNotEmpty()
	title: string;

	@Length(1, 100)
	@IsNotEmpty()
	shortDescription: string;

	@Length(1, 1000)
	@Matches(/^(?!\s*$).+/)
	@IsNotEmpty()
	content: string;

	@Validate(BlogExistsValidation)
	@IsNumberString()
	@IsOptional()
	blogId: string;
}
