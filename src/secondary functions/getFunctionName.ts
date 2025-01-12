/**
* This function, getClassName, retrieves the name of the calling class by analyzing the call stack.
* It accomplishes this by creating an error instance to capture the stack trace, then parsing the relevant line
* that contains information about the calling class. The extracted class name is returned as the result.
@returns {string} The name of the calling class obtained from the stack trace.
*/

export function getClassName(): string {
	const stack = new Error().stack;
	const callerLine = stack.split('\n')[2];
	const functionName = /\s+at (.+) \(/.exec(callerLine)[1];
	const className = functionName.split('.')[0];
	return className;
}
