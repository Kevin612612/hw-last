import { Inject, Injectable } from '@nestjs/common';
import { UserDTO, BanDTO } from './dto/userInputDTO';
import { UserDataType, UserTypeSchema, UserViewType } from '../../types/users';
import { UserRepository } from './user.repository';
import { QueryUserDTO, SortDirectionEnum } from '../../dto/query.dto';
import { User } from './user.class';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../email/email.service';
import { paging } from '../../secondary functions/paging';
import { PageParamsType } from '../../types';

//(1) findAll
//(2) createUser
//(3) deleteUserById
//(4) confirmCodeFromEmail
//(5) updatePassword
//(6) newRegisteredUser
//(7) banUser

@Injectable()
export class UsersService {
	constructor(
		@Inject(UserRepository) protected userRepository: UserRepository,
		@Inject(JwtService) private jwtService: JwtService,
		@Inject(EmailService) private emailService: EmailService,
	) {}

	async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDataType | undefined> {
		return await this.userRepository.findUserByLoginOrEmail(loginOrEmail);
	}

	//(1) this method returns all users
	async findAll(query: QueryUserDTO): Promise<UserTypeSchema> {
		const pageParams: PageParamsType = {
			sortBy: query.sortBy ? `accountData.${query.sortBy}` : 'accountData.createdAt',
			sortDirection: query.sortDirection || SortDirectionEnum.desc,
			pageNumber: +query.pageNumber || 1,
			searchLoginTerm: query.searchLoginTerm || '',
			searchEmailTerm: query.searchEmailTerm || '',
			pageSize: +query.pageSize || 10,
			banStatus: query.banStatus || 'all',
		};

		if (query.sortBy === 'id') pageParams.sortBy = 'id'; //for other cases add 'accountData. ...'

		// define filter for repository
		const filterConditions = [];
		if (pageParams.searchLoginTerm)
			filterConditions.push({ 'accountData.login': { $regex: pageParams.searchLoginTerm, $options: 'i' } });
		if (pageParams.searchEmailTerm)
			filterConditions.push({ 'accountData.email': { $regex: pageParams.searchEmailTerm, $options: 'i' } });
		const filter = filterConditions.length > 0 ? { $or: filterConditions } : {};

		const users = await this.userRepository.findAll(filter, pageParams.sortBy, pageParams.sortDirection);
		//transform data type into view type
		let usersResultView: UserViewType[] = users.map((obj) => {
			return {
				id: obj.id,
				login: obj.accountData.login,
				email: obj.accountData.email,
				createdAt: obj.accountData.createdAt,
				banInfo: obj.banInfo,
			};
		});
		//sorting
		const order = pageParams.sortDirection == SortDirectionEnum.desc ? -1 : 1;
		if (pageParams.sortBy == 'createdAt') {
			usersResultView = usersResultView.sort((a, b) => {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				return (dateA.getTime() - dateB.getTime()) * order;
			});
		}
		//take either banned or unbanned or all users
		if (pageParams.banStatus == 'banned') {
			usersResultView = usersResultView.filter((el) => el.banInfo.isBanned == true);
		}
		if (pageParams.banStatus == 'notBanned') {
			usersResultView = usersResultView.filter((el) => el.banInfo.isBanned == false);
		}

		return paging(pageParams, usersResultView, usersResultView.length);
	}

	//(2) method creates user
	async createUser(dto: UserDTO): Promise<UserViewType | string[]> {
		//create new user
		let newUser = new User(this.userRepository, this.jwtService); //empty user
		newUser = await newUser.addAsyncParams(dto); // fill user with async params
		// put this new user into db
		try {
			const result = await this.userRepository.createUser(newUser);
			return {
				id: result.id,
				login: result.accountData.login,
				email: result.accountData.email,
				createdAt: result.accountData.createdAt,
				banInfo: result.banInfo,
			};
		} catch (err: unknown) {
			// throw new Exception()
			const validationErrors = [];
			if (err instanceof mongoose.Error.ValidationError) {
				for (const path in err.errors) {
					//path: accountData.login, accountData.email
					const error = err.errors[path].message;
					validationErrors.push(error);
				}
			}
			return validationErrors;
		}
	}

	//(3) method deletes user by ID
	async deleteUserById(userId: string): Promise<boolean> {
		return await this.userRepository.deleteUserById(userId);
	}

	//(4) confirm code
	async confirmCodeFromEmail(code: string): Promise<boolean> {
		const user = await this.userRepository.findUserByCode(code);
		//check if user exists and email is not confirmed yet and code is not expired
		if (user && user.emailConfirmation.isConfirmed !== true && new Date(user.emailConfirmation.expirationDate) > new Date()) {
			return await this.userRepository.updateStatus(user);
		}
		return false;
	}

	//(5) update password
	async updatePassword(userId: string, newPassword: string): Promise<number> {
		const newPasswordSalt = await bcrypt.genSalt();
		const newPasswordHash = await bcrypt.hash(newPassword, 10);
		const result = await this.userRepository.updateSaltAndHash(userId, newPasswordSalt, newPasswordHash);
		return 204;
	}

	//(6) method registers user
	async newRegisteredUser(dto: UserDTO): Promise<UserViewType | number> {
		//create new user
		let newUser = new User(this.userRepository, this.jwtService); //empty user
		newUser = await newUser.addAsyncParams(dto); // fill user with async params
		const createdUser = await this.userRepository.createUser(newUser);

		//send email from our account to this user's email
		try {
			const sendEmail = await this.emailService.sendEmailConfirmationMessage(
				createdUser.id,
				createdUser.accountData.email,
				createdUser.emailConfirmation.confirmationCode,
			);
			return {
				id: `user with id ${newUser.id} and email ${createdUser.accountData.email} has received a letter with code`,
				login: createdUser.accountData.login,
				email: createdUser.accountData.email,
				createdAt: createdUser.accountData.createdAt,
				banInfo: createdUser.banInfo,
			};
		} catch (error) {
			return 400; //email hasn't been sent
		}
	}

	//(7) method bans user
	async banUser(userId: string, banDTO: BanDTO) {
		if (banDTO.isBanned === true) {
			return await this.userRepository.banUser(userId, banDTO.banReason);
		} else {
			return await this.userRepository.unbanUser(userId);
		}
	}
}
