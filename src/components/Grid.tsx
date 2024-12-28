import React from 'react';
import { NOTES } from '../constants/music';

interface GridProps {
  grid: boolean[][];
  currentBeat: number;
  onToggle: (row: number, col: number) => void;
}

export function Grid({ grid, currentBeat, onToggle }: GridProps) {
  return (
    <div className="grid gap-1">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          <div className="w-8 text-sm font-mono text-right pr-2 text-gray-500">
            {NOTES[rowIndex].name}
          </div>
          {row.map((active, colIndex) => (
            <button
              key={colIndex}
              className={`
                w-8 h-8 rounded-md transition-all
                ${active ? 'bg-indigo-500 shadow-lg scale-105' : 'bg-white shadow'}
                ${currentBeat === colIndex ? 'border-2 border-indigo-300' : ''}
                hover:bg-indigo-100
              `}
              onClick={() => onToggle(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}