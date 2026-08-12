import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerHandler } from '../store/slices/authSlice';
import Logo from '../components/Logo';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerHandler(data));
    if (registerHandler.fulfilled.match(result)) {
      toast.success('Account created!');
      navigate('/');
    } else {
      toast.error('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-[80vh] bg-sellora-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <Logo className="h-10" />
          </div>
          <p className="text-sellora-muted text-sm text-center">Buy, sell &amp; discover near you</p>
        </div>

        <div className="bg-white border border-sellora-border rounded-2xl p-6 shadow-sellora">
          <h1 className="text-xl font-bold text-sellora-text mb-5">Create your Sellora account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-sellora-text mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Your full name"
                className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-sellora-text mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="your@email.com"
                className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-sellora-text mb-1">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                placeholder="Min 6 characters"
                className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-sellora-text mb-1">Phone <span className="text-sellora-muted font-normal">(optional)</span></label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 XXXXX XXXXX"
                className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-sellora-text mb-1">City <span className="text-sellora-muted font-normal">(optional)</span></label>
              <input
                {...register('city')}
                placeholder="e.g. Mumbai"
                className="w-full border border-sellora-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-sellora-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full btn-gradient font-semibold py-3 rounded-xl disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-sellora-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-sellora-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
