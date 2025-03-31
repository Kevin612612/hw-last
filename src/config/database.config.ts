import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
    const dbType = process.env.DB_TYPE || 'mongo'; // Тип базы данных: 'mongo' или 'firebase'

    if (dbType === 'mongo') {
        return {
            type: 'mongo',
            PORT: process.env.PORT,
            MONGO_URL: process.env.MONGO_URL,
            NODE_ENV: process.env.NODE_ENV,
        };
    } else if (dbType === 'firebase') {
        return {
            type: 'firebase',
            projectId: process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id',
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || 'your-firebase-private-key',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'your-firebase-client-email',
        };
    } else {
        throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }
});

//for taking data from here we need to load this module into ConfigModule with option "load: [configuration]""
// export default function getConfiguration() {
//     return {
//         PORT: process.env.PORT || '3000',
//         MONGO_URL: 'mongodb+srv://Anton:QBgDZ7vVYskywK7d@cluster0.ksf3cyb.mongodb.net/hosting?retryWrites=true&w=majority',
//         NODE_ENV: process.env.NODE_ENV || 'development',
//     };
// }

// type ConfigurationConfigType = ReturnType<typeof getConfiguration>;
