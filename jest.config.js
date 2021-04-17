module.exports = {
    clearMocks: true,
    collectCoverageFrom: ['<rootDir>/src/**'],
    coverageProvider: 'v8',
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts)$': 'ts-jest'
    },
    roots: ['<rootDir>/__test__'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/__test__/setup/setupFilesAfterEnv.ts'],
    testResultsProcessor: 'jest-sonar-reporter',
    coverageDirectory: '__test__/coverage',
    coveragePathIgnorePatterns: ['\\\\node_modules\\\\', 'src/main/config'],
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsconfig: 'tsconfig.json'
        }
    }
};
