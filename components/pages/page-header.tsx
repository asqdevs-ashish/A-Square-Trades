'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Trade' },
  { href: '/markets', label: 'Markets' },
  { href: '/crypto', label: 'Crypto' },
  { href: '/stocks', label: 'Stocks' },
  { href: '/forex', label: 'Forex' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function PageHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)]">
            <span className="text-sm font-bold text-white">A²</span>
          </div>
          <span className="text-lg font-semibold tracking-tight neon-text">Trade</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`relative ${
                    isActive ? 'text-[var(--neon-blue)]' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--neon-blue)]"
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/">
            <Button variant="default" className="bg-[var(--neon-blue)] text-[var(--primary-foreground)] hover:bg-[var(--neon-blue)]/90">
              Start Trading
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-4 py-2 text-lg transition-colors ${
                      isActive
                        ? 'bg-[var(--neon-blue)]/20 text-[var(--neon-blue)]'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Button className="mt-4 w-full bg-[var(--neon-blue)] text-[var(--primary-foreground)] hover:bg-[var(--neon-blue)]/90">
                  Start Trading
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
