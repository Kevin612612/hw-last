import { Controller, Get, Inject } from '@nestjs/common';
import { UserRepository } from '../ENTITIES/user/user.repository';

@Controller('draft')
export class DraftController {
	constructor(@Inject(UserRepository) protected userRepository: UserRepository) {}

	@Get()
	async getSomething() {
		return await this.userRepository.findAll({});
	}
}
