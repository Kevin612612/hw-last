import { Length } from 'class-validator';

export class NewPasswordDTO {
	recoveryCode: string;

	@Length(1, 10)
	newPassword: string;
}
