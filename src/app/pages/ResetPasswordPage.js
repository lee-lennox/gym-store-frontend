import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import { useToast } from '../context/ToastContext';

export function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const t = q.get('token') || '';
    setToken(t);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (!token) {
      toast.error('Missing reset token');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset successful. You can now sign in.');
      navigate('/signin');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="text-sm text-gray-600 mb-6">Enter your new password.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!token && (
          <div className="text-sm text-gray-500 mb-2">Token missing. Ensure you opened the link from your email.</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="New password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Confirm password"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
