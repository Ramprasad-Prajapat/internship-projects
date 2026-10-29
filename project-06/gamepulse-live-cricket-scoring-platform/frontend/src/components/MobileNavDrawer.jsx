import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * Mobile navigation drawer.
 * Props:
 *   isOpen: boolean – whether the drawer is visible
 *   onClose: () => void – callback to close the drawer
 *   isScorer, isAdmin: booleans – role flags to conditionally render links
 */
const MobileNavDrawer = ({ isOpen, onClose, isScorer, isAdmin }) => {
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Focus trap – simple: focus first link when opened
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstLink = drawerRef.current.querySelector('a');
      firstLink && firstLink.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-label="Close navigation drawer"
      />
      {/* Drawer */}
      <nav
        id="mobile-drawer"
        ref={drawerRef}
        className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-200 z-50 p-4 overflow-y-auto shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation drawer"
      >
        <button
          onClick={onClose}
          className="mb-4 text-sm text-slate-400 hover:text-white focus:outline-none min-h-touch min-w-touch"
        >
          ✕ Close
        </button>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block py-2 px-3 rounded hover:bg-slate-800">
              Home
            </Link>
          </li>
          <li>
            <Link to="/tournaments" className="block py-2 px-3 rounded hover:bg-slate-800">
              Tournaments
            </Link>
          </li>
          <li>
            <Link to="/leaderboards" className="block py-2 px-3 rounded hover:bg-slate-800">
              Leaderboards
            </Link>
          </li>
          <li>
            <Link to="/search" className="block py-2 px-3 rounded hover:bg-slate-800">
              Search
            </Link>
          </li>
          {isScorer && (
            <>
              <li>
                <Link to="/scorer" className="block py-2 px-3 rounded hover:bg-slate-800">
                  Scorer
                </Link>
              </li>
              <li>
                <Link to="/create-match" className="block py-2 px-3 rounded hover:bg-slate-800">
                  + Match
                </Link>
              </li>
            </>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin" className="block py-2 px-3 rounded hover:bg-slate-800">
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default MobileNavDrawer;
