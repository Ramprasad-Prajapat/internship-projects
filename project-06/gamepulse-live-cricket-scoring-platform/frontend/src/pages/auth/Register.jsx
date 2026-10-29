import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SCORER');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await register(email, password, role, fullName);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-[90vh] bg-[#FFFDF5] bg-dot-grid flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-8 max-w-md w-full space-y-6 pop-shadow-xl z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center mx-auto pop-shadow-sm font-heading font-black text-xl">
            🚀
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E293B] font-heading tracking-tight">Create Account</h2>
          <p className="text-slate-600 text-xs font-medium">Join GamePulse to manage tournaments & score live</p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-[#F472B6]/20 border-2 border-[#1E293B] text-[#1E293B] font-bold text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] font-heading block mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] text-sm font-semibold focus:outline-none focus:shadow-[4px_4px_0px_0px_#8B5CF6] focus:border-[#1E293B] transition-all"
              placeholder="John Doe"
            />
          </div>

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

          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] font-heading block mb-1.5">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_#8B5CF6] focus:border-[#1E293B] transition-all"
            >
              <option value="SCORER">Official Scorer (SCORER)</option>
              <option value="ADMIN">Tournament Admin (ADMIN)</option>
              <option value="USER">Spectator (USER)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-[#F472B6] text-[#1E293B] font-extrabold text-sm pop-button font-heading tracking-wide"
          >
            {submitting ? 'Registering...' : 'Create Account ➔'}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8B5CF6] font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
