import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { UserModule } from '../ENTITIES/user/user.module';

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: async (config: ConfigService) => ({
				transport: {
					// host: config.get('MAIL_HOST'),
					host: 'smtp.gmail.com',
					secure: false,
					auth: {
						// user: config.get('SMTP_USERNAME'),
						user: 'kevin6121991@gmail.com',
						// pass: config.get('SMTP_PASSWORD'),
						pass: 'tmzgxltijltxyikc',
					},
				},
				defaults: {
					// from: `"Nice App" <${config.get('SMTP_USERNAME')}>`,
					from: `"Nice App" <kevin6121991@gmail.com>`,
				},
				// template: {
				//   dir: join(__dirname, 'templates'),
				//   adapter: new EjsAdapter(),
				//   options: {
				//     strict: false,
				//   },
				// },
			}),
			inject: [ConfigService],
		}),
		UserModule,
	],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
