import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../services/api';
import { useToast } from '../context/ToastContext';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      toast.success('If an account exists, a reset link has been sent to your email.');
      navigate('/signin');
    } catch (err) {
      toast.error(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-sm text-gray-600 mb-6">Enter your email and we'll send a password reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
}
