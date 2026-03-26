'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useDrawing } from '@/hooks/useDrawing';
import { useDrawingStore, type Point } from '@/store/drawingStore';

interface TextInputState {
  isOpen: boolean;
  position: Point;
  drawingId: string;
}

interface DrawingCanvasProps {
  className?: string;
}

export function DrawingCanvas({ className = '' }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeTool, drawings, setDrawingText } = useDrawingStore();
  const [textInput, setTextInput] = useState<TextInputState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    drawingId: '',
  });
  const [inputValue, setInputValue] = useState('');

  useDrawing({ canvasRef });

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set display size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Set actual size in memory (scaled for DPR)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale context to match DPR
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Also observe container size changes
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [handleResize]);

  // Check for text drawings that need input
  useEffect(() => {
    const lastDrawing = drawings[drawings.length - 1];
    if (lastDrawing?.type === 'text' && !lastDrawing.text && lastDrawing.points.length > 0) {
      setTextInput({
        isOpen: true,
        position: lastDrawing.points[0],
        drawingId: lastDrawing.id,
      });
      setInputValue('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [drawings]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setDrawingText(textInput.drawingId, inputValue.trim());
    } else {
      // Remove empty text drawing
      const { removeDrawing } = useDrawingStore.getState();
      removeDrawing(textInput.drawingId);
    }
    setTextInput({ isOpen: false, position: { x: 0, y: 0 }, drawingId: '' });
    setInputValue('');
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      const { removeDrawing } = useDrawingStore.getState();
      removeDrawing(textInput.drawingId);
      setTextInput({ isOpen: false, position: { x: 0, y: 0 }, drawingId: '' });
      setInputValue('');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 10 }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${activeTool ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          cursor: activeTool ? 'crosshair' : 'default',
        }}
      />
      
      {/* Text Input Overlay */}
      {textInput.isOpen && (
        <div
          className="absolute z-50 pointer-events-auto"
          style={{ left: textInput.position.x, top: textInput.position.y }}
        >
          <form onSubmit={handleTextSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTextKeyDown}
              onBlur={handleTextSubmit}
              placeholder="Enter text..."
              className="min-w-[150px] rounded border border-[var(--neon-blue)] bg-card px-2 py-1 text-sm text-foreground outline-none shadow-lg"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
}
