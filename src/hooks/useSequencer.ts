import { useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import type { Note, SequencerEvent } from '../types/sequencer';
import { NOTES } from '../constants/music';

export function useSequencer() {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(NOTES.length).fill(Array(16).fill(false))
  );
  const [tempo, setTempo] = useState(120);

  const { sendEvent } = useWebSocket((event: SequencerEvent) => {
    if (event.type === 'toggleNote' && event.note) {
      const { row, col, active } = event.note;
      setGrid(prev => 
        prev.map((r, i) =>
          i === row ? r.map((c, j) => j === col ? active : c) : r
        )
      );
    } else if (event.type === 'tempoChange' && event.tempo) {
      setTempo(event.tempo);
    }
  });

  const toggleNote = useCallback((row: number, col: number) => {
    setGrid(prev => {
      const newGrid = prev.map((r, i) =>
        i === row ? r.map((c, j) => j === col ? !c : c) : [...r]
      );
      sendEvent({
        type: 'toggleNote',
        note: { row, col, active: !prev[row][col] }
      });
      return newGrid;
    });
  }, [sendEvent]);

  const updateTempo = useCallback((newTempo: number) => {
    setTempo(newTempo);
    sendEvent({ type: 'tempoChange', tempo: newTempo });
  }, [sendEvent]);

  return { grid, tempo, toggleNote, updateTempo };
}