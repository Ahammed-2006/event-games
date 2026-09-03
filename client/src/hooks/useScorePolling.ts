import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchScores, type StudentScore } from '../services/scoreService';
import { io } from 'socket.io-client';

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

  // Initial fetch + socket connection
  useEffect(() => {
    poll(); // immediate first fetch
    
    if (!enabled) return;

    // Connect to websocket server
    const socket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '/');
    
    socket.on('connect', () => {
      console.log('Connected to real-time score server');
    });

    socket.on('update_scores', () => {
      poll(); // Re-fetch immediately when a score updates!
    });
    
    return () => {
      socket.disconnect();
      if (liveRef.current) clearTimeout(liveRef.current);
    };
  }, [enabled, poll]);

  const overrideData = useCallback((data: StudentScore[]) => {

    setScores(data.map(s => ({ ...s })));
    setLastUpdated(new Date());
    pulse();
  }, []);

  return { scores, lastUpdated, isLoading, isLive, overrideData, refresh: poll };
}
