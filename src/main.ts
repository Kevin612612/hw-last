import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSettings } from './app.settings';
import { Logger } from '@nestjs/common';
import { preliminaryActions } from './pre-operations';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

/*
 * ENTRANCE INTO THE APP
 */

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    appSettings(app);

    const configService: ConfigService = await app.get(ConfigService);
    const port = (await configService.get<number>('PORT')) || 3002;
    // Получаем путь к сервисному файлу из переменной окружения 'SA_KEY' в файле .env
    const accountPath = configService.get<string>('SA_KEY');

    // Читаем содержимое файла по указанному пути и парсим его как JSON
    // Типизацию данных в serviceAccount можно уточнить, если известно, какие данные ожидаются, но в данном случае используется `any`
    const serviceAccount: any = JSON.parse(fs.readFileSync(accountPath, 'utf8'));

    // Создаём объект конфигурации для Firebase Admin SDK, извлекая необходимые данные из serviceAccount
    const adminConfig: admin.ServiceAccount = {
        projectId: serviceAccount.project_id, // Идентификатор проекта Firebase
        privateKey: serviceAccount.private_key, // Приватный ключ для аутентификации
        clientEmail: serviceAccount.client_email, // Email клиента для авторизации
    };

    // Инициализируем Firebase Admin SDK с использованием созданной конфигурации
    admin.initializeApp({
        credential: admin.credential.cert(adminConfig), // Указываем учетные данные (сервисный аккаунт)
        databaseURL: `https://${adminConfig.projectId}.firebaseio.com`, // URL базы данных проекта Firebase
    });

    //preliminaryActions(app);

    await app.listen(port, () => {
        new Logger('Bootstrap').log(`##########################################################\n
                                    App started listening on port ${port} at ${new Date().toISOString()}\n
                                    ##########################################################\n`);
    });
}

bootstrap();
