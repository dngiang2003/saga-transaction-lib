import { DefaultLogger } from '../../src/utils/default-logger';

describe('DefaultLogger', () => {
  let logger: DefaultLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new DefaultLogger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should log message with correct prefix', () => {
    logger.log('Test message');
    expect(console.log).toHaveBeenCalledWith('[Saga] Test message');
  });

  test('should log error with correct prefix and error object', () => {
    const error = new Error('Test error');
    logger.error('Error message', error);
    expect(console.error).toHaveBeenCalledWith('[Saga Error] Error message', error);
  });

  test('should log warning with correct prefix', () => {
    logger.warn('Warning message');
    expect(console.warn).toHaveBeenCalledWith('[Saga Warning] Warning message');
  });

  test('should log debug message with correct prefix', () => {
    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalledWith('[Saga Debug] Debug message');
  });
});
