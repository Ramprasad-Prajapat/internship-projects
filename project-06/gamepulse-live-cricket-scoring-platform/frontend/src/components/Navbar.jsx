import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import wsService from '../services/websocket';
import MobileNavDrawer from './MobileNavDrawer';

const Navbar = () => {
  const { user, logout, isScorer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Notification Preferences State
  const [preferences, setPreferences] = useState({
    matchStartAlerts: true,
    wicketAlerts: true,
    milestoneAlerts: true,
    matchCompletionAlerts: true,
    tournamentAlerts: true,
    pollAlerts: true,
    systemAlerts: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();

      // Subscribe to real-time notification STOMP channel
      const subPath = '/topic/notifications';
      wsService.subscribe(subPath, (newNotif) => {
        if (newNotif) {
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      });

      return () => {
        wsService.unsubscribe(subPath);
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [resNotifs, resUnread] = await Promise.all([
        api.get('/notifications'),
        api.get('/notifications/unread-count'),
      ]);
      setNotifications(resNotifs.data || []);
      setUnreadCount(resUnread.data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setError('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/notifications/preferences');
      if (res.data) {
        setPreferences(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch preferences', err);
    }
  };

  const handleSavePreferences = async (updated) => {
    setSavingPrefs(true);
    try {
      const res = await api.put('/notifications/preferences', updated);
      setPreferences(res.data);
      setShowPreferencesModal(false);
    } catch (err) {
      console.error('Failed to save preferences', err);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    }
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await handleMarkAsRead(n.id);
    }
    setShowNotifications(false);
    if (n.actionUrl) {
      navigate(n.actionUrl);
    } else if (n.referenceId && n.type !== 'TOURNAMENT_UPDATE') {
      navigate(`/scoreboard/${n.referenceId}`);
    }
  };

  const handleLogout = () => {
    setNotifications([]);
    setUnreadCount(0);
    logout();
    navigate('/');
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'WICKET': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'MATCH_STARTED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'MILESTONE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'POLL': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'MATCH_COMPLETED': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (<>)
    <nav className="sticky top-0 z-50 px-4 md:px-6 py-3.5 bg-[#FFFDF5] border-b-2 border-[#1E293B] shadow-[0_4px_0px_0px_#1E293B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center pop-shadow-sm group-hover:rotate-6 transition-transform">
            <span className="text-xl">⚡</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#1E293B] font-heading flex items-center gap-2">
              GamePulse <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] pop-shadow-sm">LIVE</span>
            </span>
            <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">Cricket Engine & Real-Time Scoring</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile hamburger button */}
          <button
            className="md:hidden p-2 rounded-xl bg-[#F1F5F9] border-2 border-[#1E293B] text-[#1E293B] font-bold pop-button min-h-touch min-w-touch"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-drawer"
          >
            ☰
          </button>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E293B] hover:bg-[#FBBF24] border-2 border-transparent hover:border-[#1E293B] transition-all flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] border border-[#1E293B] animate-pulse"></span>
              Matches
            </Link>

            <Link to="/tournaments" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E293B] hover:bg-[#F472B6] border-2 border-transparent hover:border-[#1E293B] transition-all">
              Tournaments
            </Link>

            <Link to="/leaderboards" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1E293B] hover:bg-[#34D399] border-2 border-transparent hover:border-[#1E293B] transition-all hidden sm:inline">
              Leaderboards
            </Link>
          </div>

          <Link to="/search" className="px-3 py-1.5 rounded-full bg-[#F1F5F9] border-2 border-[#1E293B] text-xs font-bold text-[#1E293B] hover:bg-[#8B5CF6] hover:text-white transition-all pop-shadow-sm">
            🔍 Search
          </Link>

          {isScorer && (
            <>
              <Link to="/scorer" className="px-3 py-1.5 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] text-xs font-bold text-[#1E293B] hover:scale-105 transition-transform pop-shadow-sm hidden sm:inline">
                Scorer
              </Link>
              <Link to="/create-match" className="px-3.5 py-1.5 rounded-full bg-[#F472B6] border-2 border-[#1E293B] text-white text-xs font-bold transition pop-button">
                + Match
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="px-3.5 py-1.5 rounded-full bg-[#8B5CF6] border-2 border-[#1E293B] text-white text-xs font-bold transition pop-button">
              ⚙️ Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 relative">
              {/* Notification Bell Icon */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
                aria-expanded={showNotifications}
                className="relative p-2.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#1E293B] text-[#1E293B] transition pop-button"
                title="Notifications"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F472B6] text-[#1E293B] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-[#1E293B] animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Center Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-14 w-80 md:w-96 bg-white border-2 border-[#1E293B] rounded-3xl pop-shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] font-heading">Notifications</h4>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FBBF24] border border-[#1E293B] font-bold text-[#1E293B]">
                        {unreadCount} Unread
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPreferencesModal(true)}
                        className="p-1 rounded-lg bg-[#F1F5F9] border border-[#1E293B] text-xs hover:bg-[#FBBF24]"
                        title="Notification Settings"
                      >
                        ⚙️
                      </button>
                      <button
                        onClick={fetchNotifications}
                        className="p-1 rounded-lg bg-[#F1F5F9] border border-[#1E293B] text-xs hover:bg-[#34D399]"
                        title="Refresh Notifications"
                      >
                        🔄
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-[#8B5CF6] hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body States */}
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1 text-xs">
                    {loading ? (
                      <div className="py-8 text-center space-y-2">
                        <div className="w-6 h-6 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-slate-500 text-xs font-semibold">Loading alerts...</p>
                      </div>
                    ) : error ? (
                      <div className="p-3 bg-[#F472B6]/20 border-2 border-[#1E293B] rounded-2xl text-[#1E293B] text-center space-y-2 font-semibold">
                        <p>{error}</p>
                        <button
                          onClick={fetchNotifications}
                          className="px-3 py-1 bg-[#8B5CF6] text-white border border-[#1E293B] rounded-full text-[10px] font-bold"
                        >
                          Retry
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 space-y-1">
                        <span className="text-3xl block">🔕</span>
                        <p className="font-bold text-[#1E293B]">No new notifications</p>
                        <p className="text-[11px] text-slate-500">Live match events and poll alerts will appear here!</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 rounded-2xl border-2 border-[#1E293B] transition cursor-pointer flex flex-col gap-1 ${
                            n.isRead
                              ? 'bg-[#F1F5F9] opacity-75'
                              : 'bg-[#FFFDF5] pop-shadow-sm text-[#1E293B]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border border-[#1E293B] ${getTypeBadgeClass(n.type)}`}>
                              {n.type || 'ALERT'}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold">
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-2 mt-1">
                            <div>
                              <div className="font-bold text-[#1E293B] text-xs font-heading">{n.title}</div>
                              <div className="text-slate-600 text-[11px] mt-0.5 leading-snug">{n.message}</div>
                            </div>
                            {!n.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(n.id, e)}
                                className="w-2.5 h-2.5 rounded-full bg-[#F472B6] border border-[#1E293B] flex-shrink-0 mt-1"
                                title="Mark as read"
                              />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold text-[#1E293B] font-heading">{user.email}</span>
                <span className="text-[10px] text-[#8B5CF6] font-bold uppercase">{user.role}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#F472B6] hover:text-white text-[#1E293B] text-xs font-bold transition border-2 border-[#1E293B] pop-shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-1.5 rounded-full bg-white hover:bg-[#FBBF24] text-[#1E293B] text-xs font-bold transition border-2 border-[#1E293B] pop-shadow-sm">
                Login
              </Link>
              <Link to="/register" className="px-4 py-1.5 rounded-full bg-[#8B5CF6] text-white text-xs font-bold transition pop-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Notification Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 max-w-md w-full space-y-5 pop-shadow-xl">
            <div className="flex items-center justify-between border-b-2 border-[#1E293B] pb-3">
              <h3 className="text-base font-extrabold text-[#1E293B] font-heading flex items-center gap-2">
                <span>⚙️ Notification Preferences</span>
              </h3>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] border-2 border-[#1E293B] text-[#1E293B] font-bold text-xs hover:bg-[#F472B6]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              {[
                { key: 'matchStartAlerts', label: 'Match Start Alerts' },
                { key: 'wicketAlerts', label: 'Wicket Alerts' },
                { key: 'milestoneAlerts', label: 'Milestone Alerts (50s / 100s)' },
                { key: 'matchCompletionAlerts', label: 'Match Completion Alerts' },
                { key: 'tournamentAlerts', label: 'Tournament Updates' },
                { key: 'pollAlerts', label: 'Fan Poll Notifications' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] cursor-pointer hover:bg-[#FBBF24]/20">
                  <span className="text-[#1E293B] font-bold">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={!!preferences[item.key]}
                    onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                    className="w-5 h-5 rounded-md accent-[#8B5CF6] border-2 border-[#1E293B]"
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="flex-1 py-2.5 rounded-full bg-[#F1F5F9] text-[#1E293B] font-bold text-xs border-2 border-[#1E293B]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingPrefs}
                onClick={() => handleSavePreferences(preferences)}
                className="flex-1 py-2.5 rounded-full bg-[#8B5CF6] text-white font-bold text-xs pop-button"
              >
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
    <MobileNavDrawer
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      isScorer={isScorer}
      isAdmin={isAdmin}
    />
  </>);
};

export default Navbar;
