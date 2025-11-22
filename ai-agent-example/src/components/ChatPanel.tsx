import { useState, useEffect, useRef } from 'react'
import { WS_URL, EXAMPLE_PROMPTS } from '../config/constants'
import type { ChatMessage, WebSocketMessage } from '../types/chat'

export const ChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExamples, setShowExamples] = useState(true)
  
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentMessageRef = useRef<string>('')

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log('✅ WebSocket connected')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data)
      
      switch (data.type) {
        case 'start':
          setIsGenerating(true)
          currentMessageRef.current = ''
          break
          
        case 'stream':
          // Append to current streaming message
          if (data.content) {
            currentMessageRef.current += data.content
            
            // Update or create streaming message
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1]
              if (lastMessage && lastMessage.type === 'assistant' && lastMessage.id === 'streaming') {
                // Update existing streaming message
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: currentMessageRef.current }
                ]
              } else {
                // Create new streaming message
                return [
                  ...prev,
                  {
                    id: 'streaming',
                    type: 'assistant',
                    content: currentMessageRef.current,
                    timestamp: new Date()
                  }
                ]
              }
            })
          }
          break
          
        case 'progress':
          // Add progress update message
          if (data.message) {
            setMessages(prev => [
              ...prev,
              {
                id: `progress-${Date.now()}`,
                type: 'progress',
                content: data.message,
                timestamp: new Date()
              }
            ])
          }
          break
          
        case 'complete':
          // Finalize the streaming message
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage && lastMessage.id === 'streaming') {
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  id: `assistant-${Date.now()}`
                }
              ]
            }
            return prev
          })
          setIsGenerating(false)
          currentMessageRef.current = ''
          break
          
        case 'error':
          setMessages(prev => [
            ...prev,
            {
              id: `error-${Date.now()}`,
              type: 'system',
              content: `❌ Error: ${data.message || 'Unknown error occurred'}`,
              timestamp: new Date()
            }
          ])
          setIsGenerating(false)
          currentMessageRef.current = ''
          break
      }
    }

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected')
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error)
      setIsConnected(false)
    }

    wsRef.current = ws

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim() || !wsRef.current || isGenerating) return

    // Hide examples after first message
    setShowExamples(false)

    // Add user message to chat
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: 'user',
        content: content.trim(),
        timestamp: new Date()
      }
    ])

    // Send to WebSocket
    wsRef.current.send(JSON.stringify({
      type: 'chat',
      message: content.trim()
    }))

    // Clear input
    setInputValue('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt)
    // Auto-send example prompts
    setTimeout(() => sendMessage(prompt), 100)
  }

  return (
    <div className="chat-panel">
      <div className="panel-header">
        <h2>🤖 AI Assistant</h2>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span className="status-text">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {showExamples && messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <h3>Welcome to your AI Email Designer</h3>
              <p>I can help you create stunning email designs with natural language commands.</p>
              
              <div className="example-prompts">
                <p className="examples-label">Try these examples:</p>
                <div className="prompt-grid">
                  {EXAMPLE_PROMPTS.map((example) => (
                    <button
                      key={example.id}
                      className="prompt-card"
                      onClick={() => handleExampleClick(example.prompt)}
                      disabled={isGenerating}
                    >
                      <span className="prompt-text">{example.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-header">
              <strong>
                {message.type === 'user' ? '👤 You' : 
                 message.type === 'assistant' ? '🤖 AI Assistant' :
                 message.type === 'progress' ? '⚙️ Status' : '💬 System'}
              </strong>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder={isGenerating ? "AI is working..." : "Type your message here..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          rows={3}
          disabled={isGenerating || !isConnected}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isGenerating || !isConnected || !inputValue.trim()}
        >
          {isGenerating ? (
            <>
              <span className="loading-spinner">⏳</span>
              Generating...
            </>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  )
}
