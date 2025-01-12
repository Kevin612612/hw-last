import { BadRequestException } from '@nestjs/common';

/**
 * Configuration options for the ValidationPipe.
 * This configuration includes settings for stopping at the first error,
 * as well as a custom exception factory to transform validation errors into a
 * structured response format with error messages and corresponding fields.
 * The code iterates through an array of validation errors, extracting error messages
 * and associating them with their respective fields, then throws a BadRequestException
 * with the formatted errors for a more user-friendly error response.
 */
export const ValidationPipeOptions = {
	stopAtFirstError: true,
	exceptionFactory: (errors) => {
		const errorsForResponse = [];

		// take messages from array of errors and put them into errorsForResponse
		errors.forEach((er) => {
			const constraintsKeys = Object.keys(er.constraints);
			constraintsKeys.forEach((conKey) => {
				errorsForResponse.push({ message: er.constraints[conKey], field: er.property });
			});
		});

		throw new BadRequestException(errorsForResponse);
	},
};
