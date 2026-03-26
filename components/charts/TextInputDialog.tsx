'use client';

import { useState, useEffect, useRef } from 'react';
import { useDrawingStore } from '@/store/drawingStore';

interface TextInputDialogProps {
  onClose: () => void;
  position: { x: number; y: number };
  drawingId: string;
}

export function TextInputDialog({ onClose, position, drawingId }: TextInputDialogProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { setDrawingText } = useDrawingStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      setDrawingText(drawingId, text.trim());
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="absolute z-50"
      style={{ left: position.x, top: position.y }}
    >
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          placeholder="Enter text..."
          className="min-w-[120px] rounded border border-border bg-card px-2 py-1 text-sm text-foreground outline-none focus:border-[var(--neon-blue)]"
        />
      </form>
    </div>
  );
}
