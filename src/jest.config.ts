module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\.ts$': 'ts-jest', // Use ts-jest for TypeScript files
    },
    moduleFileExtensions: ['ts', 'json'],
  };