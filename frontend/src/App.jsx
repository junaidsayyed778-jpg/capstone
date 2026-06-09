import { useState } from 'react'
import StartScreen from './components/StartScreen'
import Workspace from './components/Workspace'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export default function App() {
  const [isSandboxStarted, setIsSandboxStarted] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  
  const [previewUrl, setPreviewUrl] = useState('')
  const [messages, setMessages] = useState([])
  const [terminalLogs, setTerminalLogs] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const startSandbox = async () => {
    setIsStarting(true)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Replace with your actual endpoint
      const response = await fetch(`${API_BASE_URL}/api/sandbox/start`, { 
        method: 'POST',
        signal: controller.signal
      })
      clearTimeout(timeoutId);
      
      const responseText = await response.text()
      const data = responseText ? JSON.parse(responseText) : {}
      
      if (response.ok) {
        setPreviewUrl(data.previewUrl || '') // Don't load own app URL as fallback
      } else {
        throw new Error(data.error || data.message || `Sandbox request failed with status ${response.status}`)
      }
    } catch (err) {
      console.error('Error starting sandbox:', err)
      setTerminalLogs(prev => [...prev, `Failed to reach API endpoint at ${API_BASE_URL || '/api'}.`])
      setPreviewUrl('') // Setting to empty so the placeholder renders
    } finally {
      setIsStarting(false)
      setIsSandboxStarted(true)
    }
  }

  const sendMessage = async (content) => {
    // Add user message
    const msgUser = { role: 'user', content }
    setMessages(prev => [...prev, msgUser])
    setIsProcessing(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: content })
      })

      if (!response.ok) {
        throw new Error('AI API responded with error')
      }

      const data = await response.json()
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || 'Changes applied.' }])
      
      // Add a system log outputting what changing
      setTerminalLogs(prev => [...prev, `[AI Execution]: Generating code based on prompt "${content.substring(0, 20)}..."`])
      
    } catch (err) {
       console.error('Error sending message:', err)
       // Graceful mock fallback
       setTimeout(() => {
          setMessages(prev => [...prev, { 
             role: 'ai', 
             content: "I couldn't reach the backend server, but if I could, I would be generating that code right now." 
          }])
          setTerminalLogs(prev => [...prev, `[Error]: Failed to reach AI endpoint.`])
          setIsProcessing(false)
       }, 1500)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {!isSandboxStarted ? (
        <StartScreen onStart={startSandbox} isStarting={isStarting} />
      ) : (
        <Workspace 
          previewUrl={previewUrl}
          messages={messages}
          onSendMessage={sendMessage}
          terminalLogs={terminalLogs}
          isProcessing={isProcessing}
        />
      )}
    </>
  )
}
