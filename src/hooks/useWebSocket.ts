import { useEffect, useCallback, useRef } from "react";
import type { SequencerEvent } from "../types/sequencer";

export function useWebSocket(onEvent: (event: SequencerEvent) => void) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Use relative path for WebSocket connection
    ws.current = new WebSocket(`https://music-seq-be.onrender.com`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onEvent(data);
    };

    return () => {
      ws.current?.close();
    };
  }, [onEvent]);

  const sendEvent = useCallback((event: SequencerEvent) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(event));
    }
  }, []);

  return { sendEvent };
}
