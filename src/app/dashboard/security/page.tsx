'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function SecurityPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (values: ChangePasswordFormData) => {
    setError(null);
    setSuccess(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in to change your password');
        return;
      }

      const { data, error: apiError } = await authApi.changePassword(
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        `Bearer ${token}`
      );

      if (!data) {
        setError(apiError || 'Unable to change password. Please try again.');
        return;
      }

      if (!data.requestSuccessful) {
        setError(data.message || 'Unable to change password. Please try again.');
        return;
      }

      setSuccess(data.message || 'Password changed successfully!');
      reset();

      // Optionally redirect to login after a delay
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Change password error:', err);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-surface-secondary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-brand/10 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-brand" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Security Settings</h1>
              <p className="text-secondary mt-1">Manage your account security and password</p>
            </div>
          </div>
        </div>

        {/* Security Info Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Password Security Tips
              </p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>Use a unique password you don&apos;t use elsewhere</li>
                <li>Make it at least 8 characters with mixed case, numbers, and symbols</li>
                <li>Avoid personal information like names or birthdates</li>
                <li>Consider using a password manager</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-surface rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="h-6 w-6 text-brand" />
            <h2 className="text-xl font-semibold text-primary">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm flex items-start gap-2">
                <Lock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-sm flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{success}</p>
                  <p className="text-xs mt-1">Redirecting to login...</p>
                </div>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-primary mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Enter your current password"
                  {...register('oldPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Enter your new password"
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary">Password Strength</span>
                    <span className={`font-medium ${
                      passwordStrength.strength === 1 ? 'text-red-600 dark:text-red-400' :
                      passwordStrength.strength === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Confirm your new password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2 inline-block" />
                    Update Password
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setError(null);
                  setSuccess(null);
                }}
                className="px-6 py-2 border border-border rounded-md hover:bg-surface-secondary transition-colors text-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Additional Security Features (placeholder for future) */}
        <div className="mt-6 bg-surface rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Additional Security</h3>
          <div className="space-y-3 text-sm text-secondary">
            <p className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand" />
              Two-factor authentication (Coming soon)
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Login history and active sessions (Coming soon)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
