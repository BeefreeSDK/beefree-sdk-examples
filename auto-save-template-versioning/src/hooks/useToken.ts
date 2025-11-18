import { useState, useEffect, useRef } from 'react';
import type { IToken } from '@beefree.io/sdk/dist/types/bee';
import { Authorizer } from '../api/Authorizer';

export function useToken(authorizer: Authorizer) {
  const [token, setToken] = useState<IToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const tokenFetched = useRef(false);

  useEffect(() => {
    if (!tokenFetched.current) {
      tokenFetched.current = true;

      (async () => {
        try {
          const fetchedToken = await authorizer.getToken();
          setToken(fetchedToken);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch token'));
          tokenFetched.current = false; // Reset on error
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [authorizer]);

  return { token, loading, error };
}
