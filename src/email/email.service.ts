import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../ENTITIES/user/user.repository';

@Injectable()
export class EmailService {
	constructor(
		@Inject(MailerService) private mailerService: MailerService,
		@Inject(UserRepository) private userRepository: UserRepository,
	) {}

	async sendRecoveryCode(email: string) {
		const user = await this.userRepository.findUserByLoginOrEmail(email);
		const recoveryCode = uuidv4();
		const result = await this.userRepository.updateDate(user.id, recoveryCode);
		const message = `<h1>Thank for your registration</h1>
          <p> To finish registration please follow the link below:
              <a href='https://hw-7-sigma.vercel.app/auth/registration-confirmation?code=${recoveryCode}'>complete registration</a>
          </p>`;
		await this.mailerService
			.sendMail({
				to: email, // List of receivers email address
				from: 'kevin6121991@gmail.com', // Senders email address
				subject: 'Confirmation Code', // Subject line
				text: 'Hello', // plaintext body
				html: message, // HTML body content
			})
			.then((success) => {
				console.log(success);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async sendEmailConfirmationMessage(userId: string, email: string, code: string) {
		const updateDate = await this.userRepository.updateDate(userId, code); //update the date when the FIRST CODE was sent
		const message = `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
          <a href='https://hw-13.vercel.app/auth/registration-confirmation?code=${code}'>complete registration</a>
      </p>`;
		return await this.mailerService
			.sendMail({
				to: email, // List of receivers email address
				from: 'kevin6121991@gmail.com', // Senders email address
				subject: 'confirm registration', // Subject line
				text: 'Hello', // plaintext body
				html: message, // HTML body content
			})
			.then((success) => {
				console.log(success);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async sendEmailConfirmationMessageAgain(email: string): Promise<boolean> {
		const user = await this.userRepository.findUserByLoginOrEmail(email); //find user by email
		//if user exists and code is not confirmed and duration between now and moment the code's been created more minute
		if (
			user &&
			user.emailConfirmation.isConfirmed === false && //is not confirmed yet
			new Date() > new Date(new Date(user.emailCodes[user.emailCodes.length - 1].sentAt).getTime() + 1000) //moment the last code has been sent + a minute
		) {
			//build new code
			const newCode = uuidv4();
			const updateCode = await this.userRepository.updateCode(user, newCode);
			const message = `<h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below one more time:
                <a href='https://hw-13.vercel.app/auth/registration-confirmation?code=${newCode}'>complete registration</a>
                </p>`;
			//send email with new code
			const sendEmail = await this.mailerService
				.sendMail({
					to: email, // List of receivers email address
					from: 'kevin6121991@gmail.com', // Senders email address
					subject: 'confirm registration', // Subject line
					text: 'Hello', // plaintext body
					html: message, // HTML body content
				})
				.then((success) => {
					console.log(success);
				})
				.catch((err) => {
					console.log(err);
				});
			return true;
		} else {
			return false;
		}
	}
}
