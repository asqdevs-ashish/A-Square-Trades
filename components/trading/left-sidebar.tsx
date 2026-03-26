'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Minus,
  ArrowDownUp,
  Square,
  Pencil,
  Type,
  Layers,
  MousePointer,
  Trash2,
  RotateCcw,
  Undo2,
  Redo2,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTradingStore } from '@/lib/store';
import { useDrawingStore, type Drawing } from '@/store/drawingStore';

const DRAWING_TOOLS: { id: Drawing['type']; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'trendLine', name: 'Trend Line', icon: TrendingUp },
  { id: 'horizontalLine', name: 'Horizontal Line', icon: Minus },
  { id: 'verticalLine', name: 'Vertical Line', icon: ArrowDownUp },
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'brush', name: 'Brush', icon: Pencil },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'fibonacci', name: 'Fibonacci', icon: Layers },
];

const COLORS = [
  '#00d4ff', // Neon blue
  '#7c3aed', // Purple
  '#10b981', // Green
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#ffffff', // White
  '#6b7280', // Gray
];

export function LeftSidebar() {
  const { isLeftSidebarOpen } = useTradingStore();
  const { 
    activeTool, 
    setActiveTool, 
    clearAllDrawings, 
    undo, 
    redo, 
    activeColor, 
    setActiveColor,
    historyIndex,
    history,
  } = useDrawingStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleToolSelect = (toolId: Drawing['type']) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  const handleResetView = () => {
    // Clear all drawings and reset the drawing store
    clearAllDrawings();
  };

  return (
    <AnimatePresence>
      {isLeftSidebarOpen && (
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="flex w-14 flex-col items-center border-r border-border bg-sidebar py-4"
        >
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-col items-center gap-2">
              {/* Cursor/Select Tool */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={!activeTool ? 'default' : 'ghost'}
                    size="icon"
                    className={`h-9 w-9 ${
                      !activeTool
                        ? 'bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/30'
                        : ''
                    }`}
                    onClick={() => setActiveTool(null)}
                  >
                    <MousePointer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Select (Esc)</p>
                </TooltipContent>
              </Tooltip>

              <Separator className="my-2 w-8" />

              {/* Drawing Tools */}
              {DRAWING_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;

                return (
                  <Tooltip key={tool.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        size="icon"
                        className={`h-9 w-9 ${
                          isActive
                            ? 'bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/30'
                            : ''
                        }`}
                        onClick={() => handleToolSelect(tool.id)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{tool.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              <Separator className="my-2 w-8" />

              {/* Color Picker */}
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 relative"
                      >
                        <Palette className="h-4 w-4" />
                        <span 
                          className="absolute bottom-1 right-1 h-2 w-2 rounded-full border border-background"
                          style={{ backgroundColor: activeColor }}
                        />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Drawing Color</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent side="right" className="w-auto p-2">
                  <div className="grid grid-cols-4 gap-1">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        className={`h-6 w-6 rounded-md border-2 transition-transform hover:scale-110 ${
                          activeColor === color ? 'border-foreground' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setActiveColor(color)}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Separator className="my-2 w-8" />

              {/* Undo */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 ${!canUndo ? 'opacity-40' : ''}`}
                    onClick={undo}
                    disabled={!canUndo}
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Undo (Ctrl+Z)</p>
                </TooltipContent>
              </Tooltip>

              {/* Redo */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 ${!canRedo ? 'opacity-40' : ''}`}
                    onClick={redo}
                    disabled={!canRedo}
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Redo (Ctrl+Y)</p>
                </TooltipContent>
              </Tooltip>

              <Separator className="my-2 w-8" />

              {/* Clear Drawings */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={clearAllDrawings}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Clear All Drawings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground"
                    onClick={handleResetView}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Reset View</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
