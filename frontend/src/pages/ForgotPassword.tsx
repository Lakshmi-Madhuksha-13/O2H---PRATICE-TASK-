import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useToast, Button, Input, Card } from '../components/ui';
import { Trello, Mail, ArrowLeft, KeyRound } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      const token = await forgotPassword(data.email);
      setResetToken(token);
      setSubmittedEmail(data.email);
      toast('Simulated email sent! Review instructions below.', 'success');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Email address not found.';
      toast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        <div className="text-center">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-600/30">
            <Trello className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 m-0">Taskora</h1>
          <p className="text-slate-400 text-sm mt-2">Recover your account credentials.</p>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-2 text-left">Forgot Password?</h2>
          <p className="text-slate-400 text-xs text-left mb-6">
            Enter your email address and we'll simulate sending a secure reset link.
          </p>

          {!resetToken ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="demo@taskora.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" isLoading={isLoading} className="w-full mt-2" icon={Mail}>
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-left">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                  <KeyRound className="h-3.5 w-3.5 mr-1" />
                  Simulated Credentials Found
                </p>
                <p className="text-xs text-slate-400">
                  Password reset link sent to: <span className="text-slate-200 font-semibold">{submittedEmail}</span>
                </p>
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-2.5 rounded-lg">
                  <p className="text-[11px] text-slate-400">Reset Token:</p>
                  <code className="text-xs font-bold text-indigo-300 select-all">{resetToken}</code>
                </div>
              </div>

              <Link
                to={`/reset-password?email=${encodeURIComponent(submittedEmail)}&token=${resetToken}`}
                className="block text-center w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-lg shadow-indigo-600/25 transition-all"
              >
                Go to Reset Password Screen
              </Link>
            </div>
          )}
        </Card>

        <p className="text-center text-slate-500 text-xs">
          <Link to="/login" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};
