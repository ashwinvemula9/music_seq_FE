export interface Point {
  x: number;
  y: number;
}

export interface DrawingEvent {
  type: 'draw' | 'clear';
  points?: Point[];
  color?: string;
  lineWidth?: number;
}