import type { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { DEFAULT_UID, DEFAULT_CONTAINER } from './constants'

export const clientConfig: IBeeConfig = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
  mcpEditorClient: {
    enabled: true,
    sessionId: 'ai-agent-session-001', //TODO : generate unique session IDs in production
  }
}
