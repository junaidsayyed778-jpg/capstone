import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function StartScreen({ onStart, isStarting }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl px-6"
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground bg-clip-text">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Sandbox</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Your high-speed, frictionless live coding environment. Generate next-gen React code at the speed of thought.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          disabled={isStarting}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 bg-primary rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-70"
        >
          {isStarting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
              <span>Initializing...</span>
            </div>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Start Sandbox</span>
            </>
          )}
          
          {/* Button glow effect */}
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
      </motion.div>
    </div>
  )
}
