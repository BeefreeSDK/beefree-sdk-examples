import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  it('delegates token retrieval to AuthService', async () => {
    const service = {
      authenticate: jest.fn().mockResolvedValue({ access_token: 'tok' }),
    } as unknown as AuthService;

    const controller = new AuthController(service);
    const result = await controller.getToken({ uid: 'u1' });

    expect(service.authenticate).toHaveBeenCalledWith('u1');
    expect(result).toEqual({ access_token: 'tok' });
  });
});
