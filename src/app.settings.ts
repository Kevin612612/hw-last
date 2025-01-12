import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { ValidationPipeOptions } from './validation/validationPipeOptions';
import { MyInterceptor } from './interceptors/logger.interceptor';

/**
 * Configures the Nest.js application with common settings and global middleware.
 *
 * @param app The instance of `INestApplication` representing the Nest.js application.
 */
export const appSettings = (app: INestApplication) => {
	// Parse incoming cookies from HTTP request headers and make them available in `req.cookies` object.
	app.use(cookieParser());

	// Enable Cross-Origin Resource Sharing (CORS) for handling requests from different origins.
	app.enableCors();

	// Apply a global validation pipe to automatically validate incoming data based on defined rules or classes.
	// The `ValidationPipeOptions` might contain additional configuration settings for the validation pipe.
	app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions));

	// Set up a global interceptor to apply MyInterceptor to all incoming requests and responses.
	// Interceptors can be used for handling common cross-cutting concerns throughout the application.
	app.useGlobalInterceptors(new MyInterceptor());

	// Register a global exception filter to catch and handle exceptions during request processing.
	// The `HttpExceptionFilter` is a custom filter defined elsewhere in the code.
	app.useGlobalFilters(new HttpExceptionFilter());

	// Set the dependency injection container on the selected `AppModule`.
	// The `fallbackOnErrors: true` ensures that it falls back to default behavior if dependency resolution fails.
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
