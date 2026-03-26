'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from './page-header';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Send us an email anytime',
    value: 'support@a2trade.com',
    href: 'mailto:support@a2trade.com',
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: '24/7 support available',
    value: 'Start a conversation',
    href: '#',
  },
  {
    icon: MapPin,
    title: 'Office',
    description: 'Visit our headquarters',
    value: 'San Francisco, CA',
    href: '#',
  },
];

export function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Have questions about A² Trade? We are here to help. Reach out to us
            and we will get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {contactMethods.map((method, index) => (
              <Card
                key={method.title}
                className="border-border/50 bg-card/50 transition-all hover:border-[var(--neon-blue)]/50"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20">
                    <method.icon className="h-6 w-6 text-[var(--neon-blue)]" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{method.title}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                  <a
                    href={method.href}
                    className="text-[var(--neon-blue)] hover:underline"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/20">
                      <Check className="h-8 w-8 text-[var(--success)]" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We will get back to you shortly.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full gap-2 bg-[var(--neon-blue)] text-[var(--primary-foreground)] hover:bg-[var(--neon-blue)]/90 md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
