import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { LogClassName } from '../decorators/logger.decorator';
import { RefreshTokensRepository } from '../ENTITIES/tokens/refreshtoken.repository';

@ValidatorConstraint({ name: 'DeviceExists', async: true })
@Injectable()
export class DeviceExistsValidation implements ValidatorConstraintInterface {
	constructor(@Inject(RefreshTokensRepository) private refreshTokensRepository: RefreshTokensRepository) {}

	@LogClassName()
	async validate(value: string) {
		const token = (await this.refreshTokensRepository.findTokenByDeviceId(value)) || null;
		if (!token) {
			throw new NotFoundException(["Device doesn't exist"]);
		}
		return true;
	}

	defaultMessage() {
		return `Device doesn't exist`;
	}
}
