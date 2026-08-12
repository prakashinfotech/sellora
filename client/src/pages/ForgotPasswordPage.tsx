import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Logo from '../components/Logo';

interface EmailForm {
  email: string;
}

interface ResetForm {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');

  const emailForm = useForm<EmailForm>();
  const resetForm = useForm<ResetForm>();

  const onSendOtp = async (data: EmailForm) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      setStep('reset');
      toast.success('OTP sent! Check your email.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const onResetPassword = async (data: ResetForm) => {
    if (data.newPassword !== data.confirmPassword) {
      resetForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    try {
      await api.post('/auth/reset-password', {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Invalid or expired OTP';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[80vh] bg-sellora-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <Logo className="h-10" />
          </div>
          <p className="text-sellora-muted text-sm text-center">Buy, sell &amp; discover near you</p>
        </div>

        <div className="bg-white border border-sellora-border rounded-2xl p-6 shadow-sellora">
          {step === 'email' ? (
            <>
              <h1 className="text-xl font-bold text-sellora-text mb-1">Forgot password?</h1>
              <p className="text-sm text-sellora-muted mb-5">
                Enter your email and we'll send a 6-digit OTP.
              </p>
              <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">Email</label>
                  <input
                    type="email"
                    {...emailForm.register('email', { required: 'Email is required' })}
                    placeholder="Enter your registered email"
                    className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={emailForm.formState.isSubmitting}
                  className="w-full btn-gradient font-semibold py-3 rounded-xl disabled:opacity-60"
                >
                  {emailForm.formState.isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-sellora-text mb-1">Enter OTP</h1>
              <p className="text-sm text-sellora-muted mb-5">
                We sent a 6-digit OTP to <span className="font-semibold text-sellora-text">{email}</span>.
                It expires in 15 minutes.
              </p>
              <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    {...resetForm.register('otp', {
                      required: 'OTP is required',
                      pattern: { value: /^\d{6}$/, message: 'Enter the 6-digit OTP' },
                    })}
                    placeholder="6-digit OTP"
                    className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm tracking-widest text-center focus:outline-none focus:border-sellora-primary"
                  />
                  {resetForm.formState.errors.otp && (
                    <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.otp.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">New Password</label>
                  <input
                    type="password"
                    {...resetForm.register('newPassword', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    placeholder="New password"
                    className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                  />
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-sellora-text mb-1">Confirm Password</label>
                  <input
                    type="password"
                    {...resetForm.register('confirmPassword', { required: 'Please confirm your password' })}
                    placeholder="Confirm new password"
                    className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={resetForm.formState.isSubmitting}
                  className="w-full btn-gradient font-semibold py-3 rounded-xl disabled:opacity-60"
                >
                  {resetForm.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-sm text-sellora-primary hover:underline"
                >
                  Didn't receive OTP? Try again
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-sellora-muted mt-5">
            <Link to="/login" className="text-sellora-primary font-semibold hover:underline">
              Back to Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
