import type { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { DEFAULT_UID, DEFAULT_CONTAINER, COMMENT_USER, COMMENT_USER_COLOR, COMMENT_USER_HANDLE  } from './constants'

export const clientConfig: IBeeConfig = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
  commenting: true,
  username: COMMENT_USER,
  userColor: COMMENT_USER_COLOR,
  userHandle: COMMENT_USER_HANDLE,
}
