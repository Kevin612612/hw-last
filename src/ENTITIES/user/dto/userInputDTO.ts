import { IsBoolean, Length, Matches, MinLength, Validate } from 'class-validator';
import { UserExistsByLoginValidation, UserExistsByEmailValidation } from '../../../validation/userValidation';

export class UserDTO {
	@Validate(UserExistsByLoginValidation)
	@Length(3, 10)
	@Matches('^[a-zA-Z0-9_-]*$')
	login: string;

	@Length(6, 20)
	password: string;

	@Validate(UserExistsByEmailValidation)
	@Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
	email: string;
}

export class BanDTO {
	@IsBoolean()
	isBanned: boolean;

	@MinLength(20)
	banReason: string;
}
