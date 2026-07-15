// FaceTrack AI — Register page (frontend-only mode).
// Mock registration — creates a local demo account (stored in localStorage),
// then redirects by role. No Firebase / database.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanFace, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, ROLE_LABELS, ROUTES } from '../../utils/constants';
import { authErrorMessage } from '../../utils/helpers';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      // Public self-registration always creates an Employee account. Elevated
      // roles (HR / Manager / Branch Admin / Super Admin) are never
      // self-assignable — they are provisioned by an administrator. The role is
      // forced here so it can't be tampered with via the form.
      await register({ ...form, role: ROLES.EMPLOYEE });
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ft-auth">
      <form className="ft-glass ft-auth-card" onSubmit={onSubmit}>
        <Link to={ROUTES.LANDING} className="ft-auth-back">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Link to={ROUTES.LANDING} className="ft-brand ft-brand--lg ft-auth-brand" title="Go to FaceTrack AI home">
          <ScanFace size={32} className="ft-brand-icon" />
          <span className="ft-brand-text">FaceTrack AI</span>
        </Link>
        <p className="ft-auth-tagline">Create your account (demo mode)</p>

        <div className="ft-alert ft-alert--info">
          Demo mode — accounts are stored locally in your browser. No backend or
          database is used.
        </div>

        {error ? <div className="ft-alert ft-alert--error">{error}</div> : null}

        <label className="ft-field">
          <span>Full name</span>
          <input type="text" value={form.name} onChange={update('name')} placeholder="Jane Doe" required />
        </label>

        <label className="ft-field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" autoComplete="email" required />
        </label>

        <label className="ft-field">
          <span>Password</span>
          <input type="password" value={form.password} onChange={update('password')} placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required />
        </label>

        <label className="ft-field">
          <span>Role</span>
          <input type="text" value={ROLE_LABELS[ROLES.EMPLOYEE]} readOnly disabled aria-label="Account role" />
        </label>
        <p className="ft-auth-note" style={{ marginTop: -4, textAlign: 'left' }}>
          Public sign-up creates an <strong>Employee</strong> account. HR, Manager and Admin
          roles are assigned by an administrator.
        </p>

        <button className="ft-btn ft-btn--primary" type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Register'}
        </button>

        <p className="ft-auth-note">
          Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
        </p>
      </form>
    </div>
  );
}
