import RegisterForm from '@/components/register/RegisterForm';
import TextScramble from '@/components/ui/TextScramble';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-ink pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ember/10 blur-[200px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ember/5 blur-[150px] pointer-events-none rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl text-snow mb-4">
            <TextScramble text="ONBOARDING" />
          </h1>
          <p className="text-steel">Complete your registration to secure your access pass.</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
