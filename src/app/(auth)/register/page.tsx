'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthCard from '@/components/AuthCard';
import { useState } from 'react';
import { authApi } from '@/lib/api';


const schema = z.object({
country: z.string().min(2, 'Country is required'),
contactEmail: z.string().email('Please enter a valid email'),
contactPhoneNumber: z.string().min(10, 'Please enter a valid phone number'),
contactFirstName: z.string().min(2, 'First name is required'),
contactLastName: z.string().min(2, 'Last name is required'),
});


type Values = z.infer<typeof schema>;


export default function RegisterPage(){
const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<Values>({ resolver: zodResolver(schema) });
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);


const onSubmit = async (v: Values) => {
  setError(null);
  setSuccess(null);
  try {
    const { data, error } = await authApi.signup(v);

    if (!data) {
      setError(error || 'Unable to reach authentication service.');
      return;
    }

    if (!data.requestSuccessful) {
      setError(data.message || error || 'Registration failed. Please try again.');
      return;
    }

    setSuccess(data.message || `Welcome ${v.contactFirstName}! Please confirm your email to continue.`);
  } catch (err) {
    setError('Network error. Please check your connection and try again.');
    console.error('Registration error:', err);
  }
};


return (
<div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
<div className="w-full max-w-md">
<AuthCard title="Create your account" footer={<>
Already have an account? <Link className="transition-colors text-brand hover:underline" href="/login">Sign in</Link>
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
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="label">First Name</label>
    <input className="input" {...register('contactFirstName')} />
    {errors.contactFirstName && <p className="text-xs mt-1 text-brand">{errors.contactFirstName.message}</p>}
  </div>
  <div>
    <label className="label">Last Name</label>
    <input className="input" {...register('contactLastName')} />
    {errors.contactLastName && <p className="text-xs mt-1 text-brand">{errors.contactLastName.message}</p>}
  </div>
</div>
<div>
  <label className="label">Email</label>
  <input className="input" type="email" {...register('contactEmail')} />
  {errors.contactEmail && <p className="text-xs mt-1 text-brand">{errors.contactEmail.message}</p>}
</div>
<div>
  <label className="label">Phone Number</label>
  <input className="input" type="tel" {...register('contactPhoneNumber')} />
  {errors.contactPhoneNumber && <p className="text-xs mt-1 text-brand">{errors.contactPhoneNumber.message}</p>}
</div>
<div>
  <label className="label">Country</label>
  <input className="input" {...register('country')} />
  {errors.country && <p className="text-xs mt-1 text-brand">{errors.country.message}</p>}
</div>
<button className="btn btn-primary w-full" disabled={isSubmitting}>
  {isSubmitting ? 'Creating…' : 'Create account'}
</button>
</form>
</AuthCard>
</div>
</div>
);
}