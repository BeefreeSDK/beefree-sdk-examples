import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('posts uid and returns token', async () => {
    const httpClient = {
      post: vi.fn().mockReturnValue(of({ access_token: 'abc' })),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClient },
      ],
    });

    const service = TestBed.inject(AuthService);
    const token = await service.authenticate('uid-1');

    expect(httpClient.post).toHaveBeenCalledWith('/auth/token', { uid: 'uid-1' });
    expect(token.access_token).toBe('abc');
  });
});
