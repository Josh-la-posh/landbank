'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/AuthCard';
import { useState } from 'react';
import { authApi } from '@/lib/api';


const schema = z.object({ email: z.string().email('Please enter a valid email') });


type Values = z.infer<typeof schema>;


export default function ForgotPassword(){
const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<Values>({ resolver: zodResolver(schema) });
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);


const onSubmit = async (v: Values) => {
  setError(null);
  setSuccess(null);
  try {
    const { data, error } = await authApi.forgotPassword({ email: v.email });

    if (!data) {
      setError(error || 'Unable to send reset email at this time.');
      return;
    }

    if (!data.requestSuccessful) {
      setError(data.message || error || 'Unable to send reset email at this time.');
      return;
    }

    setSuccess(data.message || `If an account exists for ${v.email}, we have emailed a reset link.`);
  } catch (err) {
    setError('Network error. Please check your connection and try again.');
    console.error('Forgot password error:', err);
  }
};


return (
<div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
<div className="w-full max-w-md">
<AuthCard title="Reset your password" footer={<>
Remembered? <Link className="transition-colors text-brand hover:underline" href="/login">Back to sign in</Link>
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
<label className="label">Email address</label>
<input className="input" type="email" {...register('email')} />
{errors.email && <p className="text-xs mt-1 text-brand">{errors.email.message}</p>}
</div>
<button className="btn btn-primary w-full" disabled={isSubmitting}>
{isSubmitting ? 'Sending…' : 'Email me a reset link'}
</button>
</form>
</AuthCard>
</div>
</div>
);
}