import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('throws when credentials are missing', async () => {
    const config = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;
    const service = new AuthService(config);

    await expect(service.authenticate('uid')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('throws bad request when auth endpoint fails', async () => {
    const config = {
      get: jest
        .fn()
        .mockReturnValueOnce('client-id')
        .mockReturnValueOnce('client-secret'),
    } as unknown as ConfigService;

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue('Unauthorized'),
    } as never);

    const service = new AuthService(config);

    await expect(service.authenticate('uid')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws when response has no access_token', async () => {
    const config = {
      get: jest
        .fn()
        .mockReturnValueOnce('client-id')
        .mockReturnValueOnce('client-secret'),
    } as unknown as ConfigService;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ token_type: 'Bearer' }),
    } as never);

    const service = new AuthService(config);

    await expect(service.authenticate('uid')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('returns token payload on success', async () => {
    const config = {
      get: jest
        .fn()
        .mockReturnValueOnce('client-id')
        .mockReturnValueOnce('client-secret'),
    } as unknown as ConfigService;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ access_token: 'abc123' }),
    } as never);

    const service = new AuthService(config);
    const token = await service.authenticate('uid-a');

    expect(token).toEqual({ access_token: 'abc123' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://auth.getbee.io/loginV2',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
