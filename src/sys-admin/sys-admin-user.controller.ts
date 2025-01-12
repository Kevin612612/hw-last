import { UseGuards, Controller, Inject, HttpCode, HttpStatus, Put, Param, Body, Query, Get, Post, Delete } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { LogClassName } from '../decorators/logger.decorator';
import { UserIdDTO } from '../dto/id.dto';
import { QueryUserDTO } from '../dto/query.dto';
import { BanDTO, UserDTO } from '../ENTITIES/user/dto/userInputDTO';
import { AuthGuardBasic } from '../guards/authBasic.guard';
import { UserTypeSchema, UserViewType } from '../types/users';
import { UsersService } from '../ENTITIES/user/user.service';

@SkipThrottle()
@UseGuards(AuthGuardBasic)
@Controller('sa/users')
export class SysAdminUsersController {
	constructor(@Inject(UsersService) protected usersService: UsersService) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Put('/:userId/ban')
	@LogClassName()
	async banUser(@Param() userId: UserIdDTO, @Body() banDTO: BanDTO) {
		return await this.usersService.banUser(userId.userId, banDTO);
	}

	@Get()
	@LogClassName()
	async getAll(@Query() query: QueryUserDTO): Promise<UserTypeSchema> {
		return await this.usersService.findAll(query);
	}

	@Post()
	@LogClassName()
	async createUser(@Body() dto: UserDTO): Promise<UserViewType | string[]> {
		return await this.usersService.createUser(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:userId')
	@LogClassName()
	async deleteUserById(@Param() params: UserIdDTO): Promise<boolean> {
		return await this.usersService.deleteUserById(params.userId);
	}
}
