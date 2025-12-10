'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/AuthCard';
import AuthSuccess from '@/components/AuthSuccess';
import { authApi } from '@/lib/api';

const schema = z.object({ email: z.string().email('Please enter a valid email') });

type Values = z.infer<typeof schema>;

export default function ResendConfirmationPage(){
const router = useRouter();
const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
const [error, setError] = useState<string | null>(null);
const [isSent, setIsSent] = useState(false);
const [successMessage, setSuccessMessage] = useState<string>('');

const onSubmit = async (values: Values) => {
  setError(null);
  try {
    const { data, error } = await authApi.resendConfirmation({ email: values.email });

    if (!data) {
      setError(error || 'Unable to send confirmation email right now.');
      return;
    }

    if (!data.requestSuccessful) {
      setError(data.message || error || 'Unable to send confirmation email right now.');
      return;
    }

    setSuccessMessage(data.message || 'A new confirmation email has been sent. Please check your inbox.');
    setIsSent(true);
    
    // Navigate to confirm account page after 3 seconds
    setTimeout(() => {
      router.push('/confirm-account');
    }, 3000);
  } catch (err) {
    setError('Network error. Please try again.');
    console.error('Resend confirmation error:', err);
  }
};

return (
<div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
<div className="w-full max-w-md">
{isSent ? (
  <AuthSuccess
    title="Confirmation Email Sent!"
    message={successMessage}
    redirectUrl="/confirm-account"
    redirectText="Go to confirm account now"
  />
) : (
<AuthCard title="Resend confirmation" footer={<>
Already confirmed? <Link className="transition-colors text-brand hover:underline" href="/login">Return to sign in</Link>
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
{isSubmitting ? 'Sending…' : 'Send confirmation email'}
</button>
</form>
</AuthCard>
)}
</div>
</div>
);
}
