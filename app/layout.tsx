import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/layout/CustomCursor';
import LoadingScreen from '@/components/layout/LoadingScreen';
import SmoothScroll from '@/components/layout/SmoothScroll';
import PageTransition from '@/components/layout/PageTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'TechnoKings-2k26 | [College Name Placeholder]', // TODO: Update College Name
  description: 'A premium, futuristic ECE department symposium experience built with Next.js.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-snow antialiased overflow-x-hidden">
        <LoadingScreen />
        <CustomCursor />
        <SmoothScroll>
          <Navbar />
          <PageTransition>
            <main className="min-h-screen">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
