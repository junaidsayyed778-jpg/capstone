import { useEffect, useRef } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'

export default function TerminalPanel({ logs }) {
  const terminalEndRef = useRef(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [logs])

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-border/20 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#181818] border-b border-[#2d2d2d] shrink-0">
        <TerminalIcon className="w-4 h-4 text-emerald-400" />
        <h2 className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider font-mono">Sandbox Terminal</h2>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 terminal-scroll font-mono text-[13px] leading-relaxed select-text">
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">Waiting for connection...</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="break-all whitespace-pre-wrap">
              <span className="text-emerald-500 mr-2">➜</span>
              <span className="text-gray-300">{log}</span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  )
}
