'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export default function PaymentUpload() {
  const [fileName, setFileName] = useState('');
  const { register, setValue, formState: { errors } } = useFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setValue('paymentScreenshot', e.target.files[0].name, { shouldValidate: true });
    } else {
      setFileName('');
      setValue('paymentScreenshot', '', { shouldValidate: true });
    }
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-bold text-snow tracking-wider uppercase block mb-1">Screenshot (Required)</label>
      <div className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer ${errors.paymentScreenshot ? 'border-ember' : 'border-white/20'}`}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <UploadCloud className="text-ember" size={24} />
          {fileName ? (
            <span className="text-snow font-bold text-sm">{fileName}</span>
          ) : (
            <>
              <span className="text-snow font-bold text-sm">Click to upload screenshot</span>
              <span className="text-steel text-xs">JPG, PNG, PDF (Max 2MB)</span>
            </>
          )}
        </div>
      </div>
      {errors.paymentScreenshot && <span className="text-ember text-xs mt-1 block">{errors.paymentScreenshot?.message as string}</span>}
    </div>
  );
}
