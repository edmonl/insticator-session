const MockDate = require('mockdate')

module.exports = {
  moduleFileExtensions: ['js'],
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  testEnvironment: 'jest-environment-jsdom-fifteen',
  testEnvironmentOptions: {
    beforeParse(window) {
      window.envMockDate = date => {
        MockDate.set(date)
      }
      window.envResetDate = () => {
        MockDate.reset()
      }
    },
  },
  testMatch: ['**/test/**/*.test.js'],
  testURL: 'http://test.io/test'
}
