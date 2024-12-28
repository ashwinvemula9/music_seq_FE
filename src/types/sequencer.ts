export interface Note {
  row: number;
  col: number;
  active: boolean;
}

export interface SequencerEvent {
  type: 'toggleNote' | 'clear' | 'tempoChange';
  note?: Note;
  tempo?: number;
}