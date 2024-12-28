import React, { useState, useEffect, useCallback } from "react";
import { Grid } from "./Grid";
import { Controls } from "./Controls";
import { useSequencer } from "../hooks/useSequencer";
import { useAudioContext } from "../hooks/useAudioContext";
import { NOTES } from "../constants/music";

export function Sequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const { grid, tempo, toggleNote, updateTempo } = useSequencer();
  const { playNote } = useAudioContext();

  const playStep = useCallback(() => {
    grid.forEach((row, rowIndex) => {
      if (row[currentBeat]) {
        playNote(NOTES[rowIndex].frequency, 0.1);
      }
    });
    setCurrentBeat((prev) => (prev + 1) % 16);
  }, [currentBeat, grid, playNote]);

  useEffect(() => {
    let intervalId: number;
    if (isPlaying) {
      const stepTime = ((60 / tempo) * 1000) / 4; // 16th notes
      intervalId = window.setInterval(playStep, stepTime);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, tempo, playStep]);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <Controls
        isPlaying={isPlaying}
        tempo={tempo}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onTempoChange={updateTempo}
      />
      <Grid grid={grid} currentBeat={currentBeat} onToggle={toggleNote} />
    </div>
  );
}
