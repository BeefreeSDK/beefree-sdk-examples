describe('bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  it('creates app, configures CORS/pipes, and listens on default port', async () => {
    const enableCors = jest.fn();
    const useGlobalPipes = jest.fn();
    const listen = jest.fn().mockResolvedValue(undefined);
    const create = jest.fn().mockResolvedValue({
      enableCors,
      useGlobalPipes,
      listen,
    });

    jest.doMock('@nestjs/core', () => ({
      NestFactory: {
        create,
      },
    }));

    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.PORT;
    const { bootstrap } = await import('./main');
    await bootstrap();
    process.env = originalEnv;

    expect(create).toHaveBeenCalledTimes(1);
    expect(enableCors).toHaveBeenCalledWith({ origin: 'http://localhost:8034' });
    expect(useGlobalPipes).toHaveBeenCalledWith(expect.anything());
    expect(listen).toHaveBeenCalledWith(expect.anything());
    expect(String(listen.mock.calls[0][0])).toBe('3034');
  });

  it('uses configured port when provided', async () => {
    const enableCors = jest.fn();
    const useGlobalPipes = jest.fn();
    const listen = jest.fn().mockResolvedValue(undefined);
    const create = jest.fn().mockResolvedValue({
      enableCors,
      useGlobalPipes,
      listen,
    });

    jest.doMock('@nestjs/core', () => ({
      NestFactory: {
        create,
      },
    }));

    process.env.PORT = '4050';
    const { bootstrap } = await import('./main');
    await bootstrap();

    expect(listen).toHaveBeenCalledWith('4050');
  });

  it('auto-bootstraps when NODE_ENV is not test', async () => {
    const create = jest.fn().mockResolvedValue({
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    });

    jest.doMock('@nestjs/core', () => ({
      NestFactory: {
        create,
      },
    }));

    process.env.NODE_ENV = 'production';
    await import('./main');
    await Promise.resolve();

    expect(create).toHaveBeenCalledTimes(1);
  });
});
