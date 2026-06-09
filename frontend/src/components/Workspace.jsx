import ChatPanel from './ChatPanel'
import TerminalPanel from './TerminalPanel'
import PreviewPanel from './PreviewPanel'

export default function Workspace({ 
  previewUrl, 
  messages, 
  onSendMessage, 
  terminalLogs, 
  isProcessing 
}) {
  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Left Sidebar: Chat */}
      <div className="w-80 md:w-96 flex-shrink-0 flex flex-col h-full border-r border-border z-10">
        <ChatPanel 
          messages={messages} 
          onSendMessage={onSendMessage} 
          isProcessing={isProcessing} 
        />
      </div>

      {/* Main Content Area: Preview (Top) + Terminal (Bottom) */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-1 min-h-0 relative z-0">
          <PreviewPanel previewUrl={previewUrl} />
        </div>
        
        <div className="h-64 flex-shrink-0 z-10 border-t border-border bg-[#1e1e1e]">
          <TerminalPanel logs={terminalLogs} />
        </div>
      </div>
    </div>
  )
}
