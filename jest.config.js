module.exports = {
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
    testEnvironment: 'node',
    transform: {
        '.+\\.ts$': 'ts-jest'
    },
    roots: ['<rootDir>/__test__'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/__test__/setup/setupFilesAfterEnv.ts'],
    testResultsProcessor: 'jest-sonar-reporter',
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\', 'src/main/config']
};
