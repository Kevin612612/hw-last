//for taking data from here we need to load this module into ConfigModule with option "load: [configuration]""
export default function getConfiguration() {
	return {
		PORT: process.env.PORT || '3000',
		MONGO_URL: 'mongodb+srv://Anton:QBgDZ7vVYskywK7d@cluster0.ksf3cyb.mongodb.net/hosting?retryWrites=true&w=majority',
		NODE_ENV: process.env.NODE_ENV || 'development',
	};
}

type ConfigurationConfigType = ReturnType<typeof getConfiguration>;
