'use client';

import { motion } from 'framer-motion';
import { BarChart3, Shield, Zap, Globe, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from './page-header';

const features = [
  {
    icon: BarChart3,
    title: 'Advanced Charts',
    description: 'Professional-grade charting with real-time data, multiple timeframes, and 50+ technical indicators.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Execute trades in milliseconds with our optimized infrastructure and low-latency connections.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your assets are protected with institutional-grade security, 2FA, and encrypted communications.',
  },
  {
    icon: Globe,
    title: 'Global Markets',
    description: 'Access crypto, stocks, and forex markets from around the world, all in one platform.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join thousands of traders sharing insights, strategies, and market analysis.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized as a leading trading platform by industry experts and publications.',
  },
];

const stats = [
  { value: '500K+', label: 'Active Traders' },
  { value: '$10B+', label: 'Daily Volume' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-blue)]/5 via-transparent to-[var(--neon-purple)]/5" />
          <div className="container relative mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
                About <span className="neon-text">A² Trade</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                We are building the future of trading. A platform that combines powerful
                technology with an intuitive interface, making professional trading
                accessible to everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl font-bold text-[var(--neon-blue)] md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold">Why Choose A² Trade?</h2>
              <p className="mt-2 text-muted-foreground">
                Built by traders, for traders
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 bg-card/50 transition-all hover:border-[var(--neon-blue)]/50">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20">
                        <feature.icon className="h-6 w-6 text-[var(--neon-blue)]" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="border-t border-border bg-card/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  At A² Trade, we believe that everyone should have access to
                  professional-grade trading tools. Our mission is to democratize
                  trading by providing a platform that is powerful enough for
                  experienced traders, yet intuitive enough for beginners.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  We are constantly innovating, adding new features, and improving
                  our platform based on feedback from our community of traders.
                  Together, we are shaping the future of trading.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
