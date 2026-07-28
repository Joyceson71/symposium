'use client';

import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import Button from '../ui/Button';
import PaymentUpload from './PaymentUpload';

export default function Step3Payment({ prevStep, isSubmitting }: { prevStep: () => void, isSubmitting: boolean }) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-display text-3xl text-ember mb-6">FEE TRANSACTION</h2>
      
      <div className="bg-white/5 border border-ember/30 rounded-lg p-6 flex flex-col items-center text-center">
        <h3 className="font-bold text-snow mb-2">Registration Fee: ₹200</h3> {/* // TODO: Set registration fee */}
        <p className="text-steel text-sm mb-6">Scan the QR code below using any UPI app.</p>
        
        <div className="bg-white p-4 rounded-xl mb-4">
          {/* // TODO: Replace with real QR */}
          <div className="w-48 h-48 bg-gray-200 relative flex items-center justify-center border-4 border-black">
            <span className="text-black font-bold">QR CODE PLACEHOLDER</span>
            <Image 
              src="/gpay-qr.png" 
              alt="GPay QR Code" 
              fill 
              className="object-cover opacity-0" // Hidden until real image is added
            />
          </div>
        </div>
        
        <div className="font-orbitron text-sm text-snow tracking-widest bg-black/50 px-4 py-2 rounded">
          UPI ID: symp2k26@okicici {/* // TODO: Update UPI ID */}
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-bold text-snow tracking-wider uppercase">Transaction ID (UTR)</label>
        <input
          type="text"
          {...register('paymentId')}
          placeholder="12-digit UPI Ref Number"
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-snow focus:border-ember focus:outline-none transition-colors"
        />
        {errors.paymentId && <span className="text-ember text-xs">{errors.paymentId?.message as string}</span>}
      </div>

      <PaymentUpload />

      <div className="flex justify-between pt-6">
        <Button type="button" onClick={prevStep} className="!bg-transparent border border-steel !text-steel hover:!text-snow">
          BACK
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'PROCESSING...' : 'CONFIRM REGISTRATION'}
        </Button>
      </div>
    </div>
  );
}
