'use client';

import React, { useRef, useEffect } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import TextScramble from '@/components/ui/TextScramble';
import EventCard from '@/components/ui/EventCard';
import Button from '@/components/ui/Button';

const ALL_EVENTS = [
  {
    id: '1',
    title: 'Paper Presentation',
    description: 'Showcase your research and technical papers to a panel of industry experts. Unveil the future of electronics.',
    date: 'Day 1 - 10:00 AM',
    type: 'Technical'
  },
  {
    id: '2',
    title: 'Project Expo',
    description: 'Demonstrate your innovative working models and hardware prototypes. Let your ideas take physical form.',
    date: 'Day 1 - 01:00 PM',
    type: 'Technical'
  },
  {
    id: '3',
    title: 'Circuit Breakers',
    description: 'Test your electronic skills by finding, fixing, and optimizing complex circuit bugs against the clock.',
    date: 'Day 2 - 09:30 AM',
    type: 'Technical'
  },
  {
    id: '4',
    title: 'Technical Quiz',
    description: 'Battle of the brains. Test your knowledge on the latest trends in tech, electronics, and engineering.',
    date: 'Day 2 - 11:30 AM',
    type: 'Technical'
  },
  {
    id: '5',
    title: 'Minute to Win',
    description: 'Fast-paced, 60-second challenges that will test your reflexes, coordination, and sanity. Complete the task before time runs out.',
    date: 'Day 1 - 03:00 PM',
    type: 'Non-Technical'
  },
  {
    id: '6',
    title: 'Detective',
    description: 'Follow the clues, solve the riddles, and uncover the mystery hidden within the campus. Unleash your inner Sherlock.',
    date: 'Day 2 - 01:00 PM',
    type: 'Non-Technical'
  },
  {
    id: '7',
    title: 'Box Hunt',
    description: 'A thrilling treasure hunt where teams compete to locate hidden boxes filled with rewards across multiple zones.',
    date: 'Day 1 - 11:00 AM',
    type: 'Non-Technical'
  },
  {
    id: '8',
    title: 'Start Music',
    description: 'A musical face-off. Guess the song, sing along, and compete in fun auditory challenges with your team.',
    date: 'Day 2 - 03:30 PM',
    type: 'Non-Technical'
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
