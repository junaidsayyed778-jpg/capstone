import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Code2 } from 'lucide-react'

export default function ChatPanel({ messages, onSendMessage, isProcessing }) {
  const [input, setInput] = useState('')
  const msgsEndRef = useRef(null)

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return
    onSendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/30 backdrop-blur-md">
        <Bot className="w-5 h-5 text-accent" />
        <h2 className="text-sm font-semibold text-foreground">AI Architect</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Ready to Build</p>
              <p className="text-sm mt-1">Describe the UI you want to generate.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/20 text-accent'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground border border-border/50 shadow-sm'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        
        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-accent/20 text-accent">
              <Bot className="w-4 h-4" />
            </div>
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted/50 border border-border/50 text-foreground flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>

      <div className="p-4 bg-background/50 border-t border-border">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Type your requirements..."
            className="w-full bg-input/50 border border-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:bg-background transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-1.5 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
