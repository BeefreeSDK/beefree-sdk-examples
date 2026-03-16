import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService) {}

  async authenticate(uid: string): Promise<Record<string, unknown>> {
    const clientId = this.configService.get<string>('BEEFREE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('BEEFREE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      this.logger.error('Missing BEEFREE_CLIENT_ID or BEEFREE_CLIENT_SECRET');
      throw new InternalServerErrorException(
        'Missing Beefree credentials in server configuration',
      );
    }

    this.logger.log(`Authenticating uid: ${uid}`);

    const response = await fetch('https://auth.getbee.io/loginV2', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        uid,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Auth failed: ${response.status} ${errorText}`);
      throw new BadRequestException(
        `Authentication failed: ${response.status}`,
      );
    }

    const tokenData = (await response.json()) as Record<string, unknown>;

    if (!tokenData.access_token) {
      throw new InternalServerErrorException(
        'Invalid response: missing access_token',
      );
    }

    this.logger.log('Authentication successful');
    return tokenData;
  }
}
