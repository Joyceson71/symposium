'use client';

import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative w-full bg-black pt-20 pb-10 text-snow overflow-hidden">
      {/* SPIDER-WEB DECORATION */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.06]">
        <Image
          src="/spider-web.svg"
          alt="Web decoration"
          fill
          className="object-cover object-top"
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* TOP SECTION (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <h2 className="font-display text-3xl text-ember tracking-wider">
              TECHNO KINGS 2K26
            </h2>
            <p className="text-steel font-medium">
              [College Name Placeholder]
            </p>
            <p className="italic text-sm text-snow/70">
              "Where Engineers Swing Into the Future"
            </p>
          </div>

          {/* Center Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-lg text-snow mb-2 tracking-wide">QUICK LINKS</h3>
            <div className="flex flex-col space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Events', path: '/events' },
                { name: 'Register', path: '/register' },
                { name: 'About', path: '/#about' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-steel hover:text-ember transition-all duration-300 hover:translate-x-[2px] w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-lg text-snow mb-2 tracking-wide">CONNECT WITH US</h3>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mb-2">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-ember hover:text-white transition-colors w-10 h-10 flex items-center justify-center font-bold text-xs">
                IG
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-ember hover:text-white transition-colors w-10 h-10 flex items-center justify-center font-bold text-xs">
                IN
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-ember hover:text-white transition-colors w-10 h-10 flex items-center justify-center font-bold text-xs">
                WA
              </a>
              {/* // TODO: Add real social links */}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col space-y-2 text-sm text-steel">
              <a href="mailto:events@college.edu" className="flex items-center space-x-2 hover:text-ember transition-colors">
                <Mail size={16} />
                <span>events@[college].edu</span>
                {/* // TODO: Add real email */}
              </a>
              <a href="tel:+910000000000" className="flex items-center space-x-2 hover:text-ember transition-colors">
                <Phone size={16} />
                <span>+91 XXXXXXXXXX</span>
                {/* // TODO: Add real phone number */}
              </a>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#CC0000] to-transparent opacity-50 mb-8" />

        {/* BOTTOM SECTION */}
        <div className="text-center text-xs text-steel flex flex-col space-y-2">
          <p>© 2026 TechnoKings | ECE Department | [College Name]</p>
          <p>Designed with ❤️ by ECE Dept</p>
        </div>
      </div>
    </footer>
  );
}
