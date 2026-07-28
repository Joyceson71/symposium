'use client';

import React, { useRef, useEffect } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import TextScramble from '@/components/ui/TextScramble';
import EventCard from '@/components/ui/EventCard';
import Button from '@/components/ui/Button';

const ALL_EVENTS = [
  {
    id: 1,
    title: 'Hackathon 2k26',
    description: 'A 24-hour coding marathon to solve real-world problems using modern tech stacks.',
    date: 'Day 1 - 09:00 AM',
  },
  {
    id: 2,
    title: 'Robo Wars',
    description: 'Design, build, and battle. May the best bot win in this intense arena combat.',
    date: 'Day 1 - 02:00 PM',
  },
  {
    id: 3,
    title: 'Paper Presentation',
    description: 'Showcase your research and technical papers to a panel of industry experts.',
    date: 'Day 2 - 10:00 AM',
  },
  {
    id: 4,
    title: 'Circuit Debugging',
    description: 'Test your electronic skills by finding and fixing complex circuit bugs.',
    date: 'Day 2 - 11:30 AM',
  },
  {
    id: 5,
    title: 'Ideathon',
    description: 'Pitch your innovative startup ideas to investors and win seed funding.',
    date: 'Day 2 - 01:00 PM',
  },
  {
    id: 6,
    title: 'Tech Quiz',
    description: 'Test your knowledge on the latest trends in tech and electronics.',
    date: 'Day 2 - 03:00 PM',
  },
];

export default function EventsPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Convert vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-80%']);

  return (
    <div className="bg-ink min-h-screen">
      {/* Header */}
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="font-display text-5xl md:text-7xl text-snow mb-4">
          <TextScramble text="ALL EVENTS" />
        </h1>
        <p className="text-steel max-w-2xl mx-auto">
          Explore our wide range of technical and non-technical events designed to test your skills and push your boundaries.
        </p>
      </div>

      {/* Horizontal Scroll Section */}
      <div 
        ref={targetRef} 
        className={`${shouldReduceMotion ? 'hidden' : 'h-[300vh] relative'}`}
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div 
            style={{ x }} 
            className="flex gap-8 px-6 pb-20 w-max"
          >
            {ALL_EVENTS.map((event) => (
              <div key={event.id} className="w-[350px] md:w-[450px]">
                <EventCard {...event} className="!h-[400px]" />
                <div className="mt-6 flex justify-between items-center">
                  <span className="font-orbitron text-steel text-sm">FEE: ₹200</span>
                  <Button href={`/register?event=${event.id}`} className="!py-2 !px-4 text-sm">
                    REGISTER
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Fallback for mobile / reduced motion */}
      <div className={`${shouldReduceMotion ? 'block' : 'hidden'} max-w-7xl mx-auto px-6 pb-32`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_EVENTS.map((event) => (
            <div key={event.id} className="w-full">
              <EventCard {...event} />
              <div className="mt-6 flex justify-between items-center">
                <span className="font-orbitron text-steel text-sm">FEE: ₹200</span>
                <Button href={`/register?event=${event.id}`} className="!py-2 !px-4 text-sm">
                  REGISTER
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
