import type { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { DEFAULT_UID, DEFAULT_CONTAINER } from './constants'

export const clientConfig: IBeeConfig = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
  commenting: true,
  username: `Beefree User`,
  userColor: 'F54927',
  userHandle: 'beefree_user',
}
