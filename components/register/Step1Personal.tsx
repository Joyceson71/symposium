'use client';

import { useFormContext } from 'react-hook-form';
import Button from '../ui/Button';

export default function Step1Personal({ nextStep }: { nextStep: () => void }) {
  const { register, formState: { errors } } = useFormContext();

  const InputRow = ({ label, name, type = 'text', placeholder }: any) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-bold text-snow tracking-wider uppercase">{label}</label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-snow focus:border-ember focus:outline-none transition-colors"
      />
      {errors[name] && <span className="text-ember text-xs">{errors[name]?.message as string}</span>}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-display text-3xl text-ember mb-6">PERSONAL DETAILS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputRow label="Full Name" name="fullName" placeholder="John Doe" />
        <InputRow label="Email Address" name="email" type="email" placeholder="john@example.com" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputRow label="Phone Number" name="phone" placeholder="9876543210" />
        <InputRow label="College Name" name="college" placeholder="Institute of Technology" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputRow label="Department" name="department" placeholder="ECE" />
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-bold text-snow tracking-wider uppercase">Year of Study</label>
          <select 
            {...register('year')}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-snow focus:border-ember focus:outline-none transition-colors appearance-none"
          >
            <option value="1" className="bg-ink">1st Year</option>
            <option value="2" className="bg-ink">2nd Year</option>
            <option value="3" className="bg-ink">3rd Year</option>
            <option value="4" className="bg-ink">4th Year</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button type="button" onClick={nextStep}>CONTINUE</Button>
      </div>
    </div>
  );
}
