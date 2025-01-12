import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { LogClassName } from '../decorators/logger.decorator';
import { getClassName } from '../secondary functions/getFunctionName';
import { UserRepository } from '../ENTITIES/user/user.repository';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserById(value);

		if (!user) {
			throw new NotFoundException(["User doesn't exist"]);
		}
		return true;
	}

	defaultMessage() {
		return `User doesn't exist`;
	}
}

@ValidatorConstraint({ name: 'UserExistsByLoginOrEmail', async: true })
@Injectable()
export class UserExistsByLoginOrEmailValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserByLoginOrEmail(value);
		if (!user) throw new UnauthorizedException();
		return true;
	}

	defaultMessage() {
		return `User with such login or email doesn't exist`;
	}
}

@ValidatorConstraint({ name: 'UserExistsByLogin', async: true })
@Injectable()
export class UserExistsByLoginValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserByLogin(value);
		if (user) {
			throw new BadRequestException([{ message: 'User with such login already exists', field: 'login' }]);
		}
		return true;
	}

	defaultMessage() {
		return `User with such login already exists`;
	}
}

@ValidatorConstraint({ name: 'UserExistsByEmail', async: true })
@Injectable()
export class UserExistsByEmailValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserByEmail(value);
		if (user) {
			throw new BadRequestException([{ message: 'User with such email already exists', field: 'email' }]);
		}
		return true;
	}

	defaultMessage() {
		return `User with such email already exists`;
	}
}

@ValidatorConstraint({ name: 'CodeAlreadyConfirmed', async: true })
@Injectable()
export class CodeAlreadyConfirmedValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserByCode(value);
		if (!user) {
			throw new BadRequestException([{ message: "User doesn't exist ", field: 'code' }]);
		}
		if (user.emailConfirmation.isConfirmed === true) {
			throw new BadRequestException([{ message: 'User already confirmed', field: 'code' }]);
		}
		return true;
	}

	defaultMessage() {
		return `User already confirmed or doesn't exist`;
	}
}

@ValidatorConstraint({ name: 'EmailAlreadyConfirmed', async: true })
@Injectable()
export class EmailAlreadyConfirmedValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserByEmail(value);

		if (!user) {
			throw new BadRequestException([{ message: "User doesn't exist ", field: 'email' }]);
		}
		if (user.emailConfirmation.isConfirmed === true) {
			throw new BadRequestException([{ message: 'User already confirmed', field: 'email' }]);
		}
		return true;
	}

	defaultMessage() {
		return `User already confirmed or doesn't exist`;
	}
}

@ValidatorConstraint({ name: 'BannedUser', async: true })
@Injectable()
export class BannedUserValidation implements ValidatorConstraintInterface {
	constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

	@LogClassName()
	async validate(value: string) {
		const user = await this.userRepository.findUserByLoginOrEmail(value);
		if (user?.banInfo.isBanned === true) throw new UnauthorizedException();
		return true;
	}

	defaultMessage() {
		return `User is banned`;
	}
}
