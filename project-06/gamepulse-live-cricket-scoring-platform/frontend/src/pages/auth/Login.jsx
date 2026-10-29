import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await login(email, password);
    if (result.success) {
      navigate('/scorer');
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  const handleDemoLogin = async (demoEmail, demoPassword, targetRole) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSubmitting(true);
    setError(null);

    const result = await login(demoEmail, demoPassword);
    if (result.success) {
      if (targetRole === 'ADMIN') {
        navigate('/admin');
      } else if (targetRole === 'SCORER') {
        navigate('/scorer');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[90vh] bg-[#FFFDF5] bg-dot-grid flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-12 left-12 w-20 h-20 rounded-full bg-[#F472B6] border-2 border-[#1E293B] pop-shadow opacity-40 animate-pulse pointer-events-none hidden md:block"></div>
      <div className="absolute bottom-16 right-16 w-24 h-24 rounded-3xl bg-[#FBBF24] border-2 border-[#1E293B] pop-shadow rotate-12 opacity-40 pointer-events-none hidden md:block"></div>

      <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-8 max-w-md w-full space-y-6 pop-shadow-xl z-10 relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] text-white flex items-center justify-center mx-auto pop-shadow-sm font-heading font-black text-xl">
            ⚡
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] font-heading tracking-tight">Login to GamePulse</h2>
          <p className="text-slate-600 text-xs font-medium">Enter credentials to access Scorer or Admin console</p>
        </div>

        {/* Quick Demo Login Section */}
        <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-4 space-y-3 pop-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <span>⚡</span> Quick Demo Login
            </span>
            <span className="text-[10px] text-slate-500 font-bold bg-[#FBBF24] px-2 py-0.5 rounded-full border border-[#1E293B]">One-Click Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@gamepulse.com', 'admin123', 'ADMIN')}
              className="py-2.5 px-2 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white border-2 border-[#1E293B] rounded-xl text-xs font-bold flex flex-col items-center gap-1 pop-shadow-sm hover:scale-105 transition-all"
            >
              <span>👑 Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('scorer@gamepulse.com', 'scorer123', 'SCORER')}
              className="py-2.5 px-2 bg-[#34D399] hover:bg-[#10b981] text-[#1E293B] border-2 border-[#1E293B] rounded-xl text-xs font-bold flex flex-col items-center gap-1 pop-shadow-sm hover:scale-105 transition-all"
            >
              <span>🏏 Scorer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user@gamepulse.com', 'user123', 'USER')}
              className="py-2.5 px-2 bg-[#F472B6] hover:bg-[#ec4899] text-[#1E293B] border-2 border-[#1E293B] rounded-xl text-xs font-bold flex flex-col items-center gap-1 pop-shadow-sm hover:scale-105 transition-all"
            >
              <span>👤 Viewer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-[#F472B6]/20 border-2 border-[#1E293B] text-[#1E293B] font-bold text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] font-heading block mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] text-sm font-semibold focus:outline-none focus:shadow-[4px_4px_0px_0px_#8B5CF6] focus:border-[#1E293B] transition-all"
              placeholder="scorer@gamepulse.com"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] font-heading block mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] text-sm font-semibold focus:outline-none focus:shadow-[4px_4px_0px_0px_#8B5CF6] focus:border-[#1E293B] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-[#8B5CF6] text-white font-extrabold text-sm pop-button font-heading tracking-wide"
          >
            {submitting ? 'Authenticating...' : 'Sign In ➔'}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#8B5CF6] font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
