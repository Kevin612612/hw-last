import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CommentRepository } from '../ENTITIES/comment/comment.repository';
import { LogClassName } from '../decorators/logger.decorator';

@ValidatorConstraint({ name: 'CommentExists', async: true })
@Injectable()
export class CommentExistsValidation implements ValidatorConstraintInterface {
	constructor(@Inject(CommentRepository) private commentRepository: CommentRepository) {}

	@LogClassName()
	async validate(value: string) {
		const comment = await this.commentRepository.findCommentById(value);
		if (!comment) {
			throw new NotFoundException(["Comment doesn't exist"]);
		}
		return true;
	}

	defaultMessage() {
		return `Comment doesn't exist`;
	}
}
