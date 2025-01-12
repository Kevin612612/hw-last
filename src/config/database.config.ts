import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	URL: process.env.MONGO_URL || 'mongodb://localhost:27017/nestjs_database',
}));
