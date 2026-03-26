import type { Metadata } from 'next';
import { ContactPage } from '@/components/pages/contact-page';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the A² Trade team. We are here to help with any questions about our trading platform.',
  keywords: ['contact', 'support', 'help', 'customer service', 'get in touch'],
  openGraph: {
    title: 'Contact Us | A² Trade',
    description: 'Get in touch with the A² Trade team for any questions or support.',
    url: 'https://a-square-trades.vercel.app/contact',
  },
  twitter: {
    title: 'Contact Us | A² Trade',
    description: 'Get in touch with the A² Trade team for any questions or support.',
  },
  alternates: {
    canonical: 'https://a-square-trades.vercel.app/contact',
  },
};

export default function Contact() {
  return <ContactPage />;
}
