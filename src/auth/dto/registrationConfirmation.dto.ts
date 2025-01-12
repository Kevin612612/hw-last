import { Validate } from 'class-validator';
import { CodeAlreadyConfirmedValidation } from '../../validation/userValidation';

export class CodeConfirmationDTO {
	@Validate(CodeAlreadyConfirmedValidation)
	code: string;
}
