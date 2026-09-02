import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, EyeOff } from 'lucide-react';

interface Props {
  warned: boolean;   // key-press / right-click detected
  hidden: boolean;   // tab switched away (screen-share heuristic)
}

/**
 * Overlay shown when a screenshot attempt is detected.
 * Hidden overlay blurs the game content while the tab is not visible.
 */
export default function ScreenshotWarning({ warned, hidden }: Props) {
  return (
    <>
      {/* --- Blur overlay while tab is hidden (screen-share / alt-tab) --- */}
      <AnimatePresence>
        {hidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dark-bg/95 backdrop-blur-2xl"
          >
            <EyeOff className="w-16 h-16 text-neon-purple mb-4" />
            <h2 className="text-2xl font-black font-mono text-white mb-2">SCREEN HIDDEN</h2>
            <p className="text-gray-400 font-mono text-sm">Return to this tab to continue the challenge.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Toast warning on keyboard capture attempt --- */}
      <AnimatePresence>
        {warned && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit   ={{ opacity: 0, y: -10                }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-4 rounded-xl bg-red-600/20 border border-red-500/50 text-red-300 font-mono shadow-2xl backdrop-blur-md"
          >
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Screenshot attempt detected!</p>
              <p className="text-xs text-red-400 mt-0.5">This action has been logged by the system.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
