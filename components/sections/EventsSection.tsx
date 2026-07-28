'use client';

import React from 'react';
import TextScramble from '../ui/TextScramble';
import EventCard from '../ui/EventCard';
import Button from '../ui/Button';

const PREVIEW_EVENTS = [
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
];

export default function EventsSection() {
  return (
    <section className="relative w-full py-32 bg-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-ember font-orbitron tracking-widest text-sm mb-4 uppercase">
              <TextScramble text="Execute // Modules" />
            </h2>
            <h3 className="font-display text-4xl md:text-6xl text-snow">
              FEATURED EVENTS
            </h3>
          </div>
          <Button href="/events" className="hidden md:block !bg-transparent border border-ember !text-ember hover:!bg-ember/10">
            VIEW ALL EVENTS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PREVIEW_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button href="/events" className="w-full !bg-transparent border border-ember !text-ember hover:!bg-ember/10">
            VIEW ALL EVENTS
          </Button>
        </div>
      </div>
    </section>
  );
}
