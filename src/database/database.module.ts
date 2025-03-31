import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseService } from './database.mongooseservice';
import { FirestoreService } from './database.firebaseservice';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
    static register(): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                ConfigModule,
                this.createDynamicDatabaseModule(), // Динамический выбор модуля базы данных
            ],
            providers: [
                this.getDatabaseServiceProvider(), // Динамический выбор сервиса базы данных
            ],
            exports: [DatabaseService], // Экспорт для использования в других модулях
        };
    }

    /**
     * Метод для создания динамического модуля базы данных
     */
    private static createDynamicDatabaseModule(): DynamicModule {
        const dynamicModule: DynamicModule = {
            module: class DynamicDatabaseModule {},
            imports: [
                MongooseModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        const dbType = configService.get<string>('DbType');
                        if (dbType === 'mongodb') {
                            return {
                                uri: configService.get<string>('MONGO_URL'),
                                useNewUrlParser: true,
                                useUnifiedTopology: true,
                            };
                        } else if (dbType === 'firestore') {
                            throw new Error(`Firestore support is not implemented yet.`);
                            // Add FirestoreModule configuration here when available.
                        } else {
                            throw new Error(`Unsupported DbType: ${dbType}`);
                        }
                    },
                }),
            ],
        };

        return dynamicModule;
    }

    /**
     * Метод для выбора сервиса базы данных (MongooseDatabaseService или FirestoreService)
     */
    private static getDatabaseServiceProvider() {
        return {
            provide: DatabaseService,
            useFactory: (configService: ConfigService) => {
                const dbType = configService.get<string>('DbType');
                if (dbType === 'mongodb') {
                    return new MongooseDatabaseService();
                } else if (dbType === 'firestore') {
                    return new FirestoreService();
                } else {
                    throw new Error(`Unsupported DbType: ${dbType}`);
                }
            },
            inject: [ConfigService], // Подключаем ConfigService для получения настроек
        };
    }
}
