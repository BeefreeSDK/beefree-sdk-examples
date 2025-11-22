export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system' | 'progress'
  content: string
  timestamp: Date
}

export interface WebSocketMessage {
  type: 'start' | 'stream' | 'complete' | 'error' | 'progress'
  content?: string
  message?: string
}
