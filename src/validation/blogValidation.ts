import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BlogRepository } from '../ENTITIES/blog/blog.repository';
import { LogClassName } from '../decorators/logger.decorator';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsValidation implements ValidatorConstraintInterface {
	constructor(@Inject(BlogRepository) private blogRepository: BlogRepository) {}

	@LogClassName()
	async validate(value: string) {
		const blog = await this.blogRepository.getBlogById(value);
		if (!blog) {
			throw new NotFoundException(["Blog doesn't exist"]);
		}
		return true;
	}

	defaultMessage() {
		return `Blog doesn't exist`;
	}
}

@ValidatorConstraint({ name: 'BlogHasOwner', async: true })
@Injectable()
export class BlogHasOwnerValidation implements ValidatorConstraintInterface {
	constructor(@Inject(BlogRepository) private blogRepository: BlogRepository) {}

	@LogClassName()
	async validate(value: string) {
		const blog = await this.blogRepository.getBlogById(value);
		if (!blog) {
			throw new NotFoundException(["Blog doesn't exist"]);
		}
		if (blog.blogOwnerInfo.userLogin) {
			throw new BadRequestException([{ message: 'Blog has already owner', field: 'blogId' }]);
		}
		return true;
	}

	defaultMessage() {
		return `Blog has already owner`;
	}
}
