// FaceTrack AI — Reusable public navbar (frontend-only).

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ScanFace, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, ROLE_LABELS, dashboardPathForRole } from '../../utils/constants';

const LINKS = [
  { label: 'Home', to: ROUTES.LANDING },
  { label: 'Problems', hash: 'problems' },
  { label: 'Features', hash: 'features' },
  { label: 'How It Works', hash: 'how-it-works' },
  { label: 'Roles', hash: 'roles' },
  { label: 'Network', hash: 'rajasthan' },
  { label: 'Privacy', to: ROUTES.PRIVACY },
  { label: 'Consent', to: ROUTES.CONSENT },
];

export default function PublicNavbar() {
  const { isAuthenticated, role, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Force show navbar
  const revealNavbar = useCallback(() => {
    setIsHidden(false);
    lastScrollY.current = window.scrollY || 0;
  }, []);

  // On every public route change, navbar must show
  useEffect(() => {
    setOpen(false);
    setIsHidden(false);
    lastScrollY.current = 0;

    // Route change par page top se start ho
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Hash/section change par bhi navbar show ho
  useEffect(() => {
    revealNavbar();
  }, [location.hash, revealNavbar]);

  // Fallback for hash links
  useEffect(() => {
    window.addEventListener('hashchange', revealNavbar);
    return () => window.removeEventListener('hashchange', revealNavbar);
  }, [revealNavbar]);

  // Hide on scroll down, instant show on scroll up
  useEffect(() => {
    lastScrollY.current = window.scrollY || 0;

    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || 0;
        const previousScrollY = lastScrollY.current;
        const scrollDiff = currentScrollY - previousScrollY;

        // Page top par header always visible
        if (currentScrollY <= 20) {
          setIsHidden(false);
        }

        // Scroll down after 80px → hide header
        else if (scrollDiff > 4 && currentScrollY > 80) {
          setIsHidden(true);
        }

        // Scroll up even little bit → instantly show header
        else if (scrollDiff < -1) {
          setIsHidden(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Mobile sheet open ho toh navbar hide nahi hoga
  const isNavbarHidden = isHidden && !open;

  function goToSection(id) {
    setOpen(false);
    revealNavbar();

    if (location.pathname !== ROUTES.LANDING) {
      navigate(ROUTES.LANDING);
      setTimeout(() => {
        revealNavbar();
        scrollToId(id);
      }, 80);
    } else {
      scrollToId(id);
    }
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <header className={`ft-pubnav ${isNavbarHidden ? 'ft-pubnav--hidden' : 'ft-pubnav--visible'}`}>
      <div className="ft-pubnav-inner">
        <Link
          to={ROUTES.LANDING}
          className="ft-brand ft-pubnav-brand"
          onClick={() => {
            setOpen(false);
            revealNavbar();
          }}
        >
          <ScanFace size={24} className="ft-brand-icon" />
          <span className="ft-brand-text">FaceTrack&nbsp;AI</span>
        </Link>

        <nav className="ft-pubnav-links">
          {LINKS.map((l) =>
            l.hash ? (
              <button
                key={l.label}
                type="button"
                className="ft-pubnav-link"
                onClick={() => goToSection(l.hash)}
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className="ft-pubnav-link"
                onClick={() => {
                  setOpen(false);
                  revealNavbar();
                }}
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        <div className="ft-pubnav-cta">
          {isAuthenticated ? (
            <Link
              to={dashboardPathForRole(role)}
              className="ft-btn ft-btn--primary"
              onClick={() => {
                setOpen(false);
                revealNavbar();
              }}
            >
              <LayoutDashboard size={16} />
              {ROLE_LABELS[role] ? `${ROLE_LABELS[role]} Dashboard` : 'Dashboard'}
            </Link>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="ft-btn ft-btn--primary"
              onClick={() => {
                setOpen(false);
                revealNavbar();
              }}
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="ft-icon-btn ft-pubnav-burger"
          onClick={() => {
            revealNavbar();
            setOpen((o) => !o);
          }}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="ft-pubnav-sheet ft-glass">
          {LINKS.map((l) =>
            l.hash ? (
              <button
                key={l.label}
                type="button"
                className="ft-pubnav-sheet-link"
                onClick={() => goToSection(l.hash)}
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className="ft-pubnav-sheet-link"
                onClick={() => {
                  setOpen(false);
                  revealNavbar();
                }}
              >
                {l.label}
              </Link>
            )
          )}

          <div className="ft-pubnav-sheet-cta">
            {isAuthenticated ? (
              <Link
                to={dashboardPathForRole(role)}
                className="ft-btn ft-btn--primary ft-btn--block"
                onClick={() => {
                  setOpen(false);
                  revealNavbar();
                }}
              >
                <LayoutDashboard size={16} /> Go to Dashboard
              </Link>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="ft-btn ft-btn--primary ft-btn--block"
                onClick={() => {
                  setOpen(false);
                  revealNavbar();
                }}
              >
                Login
              </Link>
            )}
          </div>

          {isAuthenticated && profile?.name ? (
            <div className="ft-pubnav-sheet-user">
              Signed in as <strong>{profile.name}</strong>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
