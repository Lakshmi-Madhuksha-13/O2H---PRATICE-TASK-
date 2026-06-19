import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useToast, Button, Input, Card } from '../components/ui';
import { Trello, ArrowLeft, KeyRound } from 'lucide-react';

const resetSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  // Pre-fill parameters if present in URL
  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    if (email) setValue('email', email);
    if (token) setValue('token', token);
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(data);
      toast('Password reset successful! You can now log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to reset password. Please check your token.';
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
          <p className="text-slate-400 text-sm mt-2">Reset your password securely.</p>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6 text-left font-sans">Set new password</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="demo@taskora.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Reset Token"
              type="text"
              placeholder="Enter recovery token"
              error={errors.token?.message}
              {...register('token')}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              {...register('password_confirmation')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" icon={KeyRound}>
              Reset Password
            </Button>
          </form>
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
