// FaceTrack AI — Master Layout shell (Phase 1).
// Sidebar + Navbar + main content. Manages the mobile sidebar drawer state.

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ft-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="ft-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="ft-main">
        <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <main className="ft-content">{children}</main>
      </div>
    </div>
  );
}
