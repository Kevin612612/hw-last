import { Matches, Validate } from 'class-validator';
import { EmailAlreadyConfirmedValidation } from '../../validation/userValidation';

export class EmailResendDTO {
	@Validate(EmailAlreadyConfirmedValidation)
	@Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
	email: string;
}
