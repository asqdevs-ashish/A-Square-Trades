'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTradingStore } from '@/lib/store';

interface IndicatorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IndicatorPanel({ open, onOpenChange }: IndicatorPanelProps) {
  const { indicators, toggleIndicator } = useTradingStore();

  const activeCount = indicators.filter((i) => i.active).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Technical Indicators</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-[var(--neon-blue)]/20 px-2 py-0.5 text-xs font-normal text-[var(--neon-blue)]">
                {activeCount} active
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-2 pr-4">
            <AnimatePresence>
              {indicators.map((indicator) => (
                <motion.div
                  key={indicator.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    indicator.active
                      ? 'border-[var(--neon-blue)]/50 bg-[var(--neon-blue)]/10'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                        indicator.active
                          ? 'bg-[var(--neon-blue)] text-[var(--primary-foreground)]'
                          : 'bg-secondary'
                      }`}
                    >
                      {indicator.shortName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium">{indicator.shortName}</div>
                      <div className="text-xs text-muted-foreground">
                        {indicator.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {indicator.params && (
                      <span className="text-xs text-muted-foreground">
                        {Object.entries(indicator.params)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(', ')}
                      </span>
                    )}
                    <Switch
                      checked={indicator.active}
                      onCheckedChange={() => toggleIndicator(indicator.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            <Check className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
