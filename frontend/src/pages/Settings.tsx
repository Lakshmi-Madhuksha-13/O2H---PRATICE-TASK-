import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import client from '../api/client';
import { useTheme } from '../contexts/ThemeContext';
import { useToast, Button, Input, Card } from '../components/ui';
import { Sun, Moon, ShieldCheck, KeyRound } from 'lucide-react';

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await client.put('/profile/password', data);
      toast('Password changed successfully!', 'success');
      reset({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update password. Verify your current password.';
      toast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Workspace</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Visual Settings / Theme */}
        <Card className="text-left space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100">Visual Preferences</h3>
            <p className="text-slate-400 text-xs mt-0.5">Toggle between dark mode and light mode layouts.</p>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-indigo-400" />
              ) : (
                <Sun className="h-5 w-5 text-indigo-600" />
              )}
              <span className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
            >
              Toggle
            </button>
          </div>
        </Card>

        {/* Change Password Form */}
        <Card className="lg:col-span-2 text-left space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100">Security Credentials</h3>
            <p className="text-slate-400 text-xs mt-0.5">Ensure your account is using a strong password.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={errors.current_password?.message}
              {...register('current_password')}
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

            <div className="pt-4 border-t border-slate-900 flex justify-end">
              <Button type="submit" isLoading={isSubmitting} icon={KeyRound}>
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
