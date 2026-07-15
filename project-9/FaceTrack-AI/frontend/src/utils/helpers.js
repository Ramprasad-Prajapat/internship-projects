// FaceTrack AI — Generic helpers (frontend-only mode).

// Get initials from a name, e.g. "Asha Rao" -> "AR".
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

// Conditional className joiner: cx('a', cond && 'b') -> "a b".
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function capitalize(s = '') {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Map a (mock) auth error to a friendly message.
export function authErrorMessage(error) {
  const code = error?.code ?? '';
  const map = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with these credentials.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || error?.message || 'Something went wrong. Please try again.';
}

// Stable hue from a string (used for deterministic avatar colors as a fallback).
export function colorFromString(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 70%, 55%)`;
}
