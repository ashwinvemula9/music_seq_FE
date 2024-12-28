import React, { useRef, useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Point, DrawingEvent } from '../types/drawing';
import { Palette, Eraser } from 'lucide-react';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const lastPoint = useRef<Point | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const { sendDrawingEvent } = useWebSocket((event: DrawingEvent) => {
    if (!ctx.current) return;

    if (event.type === 'clear') {
      clearCanvas();
    } else if (event.points && event.points.length >= 2) {
      ctx.current.strokeStyle = event.color || '#000000';
      ctx.current.lineWidth = event.lineWidth || 5;
      ctx.current.beginPath();
      ctx.current.moveTo(event.points[0].x, event.points[0].y);
      ctx.current.lineTo(event.points[1].x, event.points[1].y);
      ctx.current.stroke();
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    ctx.current = canvas.getContext('2d');
    if (ctx.current) {
      ctx.current.lineCap = 'round';
      ctx.current.lineJoin = 'round';
    }
  }, []);

  const clearCanvas = () => {
    if (!ctx.current || !canvasRef.current) return;
    ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    sendDrawingEvent({ type: 'clear' });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (lastPoint.current) {
      ctx.current.strokeStyle = color;
      ctx.current.lineWidth = lineWidth;
      ctx.current.beginPath();
      ctx.current.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.current.lineTo(currentPoint.x, currentPoint.y);
      ctx.current.stroke();

      sendDrawingEvent({
        type: 'draw',
        points: [lastPoint.current, currentPoint],
        color,
        lineWidth
      });
    }

    lastPoint.current = currentPoint;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <div className="flex gap-4 mb-4">
        <div className="flex items-center bg-white rounded-lg shadow p-2">
          <Palette className="w-6 h-6 mr-2" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 cursor-pointer"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="ml-4 w-32"
          />
        </div>
        <button
          onClick={clearCanvas}
          className="flex items-center bg-white rounded-lg shadow px-4 py-2 hover:bg-gray-50"
        >
          <Eraser className="w-6 h-6 mr-2" />
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="bg-white rounded-lg shadow-lg cursor-crosshair"
        onMouseDown={(e) => {
          setIsDrawing(true);
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            lastPoint.current = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            };
          }
        }}
        onMouseMove={draw}
        onMouseUp={() => {
          setIsDrawing(false);
          lastPoint.current = null;
        }}
        onMouseOut={() => {
          setIsDrawing(false);
          lastPoint.current = null;
        }}
      />
    </div>
  );
}