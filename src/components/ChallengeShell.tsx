import type { ReactNode } from 'react';
import { useScreenshotPrevention } from '../hooks/useScreenshotPrevention';
import ScreenshotWarning from './ScreenshotWarning';

/**
 * Wrap every challenge page with this shell.
 * - Enables screenshot/copy-paste prevention
 * - Shows the warning overlay on capture attempts
 * - Applies `select-none` and `pointer-events-none` on images
 */
export default function ChallengeShell({ children }: { children: ReactNode }) {
  const { warned, hidden } = useScreenshotPrevention(true);

  return (
    <div
      className="select-none"
      style={{ WebkitUserSelect: 'none', MozUserSelect: 'none', userSelect: 'none' }}
      onCopy={e => e.preventDefault()}
      onCut={e => e.preventDefault()}
    >
      <ScreenshotWarning warned={warned} hidden={hidden} />
      {children}
    </div>
  );
}
