import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useToast, Button, Input, Card } from '../components/ui';
import { Trello, ArrowRight } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data);
      toast('Account created successfully! Welcome to Taskora.', 'success');
      navigate('/');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed. Email may already be taken.';
      toast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full z-10 space-y-6">
        <div className="text-center">
          <div className="inline-flex bg-indigo-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-600/30">
            <Trello className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 m-0">Taskora</h1>
          <p className="text-slate-400 text-sm mt-2">Create your account to start organizing.</p>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-6 text-left">Get started for free</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...registerField('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...registerField('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...registerField('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              {...registerField('password_confirmation')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" icon={ArrowRight}>
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-slate-500 text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};
