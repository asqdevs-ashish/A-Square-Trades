'use client';

import { create } from 'zustand';

export interface Point {
  x: number;
  y: number;
}

export interface Drawing {
  id: string;
  type: 'trendLine' | 'horizontalLine' | 'verticalLine' | 'rectangle' | 'brush' | 'text' | 'fibonacci';
  points: Point[];
  color: string;
  lineWidth: number;
  text?: string;
  fibLevels?: number[];
}

interface DrawingState {
  // Drawings
  drawings: Drawing[];
  currentDrawing: Drawing | null;
  
  // Undo/Redo history
  history: Drawing[][];
  historyIndex: number;
  
  // Active tool
  activeTool: Drawing['type'] | null;
  activeColor: string;
  activeLineWidth: number;
  
  // Drawing state
  isDrawing: boolean;
  
  // Actions
  setActiveTool: (tool: Drawing['type'] | null) => void;
  setActiveColor: (color: string) => void;
  setActiveLineWidth: (width: number) => void;
  
  startDrawing: (point: Point, type: Drawing['type']) => void;
  updateDrawing: (point: Point) => void;
  finishDrawing: () => void;
  cancelDrawing: () => void;
  
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  clearAllDrawings: () => void;
  
  undo: () => void;
  redo: () => void;
  
  // Text tool
  setDrawingText: (id: string, text: string) => void;
}

const FIBONACCI_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

export const useDrawingStore = create<DrawingState>((set, get) => ({
  drawings: [],
  currentDrawing: null,
  history: [[]],
  historyIndex: 0,
  activeTool: null,
  activeColor: '#00d4ff',
  activeLineWidth: 2,
  isDrawing: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveColor: (color) => set({ activeColor: color }),
  setActiveLineWidth: (width) => set({ activeLineWidth: width }),

  startDrawing: (point, type) => {
    const { activeColor, activeLineWidth } = get();
    const newDrawing: Drawing = {
      id: `drawing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      points: [point],
      color: activeColor,
      lineWidth: activeLineWidth,
      fibLevels: type === 'fibonacci' ? FIBONACCI_LEVELS : undefined,
    };
    set({ currentDrawing: newDrawing, isDrawing: true });
  },

  updateDrawing: (point) => {
    const { currentDrawing, isDrawing } = get();
    if (!currentDrawing || !isDrawing) return;

    let updatedPoints: Point[];
    
    if (currentDrawing.type === 'brush') {
      // For brush, add all points
      updatedPoints = [...currentDrawing.points, point];
    } else {
      // For other tools, keep only first point and update end point
      updatedPoints = [currentDrawing.points[0], point];
    }

    set({
      currentDrawing: { ...currentDrawing, points: updatedPoints },
    });
  },

  finishDrawing: () => {
    const { currentDrawing, drawings, history, historyIndex } = get();
    if (!currentDrawing) return;

    // Only add if we have at least 2 points (except for text which needs 1)
    if (currentDrawing.points.length >= 1) {
      const newDrawings = [...drawings, currentDrawing];
      
      // Update history for undo/redo
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newDrawings);
      
      set({
        drawings: newDrawings,
        currentDrawing: null,
        isDrawing: false,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    } else {
      set({ currentDrawing: null, isDrawing: false });
    }
  },

  cancelDrawing: () => {
    set({ currentDrawing: null, isDrawing: false });
  },

  addDrawing: (drawing) => {
    const { drawings, history, historyIndex } = get();
    const newDrawings = [...drawings, drawing];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDrawings);
    
    set({
      drawings: newDrawings,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  removeDrawing: (id) => {
    const { drawings, history, historyIndex } = get();
    const newDrawings = drawings.filter((d) => d.id !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDrawings);
    
    set({
      drawings: newDrawings,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  clearAllDrawings: () => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([]);
    
    set({
      drawings: [],
      currentDrawing: null,
      isDrawing: false,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        drawings: history[newIndex],
        historyIndex: newIndex,
        currentDrawing: null,
        isDrawing: false,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        drawings: history[newIndex],
        historyIndex: newIndex,
        currentDrawing: null,
        isDrawing: false,
      });
    }
  },

  setDrawingText: (id, text) => {
    const { drawings } = get();
    set({
      drawings: drawings.map((d) =>
        d.id === id ? { ...d, text } : d
      ),
    });
  },
}));
