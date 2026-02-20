const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config')

module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,
    '^c/(.*)$': '<rootDir>/src/modules/c/$1/$1',
    '^@beefree\\.io/sdk$': '<rootDir>/__mocks__/@beefree.io/sdk.js',
    '^lightning/platformResourceLoader$': '<rootDir>/__mocks__/lightning/platformResourceLoader.js',
    '^@salesforce/resourceUrl/(.*)$': '<rootDir>/__mocks__/@salesforce/resourceUrl/$1.js',
    '^@salesforce/apex/(.*)$': '<rootDir>/__mocks__/@salesforce/apex/$1.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/modules/**/*.js',
    '!**/node_modules/**',
  ],
  testEnvironment: 'jsdom',
}
