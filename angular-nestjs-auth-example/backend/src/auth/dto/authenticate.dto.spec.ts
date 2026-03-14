import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthenticateDto } from './authenticate.dto';

describe('AuthenticateDto', () => {
  it('validates a proper uid', async () => {
    const dto = plainToInstance(AuthenticateDto, { uid: 'user-1' });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects blank uid', async () => {
    const dto = plainToInstance(AuthenticateDto, { uid: '' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
