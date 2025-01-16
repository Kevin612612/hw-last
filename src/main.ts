import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSettings } from './app.settings';
import { Logger } from '@nestjs/common';
import { preliminaryActions } from './pre-operations';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { initializeFirebase } from './app.firebase';

/*
 * ENTRANCE INTO THE APP
 */

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    appSettings(app);

    const configService: ConfigService = await app.get(ConfigService);
    // Получаем номер порта из переменной окружения 'PORT' в файле .env
    const port = configService.get<number>('PORT') || 3002;
    // Получаем путь к сервисному файлу из переменной окружения 'SA_KEY' в файле .env
    const accountPath = configService.get<string>('SA_KEY');

    initializeFirebase(accountPath);

    //preliminaryActions(app);

    await app.listen(port, () => {
        new Logger('Bootstrap').log(`##########################################################\n
                                    App started listening on port ${port} at ${new Date().toISOString()}\n
                                    ##########################################################\n`);
    });
}

bootstrap();
