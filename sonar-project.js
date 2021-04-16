// eslint-disable-next-line
const sonarqubeScanner = require('sonarqube-scanner');

const excludes = ['src/main/config/**/*', 'src/infra/db/migrations/**/*', 'src/infra/db/seeders/**/*'];
const inclusions = ['__test__/**/*.test.ts', '__test__/**/*.spec.ts'];

sonarqubeScanner(
    {
        serverUrl: 'http://localhost:9000',
        token: '41aea3f7a56e9e1e86f2fe0c88a63090ef4e45cc',
        options: {
            'sonar.sources': './src',
            'sonar.tests': './__test__',
            'sonar.language': 'ts',
            'sonar.inclusions': '**',
            'sonar.exclusions': excludes.join(','),
            'sonar.test.inclusions': inclusions.join(','),
            'sonar.javascript.lcov.reportPaths': '__test__/coverage/lcov.info',
            'sonar.testExecutionReportPaths': '__test__/coverage/test-reporter.xml'
        }
    },
    // eslint-disable-next-line
    () => process.exit()
);
