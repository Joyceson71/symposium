'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, Trophy, Users, Zap, Terminal } from 'lucide-react';
import Button from '../ui/Button';
import TextScramble from '../ui/TextScramble';

const HeroScene = dynamic(() => import('../3d/HeroScene'), { ssr: false });

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20 pb-10">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/60 to-ink z-10 pointer-events-none" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ember/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />

      {/* Main Content */}
      <motion.div 
        className="relative z-20 text-center px-4 max-w-6xl mx-auto flex flex-col items-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating Badges */}
        <div className="hidden md:block absolute top-20 left-10 lg:left-0 z-30">
          <motion.div variants={badgeVariants} className="flex items-center gap-2 bg-ink/50 backdrop-blur-md border border-steel/20 px-4 py-2 rounded-full shadow-lg shadow-ember/5 hover:border-ember/50 transition-colors cursor-default">
            <Trophy className="w-4 h-4 text-ember" />
            <span className="text-snow text-sm font-medium tracking-wide">₹5L+ Prize Pool</span>
          </motion.div>
        </div>
        
        <div className="hidden md:block absolute top-40 right-10 lg:-right-10 z-30">
          <motion.div variants={badgeVariants} className="flex items-center gap-2 bg-ink/50 backdrop-blur-md border border-steel/20 px-4 py-2 rounded-full shadow-lg shadow-cyan-500/5 hover:border-cyan-500/50 transition-colors cursor-default delay-100">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-snow text-sm font-medium tracking-wide">5000+ Attendees</span>
          </motion.div>
        </div>
        
        <div className="hidden md:block absolute bottom-40 left-20 z-30">
          <motion.div variants={badgeVariants} className="flex items-center gap-2 bg-ink/50 backdrop-blur-md border border-steel/20 px-4 py-2 rounded-full shadow-lg shadow-purple-500/5 hover:border-purple-500/50 transition-colors cursor-default delay-200">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-snow text-sm font-medium tracking-wide">24+ Hackathons</span>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ember/30 bg-ember/10 backdrop-blur-sm">
          <Terminal className="w-4 h-4 text-ember" />
          <h2 className="text-ember font-orbitron tracking-[0.2em] text-xs md:text-sm uppercase font-semibold">
            <TextScramble text="System Initialization Complete" />
          </h2>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="font-display text-7xl md:text-8xl lg:text-[10rem] leading-none text-snow tracking-wider mb-6 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] relative"
        >
          <span className="absolute -inset-2 bg-gradient-to-r from-ember/0 via-snow/10 to-cyan-500/0 blur-2xl -z-10 rounded-full" />
          TECHNO <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-snow via-snow/90 to-steel/50">KINGS</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-steel text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 font-light leading-relaxed"
        >
          Experience the <strong className="text-snow font-medium">pinnacle of engineering innovation</strong> at our annual national-level ECE symposium. Enter a realm where technology meets creativity.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm md:text-base text-snow/80 font-orbitron">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <Calendar className="w-5 h-5 text-ember" />
            <span>March 15-16, 2026</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-steel/50" />
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Main Auditorium, NIT</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-ember to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 -z-10" />
          <Button href="/register" className="w-full sm:w-auto text-lg px-8 py-4 shadow-[0_0_20px_rgba(255,51,102,0.3)] hover:shadow-[0_0_30px_rgba(255,51,102,0.5)]">
            SECURE YOUR PASS
          </Button>
          <Button href="/events" className="w-full sm:w-auto text-lg px-8 py-4 !bg-ink/80 backdrop-blur-md border-2 border-steel/30 hover:border-ember/50 hover:!bg-ember/10 transition-all duration-300">
            EXPLORE EVENTS
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-steel/60 text-xs font-orbitron tracking-widest uppercase">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-ember/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
