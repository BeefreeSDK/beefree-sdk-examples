import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { IToken } from '../types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  async authenticate(uid: string): Promise<IToken> {
    return firstValueFrom(
      this.http.post<IToken>('/auth/token', { uid }),
    );
  }
}
