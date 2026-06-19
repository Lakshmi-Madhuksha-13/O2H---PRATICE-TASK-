import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useToast, Button, Input, Card } from '../components/ui';
import { Trello, Lock, Mail, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data);
      toast('Welcome back to Taskora!', 'success');
      navigate('/');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setValue('email', 'demo@taskora.com');
    setValue('password', 'Demo@123');
    toast('Demo credentials auto-filled. Click Login!', 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Visual background gradient blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-600/30">
            <Trello className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 m-0">Taskora</h1>
          <p className="text-slate-400 text-sm mt-2">Organize. Execute. Achieve.</p>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6 text-left">Login to your account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...registerField('email')}
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  Forgot password?
                </Link>
              </div>
              <input
                className={`w-full px-3 py-2 text-sm bg-slate-900 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-rose-500' : 'border-slate-800'
                }`}
                type="password"
                placeholder="••••••••"
                {...registerField('password')}
              />
              {errors.password && <p className="text-xs font-medium text-rose-500 text-left">{errors.password.message}</p>}
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" icon={ArrowRight}>
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 border border-slate-800 rounded-full font-medium">Or Use Demo User</span>
            </div>
          </div>

          {/* Demo Button */}
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 font-medium rounded-lg text-sm transition-all duration-300"
          >
            Auto-fill Demo Credentials
          </button>
        </Card>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-xs">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
