module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverageFrom: ['<rootDir>/src/**'],
    coverageProvider: 'v8',
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
    roots: ['<rootDir>/__test__'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
        '@test/(.*)': '<rootDir>/__test__/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/__test__/setup/setupFilesAfterEnv.ts'],
    testResultsProcessor: 'jest-sonar-reporter',
    coverageDirectory: '<rootDir>/coverage',
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\', 'src/main/config'],
    globals: {
        'ts-jest': {
        }
    }
};
