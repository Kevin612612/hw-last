import * as fs from 'fs';
import * as admin from 'firebase-admin';

interface ServiceAccount {
    project_id: string;
    private_key: string;
    client_email: string;
}

export function initializeFirebase(accountPath: string): void {
    // Читаем содержимое файла по указанному пути и парсим его как JSON
    const serviceAccount: ServiceAccount = JSON.parse(fs.readFileSync(accountPath, 'utf8'));

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
}
