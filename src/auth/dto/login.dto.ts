import { Length, Validate } from 'class-validator';
import { BannedUserValidation, UserExistsByLoginOrEmailValidation } from '../../validation/userValidation';

export class LoginDTO {
	@Validate(BannedUserValidation)
	@Validate(UserExistsByLoginOrEmailValidation)
	@Length(1, 10)
	loginOrEmail: string;

	@Length(1, 10)
	password: string;
}
