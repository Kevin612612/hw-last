import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { appSettings } from './app.settings';
import { initializeFirebase } from './app.firebase';
import { preliminaryActions } from './pre-operations';

/*
 * ENTRANCE INTO THE APP
 */
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    appSettings(app);

    const configService: ConfigService = await app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3002; // Получаем номер порта из переменной окружения 'PORT' в файле .env
    const accountPath = configService.get<string>('SA_KEY'); // Получаем путь к сервисному файлу из переменной окружения 'SA_KEY' в файле .env

    initializeFirebase(accountPath);
    //preliminaryActions(app);

    await app.listen(port, () => {
        new Logger('Bootstrap').log(`##########################################################\n
                                    App started listening on port ${port} at ${new Date().toISOString()}\n
                                    ##########################################################\n`);
    });
}
bootstrap();
