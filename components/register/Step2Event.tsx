'use client';

import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '../ui/Button';

const EVENTS = [
  { id: '1', title: 'Paper Presentation', type: 'Technical' },
  { id: '2', title: 'Project Expo', type: 'Technical' },
  { id: '3', title: 'Circuit Breakers', type: 'Technical' },
  { id: '4', title: 'Technical Quiz', type: 'Technical' },
  { id: '5', title: 'Minute to Win', type: 'Non-Technical' },
  { id: '6', title: 'Detective', type: 'Non-Technical' },
  { id: '7', title: 'Box Hunt', type: 'Non-Technical' },
  { id: '8', title: 'Start Music', type: 'Non-Technical' },
];

export default function Step2Event({ nextStep, prevStep }: { nextStep: () => void, prevStep: () => void }) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const searchParams = useSearchParams();
  const selectedEvent = watch('eventId');

  // Pre-select event if passed in URL
  useEffect(() => {
    const eventIdFromUrl = searchParams.get('event');
    if (eventIdFromUrl && EVENTS.find(e => e.id === eventIdFromUrl)) {
      setValue('eventId', eventIdFromUrl);
    }
  }, [searchParams, setValue]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-display text-3xl text-ember mb-6">SELECT MODULE</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {EVENTS.map((event) => (
          <label 
            key={event.id}
            className={`relative flex flex-col p-4 cursor-pointer border rounded-lg transition-all duration-300 ${
              selectedEvent === event.id 
                ? 'border-ember bg-ember/10 shadow-[0_0_15px_rgba(255,59,48,0.2)]' 
                : 'border-white/10 bg-white/5 hover:border-white/30'
            }`}
          >
            <input 
              type="radio" 
              value={event.id} 
              {...register('eventId')}
              className="sr-only"
            />
            <span className="font-bold text-snow mb-1">{event.title}</span>
            <span className="text-xs text-steel font-orbitron uppercase">{event.type}</span>
            
            {selectedEvent === event.id && (
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-ember animate-pulse" />
            )}
          </label>
        ))}
      </div>
      {errors.eventId && <span className="text-ember text-sm">{errors.eventId?.message as string}</span>}

      <div className="flex justify-between pt-6">
        <Button type="button" onClick={prevStep} className="!bg-transparent border border-steel !text-steel hover:!text-snow">
          BACK
        </Button>
        <Button type="button" onClick={nextStep}>CONTINUE</Button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,59,48,0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
