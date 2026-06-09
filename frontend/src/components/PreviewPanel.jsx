import { Globe, RefreshCw, Smartphone, Monitor } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PreviewPanel({ previewUrl }) {
  const [key, setKey] = useState(0)
  const [viewMode, setViewMode] = useState('desktop') // 'desktop' or 'mobile'

  const refreshIframe = () => setKey(prev => prev + 1)

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#0c0d12]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-border"></div>
            <div className="w-3 h-3 rounded-full bg-border"></div>
            <div className="w-3 h-3 rounded-full bg-border"></div>
          </div>
          
          <div className="flex bg-muted/50 items-center justify-between rounded-md max-w-sm w-full px-3 py-1.5 border border-border">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate font-medium">
                {previewUrl || 'about:blank'}
              </span>
            </div>
            <button 
              onClick={refreshIframe}
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Refresh Preview"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center items-center bg-muted/50 rounded-md border border-border p-0.5 ml-4">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-sm transition-colors ${viewMode === 'desktop' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-sm transition-colors ${viewMode === 'mobile' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'}`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-dots p-4">
        {previewUrl ? (
          <motion.div 
            layout
            initial={false}
            animate={{ 
              width: viewMode === 'mobile' ? 375 : '100%', 
              height: viewMode === 'mobile' ? 812 : '100%' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`bg-white rounded-md overflow-hidden ${viewMode === 'mobile' ? 'border shadow-2xl relative' : 'h-full flex-1'}`}
          >
            {viewMode === 'mobile' && (
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-[1rem] z-20 pointer-events-none"></div>
            )}
            <iframe
              key={key}
              src={previewUrl}
              className="w-full h-full border-none bg-white"
              title="Sandbox Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-4">
             <Globe className="w-12 h-12 opacity-20" />
             <p className="text-sm font-medium">Preview will appear here</p>
          </div>
        )}
      </div>
      
      <style>{`
        .bg-dots {
          background-image: radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 16px 16px;
        }
        .dark .bg-dots {
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  )
}
