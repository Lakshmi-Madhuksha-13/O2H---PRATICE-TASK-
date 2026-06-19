import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useToast, Button, Input, Card } from '../components/ui';
import { User as UserIcon, Mail, Calendar, UserCheck } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast('Profile updated successfully!', 'success');
      reset(data); // reset form dirty state
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update profile details.';
      toast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Not Available';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Account</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card View */}
        <Card className="flex flex-col items-center py-8 text-center">
          <div className="h-20 w-20 rounded-full bg-indigo-600/10 border-2 border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-3xl mb-4">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-lg font-bold text-slate-100 light:text-slate-900">{user?.name}</h3>
          <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>

          <div className="w-full border-t border-slate-900 light:border-slate-150 pt-5 mt-5 px-4 text-left space-y-4">
            <div className="flex items-center space-x-3 text-slate-400">
              <UserIcon className="h-4 w-4 text-indigo-400" />
              <div className="text-xs">
                <span className="block text-slate-500 font-medium">Full Name</span>
                <span className="text-slate-300 font-semibold">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-400">
              <Mail className="h-4 w-4 text-indigo-400" />
              <div className="text-xs">
                <span className="block text-slate-500 font-medium">Email Address</span>
                <span className="text-slate-300 font-semibold">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-400">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <div className="text-xs">
                <span className="block text-slate-500 font-medium">Joined Since</span>
                <span className="text-slate-300 font-semibold">{formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2 text-left">
          <h3 className="text-lg font-bold text-slate-100 mb-6">Edit Profile Details</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="pt-4 border-t border-slate-900 flex justify-end">
              <Button type="submit" isLoading={isSubmitting} disabled={!isDirty} icon={UserCheck}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
