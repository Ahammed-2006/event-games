import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchScores, overrideScores, type StudentScore } from '../services/scoreService';

interface UseScorePollingOptions {
  intervalMs?: number;  // polling interval (default 4 s)
  enabled?: boolean;    // pause polling when false
}

interface UseScorePollingReturn {
  scores: StudentScore[];
  lastUpdated: Date | null;
  isLoading: boolean;
  isLive: boolean;          // true for 1 s after each successful poll
  overrideData: (data: StudentScore[]) => void;
  refresh: () => void;
}

export function useScorePolling({
  intervalMs = 4000,
  enabled = true,
}: UseScorePollingOptions = {}): UseScorePollingReturn {
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const pulse = () => {
    setIsLive(true);
    if (liveRef.current) clearTimeout(liveRef.current);
    liveRef.current = setTimeout(() => setIsLive(false), 1200);
  };

  const poll = useCallback(async () => {
    try {
      const data = await fetchScores();
      setScores(data);
      setLastUpdated(new Date());
      pulse();
    } catch {
      // Network error — silently retry next cycle
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + interval
  useEffect(() => {
    if (!enabled) return;
    poll(); // immediate first fetch
    timerRef.current = setInterval(poll, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (liveRef.current)  clearTimeout(liveRef.current);
    };
  }, [enabled, intervalMs, poll]);

  const overrideData = useCallback((data: StudentScore[]) => {
    overrideScores(data);
    setScores(data.map(s => ({ ...s })));
    setLastUpdated(new Date());
    pulse();
  }, []);

  return { scores, lastUpdated, isLoading, isLive, overrideData, refresh: poll };
}
