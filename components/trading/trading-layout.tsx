'use client';

import { motion } from 'framer-motion';
import { Navbar } from './navbar';
import { LeftSidebar } from './left-sidebar';
import { Watchlist } from './watchlist';
import { TradingChart } from './trading-chart';

export function TradingLayout() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen flex-col overflow-hidden bg-background"
    >
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        
        <main className="flex flex-1 flex-col overflow-hidden">
          <TradingChart />
        </main>
        
        <Watchlist />
      </div>
    </motion.div>
  );
}
