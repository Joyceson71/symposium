'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterData } from '@/lib/validations';
import Step1Personal from './Step1Personal';
import Step2Event from './Step2Event';
import Step3Payment from './Step3Payment';
import SuccessModal from './SuccessModal';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const methods = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      college: '',
      department: '',
      year: '1',
      eventId: '',
      paymentId: '',
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ['fullName', 'email', 'phone', 'college', 'department', 'year'];
    } else if (step === 2) {
      fieldsToValidate = ['eventId'];
    }

    const isStepValid = await methods.trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-ink border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl relative z-10">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-10 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-ember -z-10 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-orbitron text-sm transition-colors duration-300 ${
              step >= i ? 'bg-ember text-white' : 'bg-ink border border-white/20 text-steel'
            }`}
          >
            {i}
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && <Step1Personal nextStep={nextStep} />}
          {step === 2 && <Step2Event nextStep={nextStep} prevStep={prevStep} />}
          {step === 3 && <Step3Payment prevStep={prevStep} isSubmitting={isSubmitting} />}
        </form>
      </FormProvider>

      {showSuccess && <SuccessModal />}
    </div>
  );
}
