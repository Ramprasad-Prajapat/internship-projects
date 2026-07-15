// FaceTrack AI — Login page (frontend-only mode).
// Mock email/password sign-in + a small "Demo access for testing" helper that
// auto-fills the email/password fields for a chosen role (it does NOT log in —
// the user still clicks Login). No Firebase / .env. Demo accounts live in
// src/data/users.js; the mock auth service (login) is unchanged.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanFace, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, ROLE_LABELS } from '../../utils/constants';
import { MOCK_USERS } from '../../data/users';
import { authErrorMessage } from '../../utils/helpers';

// Compact demo-credential list (label + email + password) built from the mock
// users so the auto-filled credentials always match what mock auth accepts.
const DEMO_CREDENTIALS = MOCK_USERS.map((u) => ({
  role: u.role,
  label: ROLE_LABELS[u.role] || u.role,
  email: u.email,
  password: u.password,
}));

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoRole, setDemoRole] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ email, password });
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  // Pick a demo role → auto-fill the email/password fields (no auto-login).
  const onPickDemo = (e) => {
    const value = e.target.value;
    setDemoRole(value);
    const cred = DEMO_CREDENTIALS.find((c) => c.role === value);
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      setError('');
    }
  };

  const selected = DEMO_CREDENTIALS.find((c) => c.role === demoRole);

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
        <p className="ft-auth-tagline">Sign in to your dashboard</p>

        {error ? <div className="ft-alert ft-alert--error">{error}</div> : null}

        <label className="ft-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hr@demo.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="ft-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={DEMO_CREDENTIALS[0]?.password}
            autoComplete="current-password"
            required
          />
        </label>

        {/* Small demo credential helper — fills the fields, does not log in */}
        <label className="ft-field">
          <span>Demo access for testing</span>
          <select value={demoRole} onChange={onPickDemo}>
            <option value="">Select a role to auto-fill…</option>
            {DEMO_CREDENTIALS.map((c) => (
              <option key={c.role} value={c.role}>
                {c.label}: {c.email} / {c.password}
              </option>
            ))}
          </select>
        </label>

        {selected ? (
          <p className="ft-demo-selected">
            Selected demo access: <strong>{selected.label}</strong> — {selected.email} / {selected.password}
          </p>
        ) : null}

        <button className="ft-btn ft-btn--primary" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Login'}
        </button>

        <p className="ft-auth-note">
          No account? <Link to={ROUTES.REGISTER}>Create one</Link>
        </p>
      </form>
    </div>
  );
}
