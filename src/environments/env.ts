import { Logger } from '@nestjs/common';

//считываем текущее значение переменной окружения NODE_ENV, заданное при запуске скрипта и выводим в консоль
//например "start:dev": "NODE_ENV=development nest start --watch"
const ENV = process.env.NODE_ENV;
new Logger().log(`Приложение запускается в среде ${ENV}`);

// Флаги, определяющие текущую среду выполнения приложения.
// Используются для настройки конфигурации и логики в зависимости от среды:
export const isProduction = ENV === 'production'; // Среда продакшена (production)
export const isDeployment = ENV === 'deployment'; // Среда деплоя (deployment)
export const isDevelop = ENV === 'development';   // Среда разработки (development)

// Функция для определения имени файла окружения (.env)
// в зависимости от текущей среды выполнения (ENV).
// Возвращает соответствующий файл для production, deployment или development.
export const getEnvFile = () => {
    switch (ENV) {
        case 'production':
          return 'production.env'; // Файл для среды production
        case 'deployment':
          return 'deployment.env'; // Файл для среды deployment
        default:
          return 'development.env'; // Файл по умолчанию для среды development
      }
};

