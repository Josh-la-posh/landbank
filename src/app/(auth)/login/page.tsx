'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/AuthCard';
import { useState } from 'react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';


const schema = z.object({
email: z.string().email('Please enter a valid email'),
password: z.string().min(6, 'Password must be at least 6 characters'),
});


type Values = z.infer<typeof schema>;


export default function LoginPage(){
const router = useRouter();
const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<Values>({ resolver: zodResolver(schema) });
const [error, setError] = useState<string | null>(null);


const onSubmit = async (v: Values) => {
  setError(null);
  try {
    const { data, error } = await authApi.login({
      email: v.email,
      password: v.password,
    });

    if (!data) {
      setError(error || 'Unable to reach authentication service.');
      return;
    }

    if (!data.requestSuccessful || !data.responseData) {
      setError(data.message || error || 'Invalid email / password');
      return;
    }

    const { responseData } = data;
    const token = responseData.accessToken
      ? `${responseData.tokenType ?? 'Bearer'} ${responseData.accessToken}`.trim()
      : null;

    if (token) {
      localStorage.setItem('authToken', token);
    }

    if (responseData.user) {
      localStorage.setItem('authUser', JSON.stringify(responseData.user));
    }

    window.dispatchEvent(new CustomEvent('landbank:auth-changed', { detail: { token } }));

    router.push('/dashboard');
  } catch (err) {
    setError('Network error. Please check your connection and try again.');
    console.error('Login error:', err);
  }
};


return (
<div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
<div className="w-full max-w-md">
<AuthCard title="Sign in to LandBank" footer={<>
Don&apos;t have an account? <Link className="transition-colors text-brand hover:underline" href="/register">Create one</Link>
</>}>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
{error && (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
    {error}
  </div>
)}
<div>
<label className="label">Email</label>
<input className="input" type="email" {...register('email')} />
{errors.email && <p className="text-xs mt-1 text-brand">{errors.email.message}</p>}
</div>
<div>
<label className="label">Password</label>
<input className="input" type="password" {...register('password')} />
{errors.password && <p className="text-xs mt-1 text-brand">{errors.password.message}</p>}
</div>
<div className="flex items-center justify-between">
<Link className="text-sm transition-colors text-brand hover:underline" href="/forgot-password">Forgot password?</Link>
</div>
<button className="btn btn-primary w-full" disabled={isSubmitting}>
{isSubmitting ? 'Signing in…' : 'Sign in'}
</button>
</form>
</AuthCard>
</div>
</div>
);
}