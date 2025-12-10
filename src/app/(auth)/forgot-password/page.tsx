'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/AuthCard';
import AuthSuccess from '@/components/AuthSuccess';
import { useState } from 'react';
import { authApi } from '@/lib/api';


const schema = z.object({ email: z.string().email('Please enter a valid email') });


type Values = z.infer<typeof schema>;


export default function ForgotPassword(){
const router = useRouter();
const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<Values>({ resolver: zodResolver(schema) });
const [error, setError] = useState<string | null>(null);
const [isSent, setIsSent] = useState(false);
const [successMessage, setSuccessMessage] = useState<string>('');


const onSubmit = async (v: Values) => {
  setError(null);
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

    setSuccessMessage(data.message || `If an account exists for ${v.email}, we have emailed a reset link.`);
    setIsSent(true);
    
    // Navigate to reset password page after 3 seconds
    setTimeout(() => {
      router.push('/reset-password');
    }, 3000);
  } catch (err) {
    setError('Network error. Please check your connection and try again.');
    console.error('Forgot password error:', err);
  }
};


return (
<div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
<div className="w-full max-w-md">
{isSent ? (
  <AuthSuccess
    title="Reset Link Sent!"
    message={successMessage}
    redirectUrl="/reset-password"
    redirectText="Go to reset password now"
  />
) : (
<AuthCard title="Reset your password" footer={<>
Remembered? <Link className="transition-colors text-brand hover:underline" href="/login">Back to sign in</Link>
</>}>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
{error && (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
    {error}
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
)}
</div>
</div>
);
}