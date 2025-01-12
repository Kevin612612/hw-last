import { Length } from 'class-validator';

export class passwordRecoveryDTO {
	@Length(1, 20)
	email: string;
}
