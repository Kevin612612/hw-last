import type { Config } from 'jest';

const config: Config = {
	moduleFileExtensions: ['ts', 'js', 'json'],
	rootDir: 'src',
	testRegex: '.*\\.test\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	transformIgnorePatterns: ['/node_modules'],
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/$1',
	},
	verbose: true,
};

export default config;
