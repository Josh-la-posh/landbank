'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/AuthCard';
import { authApi } from '@/lib/api';

const schema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

type Values = z.infer<typeof schema>;

function ResetPasswordContent(){
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') ?? '';
  const { register, handleSubmit, setValue, formState:{ errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: tokenParam,
      password: '',
      confirmPassword: '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (tokenParam) {
      setValue('token', tokenParam);
    }
  }, [setValue, tokenParam]);

  const onSubmit = async (values: Values) => {
    setError(null);
    setSuccess(null);
    try {
      const { data, error } = await authApi.resetPassword(values);

      if (!data) {
        setError(error || 'Unable to reset password right now.');
        return;
      }

      if (!data.requestSuccessful) {
        setError(data.message || error || 'Unable to reset password right now.');
        return;
      }

      setSuccess(data.message || 'Password reset successful. You can now sign in.');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Reset password error:', err);
    }
  };

  return (
<div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
<div className="w-full max-w-md">
<AuthCard title="Choose a new password" footer={<>
Remembered your password? <Link className="transition-colors text-brand hover:underline" href="/login">Back to sign in</Link>
</>}>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
{error && (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
    {error}
  </div>
)}
{success && (
  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-sm">
    {success}
  </div>
)}
<div>
<label className="label">Reset token</label>
<input className="input" {...register('token')} />
{errors.token && <p className="text-xs mt-1 text-brand">{errors.token.message}</p>}
</div>
<div>
<label className="label">New password</label>
<input className="input" type="password" {...register('password')} />
{errors.password && <p className="text-xs mt-1 text-brand">{errors.password.message}</p>}
</div>
<div>
<label className="label">Confirm new password</label>
<input className="input" type="password" {...register('confirmPassword')} />
{errors.confirmPassword && <p className="text-xs mt-1 text-brand">{errors.confirmPassword.message}</p>}
</div>
<button className="btn btn-primary w-full" disabled={isSubmitting}>
{isSubmitting ? 'Resetting…' : 'Reset password'}
</button>
</form>
</AuthCard>
</div>
</div>
);
}

export default function ResetPasswordPage(){
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-secondary text-sm">Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
