import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appSettings } from './app.settings';
import { Logger } from '@nestjs/common';
import { getClassName } from './secondary functions/getFunctionName';
import { preliminaryActions } from './pre-operations';
import { ConfigService } from '@nestjs/config';

/**
 *
 * ENTRANCE INTO THE APP
 */

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    appSettings(app);

    const configService: ConfigService = await app.get(ConfigService);
    const port = (await configService.get('PORT')) || 3002;

    /** preliminary operations */
    preliminaryActions(app);

    await app.listen(port, () => {
        console.log('##########################################################');
        new Logger.log(`App started listening on port ${port} at ${new Date()}`);
        console.log('##########################################################');
    });
}

bootstrap();
