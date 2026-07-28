'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink/80 backdrop-blur-md py-4 shadow-lg border-b border-white/5' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-snow tracking-widest hover:text-ember transition-colors">
          TK<span className="text-ember">26</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {[
            { name: 'Home', path: '/' },
            { name: 'Events', path: '/events' },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`hover:text-ember transition-colors ${
                pathname === link.path ? 'text-ember' : 'text-snow/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            className="px-5 py-2 bg-ember/10 border border-ember text-ember rounded hover:bg-ember hover:text-white transition-all duration-300"
          >
            REGISTER NOW
          </Link>
        </div>
      </div>
    </nav>
  );
}
