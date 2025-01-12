import { Length } from 'class-validator';

export class CommentDTO {
	@Length(20, 300)
	content: string;
}
