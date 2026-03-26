'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDrawingStore, type Point, type Drawing } from '@/store/drawingStore';

const FIBONACCI_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

interface UseDrawingOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useDrawing({ canvasRef }: UseDrawingOptions) {
  const animationFrameRef = useRef<number | null>(null);
  const {
    drawings,
    currentDrawing,
    activeTool,
    isDrawing,
    startDrawing,
    updateDrawing,
    finishDrawing,
    cancelDrawing,
    undo,
    redo,
  } = useDrawingStore();

  // Get point from event
  const getPointFromEvent = useCallback(
    (e: MouseEvent | TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ('touches' in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    [canvasRef]
  );

  // Draw a single drawing on canvas
  const drawShape = useCallback(
    (ctx: CanvasRenderingContext2D, drawing: Drawing, isPreview = false) => {
      const { type, points, color, lineWidth, text, fibLevels } = drawing;
      
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (isPreview) {
        ctx.globalAlpha = 0.7;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      switch (type) {
        case 'trendLine': {
          if (points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.stroke();
          }
          break;
        }

        case 'horizontalLine': {
          if (points.length >= 1) {
            const y = points.length >= 2 ? points[1].y : points[0].y;
            const displayWidth = canvas.width / (window.devicePixelRatio || 1);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(displayWidth, y);
            ctx.stroke();
            
            // Draw price label
            ctx.fillStyle = color;
            ctx.font = '11px Inter, sans-serif';
            ctx.fillText(`H-Line`, displayWidth - 50, y - 5);
          }
          break;
        }

        case 'verticalLine': {
          if (points.length >= 1) {
            const x = points.length >= 2 ? points[1].x : points[0].x;
            const displayHeight = canvas.height / (window.devicePixelRatio || 1);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, displayHeight);
            ctx.stroke();
          }
          break;
        }

        case 'rectangle': {
          if (points.length >= 2) {
            const [p1, p2] = points;
            const x = Math.min(p1.x, p2.x);
            const y = Math.min(p1.y, p2.y);
            const width = Math.abs(p2.x - p1.x);
            const height = Math.abs(p2.y - p1.y);
            
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
            
            // Semi-transparent fill
            ctx.globalAlpha = isPreview ? 0.1 : 0.15;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
          break;
        }

        case 'brush': {
          if (points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
          }
          break;
        }

        case 'text': {
          if (points.length >= 1) {
            const displayText = text || 'Text';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillStyle = color;
            ctx.fillText(displayText, points[0].x, points[0].y);
          }
          break;
        }

        case 'fibonacci': {
          if (points.length >= 2) {
            const [p1, p2] = points;
            const height = p2.y - p1.y;
            const levels = fibLevels || FIBONACCI_LEVELS;
            
            levels.forEach((level) => {
              const y = p1.y + height * level;
              
              ctx.beginPath();
              ctx.moveTo(Math.min(p1.x, p2.x), y);
              ctx.lineTo(Math.max(p1.x, p2.x), y);
              ctx.stroke();
              
              // Draw level label
              ctx.font = '11px Inter, sans-serif';
              ctx.fillStyle = color;
              const labelText = `${(level * 100).toFixed(1)}%`;
              ctx.fillText(labelText, Math.max(p1.x, p2.x) + 5, y + 4);
            });
            
            // Draw connecting lines
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p1.x, p2.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p2.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          break;
        }
      }
      
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    },
    [canvasRef]
  );

  // Render all drawings
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.width / dpr;
    const displayHeight = canvas.height / dpr;

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Draw all completed drawings
    drawings.forEach((drawing) => {
      drawShape(ctx, drawing, false);
    });

    // Draw current drawing (preview)
    if (currentDrawing) {
      drawShape(ctx, currentDrawing, true);
    }
  }, [drawings, currentDrawing, drawShape, canvasRef]);

  // Use requestAnimationFrame for smooth rendering
  useEffect(() => {
    const scheduleRender = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    scheduleRender();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  // Handle mouse/touch events
  const handlePointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!activeTool) return;
      
      const point = getPointFromEvent(e);
      if (!point) return;

      e.preventDefault();
      startDrawing(point, activeTool);
      
      // For text and single-click tools, finish immediately
      if (activeTool === 'text') {
        finishDrawing();
      }
    },
    [activeTool, getPointFromEvent, startDrawing, finishDrawing]
  );

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !activeTool) return;
      
      const point = getPointFromEvent(e);
      if (!point) return;

      e.preventDefault();
      updateDrawing(point);
    },
    [isDrawing, activeTool, getPointFromEvent, updateDrawing]
  );

  const handlePointerUp = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      finishDrawing();
    },
    [isDrawing, finishDrawing]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      // Cancel drawing: Escape
      if (e.key === 'Escape') {
        cancelDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, cancelDrawing]);

  // Attach event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse events
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('mouseleave', handlePointerUp);

    // Touch events
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp, { passive: false });
    canvas.addEventListener('touchcancel', handlePointerUp, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('mouseleave', handlePointerUp);

      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchend', handlePointerUp);
      canvas.removeEventListener('touchcancel', handlePointerUp);
    };
  }, [canvasRef, handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    render,
    drawings,
    currentDrawing,
    isDrawing,
  };
}
