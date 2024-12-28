import React from 'react';
import { Play, Pause, Settings } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  tempo: number;
  onPlayPause: () => void;
  onTempoChange: (tempo: number) => void;
}

export function Controls({
  isPlaying,
  tempo,
  onPlayPause,
  onTempoChange,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
      <button
        onClick={onPlayPause}
        className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min="60"
          max="180"
          value={tempo}
          onChange={(e) => onTempoChange(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm font-mono w-12">{tempo} BPM</span>
      </div>
    </div>
  );
}
