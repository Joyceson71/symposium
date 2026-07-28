'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function PaymentUpload() {
  const [fileName, setFileName] = useState('');

  // Note: This is just a UI component for aesthetics as per typical requirements.
  // Real implementation would upload to S3/Cloudinary and save the URL.
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="mt-4">
      <label className="text-sm font-bold text-snow tracking-wider uppercase block mb-1">Screenshot (Optional)</label>
      <div className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer">
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
    </div>
  );
}
