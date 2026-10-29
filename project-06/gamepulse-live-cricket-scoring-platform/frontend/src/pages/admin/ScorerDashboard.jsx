import React, { useEffect, useState } from 'react';
import Spinner from '../../components/common/Spinner';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Toast from '../../components/common/Toast';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import wsService from '../../services/websocket';

const ScorerDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Network & Sync State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('');

  // Modals state
  const [showWicketModal, setShowWicketModal] = useState(false);

  // Wicket Form
  const [wicketForm, setWicketForm] = useState({
    wicketType: 'BOWLED',
    dismissedPlayerId: '',
    fielderId: '',
    newBatterId: '',
  });

  const storageKey = `gamepulse_offline_queue_${id}`;

  // Load offline queue from localStorage
  const loadOfflineQueue = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setOfflineQueue(JSON.parse(stored));
      } else {
        setOfflineQueue([]);
      }
    } catch (e) {
      console.error('Failed to read offline queue from localStorage', e);
    }
  };

  // Save offline queue to localStorage
  const saveOfflineQueue = (queue) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(queue));
      setOfflineQueue(queue);
    } catch (e) {
      console.error('Failed to save offline queue to localStorage', e);
    }
  };

  useEffect(() => {
    loadData();
    loadOfflineQueue();

    const handleOnline = () => {
      setIsOnline(true);
      showToast('🟢 Connection restored. Ready to sync!');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('🔴 You are offline. Deliveries will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to STOMP WebSocket
    wsService.subscribeToMatch(id, (event) => {
      if (event.scorecard) {
        setScorecard(event.scorecard);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      wsService.unsubscribe(`/topic/match/${id}`);
    };
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, scRes] = await Promise.all([
        api.get(`/matches/${id}`),
        api.get(`/matches/${id}/scorecard`),
      ]);
      setMatch(mRes.data);
      setScorecard(scRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const currentInnings = scorecard?.inningsList?.[scorecard.inningsList.length - 1];

  // Sync Offline Queue with Backend
  const syncQueue = async () => {
    if (!currentInnings) return;
    const pendingItems = offlineQueue.filter((item) => item.status === 'PENDING' || item.status === 'FAILED');
    if (pendingItems.length === 0) {
      setSyncStatusText('No pending offline deliveries to sync.');
      return;
    }

    setIsSyncing(true);
    setSyncStatusText(`Syncing ${pendingItems.length} offline deliveries...`);

    const updatedQueue = [...offlineQueue];
    pendingItems.forEach((item) => {
      const idx = updatedQueue.findIndex((i) => i.id === item.id);
      if (idx !== -1) updatedQueue[idx].status = 'SYNCING';
    });
    saveOfflineQueue(updatedQueue);

    try {
      const batchPayloads = pendingItems.map((item) => item.payload);
      const res = await api.post(`/innings/${currentInnings.id}/sync`, batchPayloads);

      // On successful batch sync
      const syncedIds = new Set(pendingItems.map((item) => item.id));
      const remainingQueue = offlineQueue.filter((item) => !syncedIds.has(item.id));
      saveOfflineQueue(remainingQueue);

      setSyncStatusText(`Successfully synchronized ${res.data.length} deliveries!`);
      showToast(`✅ Synchronized ${res.data.length} deliveries with server.`);
      await loadData();
    } catch (err) {
      console.error('Batch sync failed', err);
      const failReason = err.response?.data?.message || 'Network error during sync';

      const errorQueue = offlineQueue.map((item) => {
        if (item.status === 'SYNCING' || item.status === 'PENDING') {
          return { ...item, status: 'FAILED', errorReason: failReason };
        }
        return item;
      });
      saveOfflineQueue(errorQueue);
      setSyncStatusText(`Sync failed: ${failReason}`);
      setError(`Offline sync failed: ${failReason}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCompletedQueue = () => {
    const remaining = offlineQueue.filter((item) => item.status !== 'SYNCED');
    saveOfflineQueue(remaining);
  };

  const discardFailedQueue = () => {
    const remaining = offlineQueue.filter((item) => item.status !== 'FAILED' && item.status !== 'CONFLICT');
    saveOfflineQueue(remaining);
    setError(null);
  };

  const handleScoreBall = async (runsOffBat, extraRuns = 0, extraType = 'NONE') => {
    if (!currentInnings || processing) return;
    setProcessing(true);
    setError(null);

    const clientEventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      clientEventId,
      strikerId: currentInnings.currentStriker?.id,
      nonStrikerId: currentInnings.currentNonStriker?.id,
      bowlerId: currentInnings.currentBowler?.id,
      runsOffBat,
      extraRuns,
      extraType,
      isWicket: false,
    };

    const description = extraType !== 'NONE' ? `${extraType} +${extraRuns} runs` : `${runsOffBat} Runs`;

    // If offline or network unavailable, save to queue locally!
    if (!navigator.onLine || !isOnline) {
      const queueItem = {
        id: clientEventId,
        clientEventId,
        inningsId: currentInnings.id,
        payload,
        description,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      const newQueue = [...offlineQueue, queueItem];
      saveOfflineQueue(newQueue);
      showToast(`📶 Saved locally in offline queue! (${description})`);
      setProcessing(false);
      return;
    }

    try {
      await api.post(`/innings/${currentInnings.id}/deliveries`, payload);
      await loadData();
    } catch (err) {
      if (!err.response) {
        // Network error -> Queue locally
        const queueItem = {
          id: clientEventId,
          clientEventId,
          inningsId: currentInnings.id,
          payload,
          description,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        const newQueue = [...offlineQueue, queueItem];
        saveOfflineQueue(newQueue);
        showToast(`📶 Connection lost: Delivery saved to offline queue!`);
      } else {
        setError(err.response?.data?.message || 'Failed to submit delivery');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleWicketSubmit = async (e) => {
    e.preventDefault();
    if (!currentInnings || processing) return;
    setProcessing(true);
    setError(null);

    const clientEventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payload = {
      clientEventId,
      strikerId: currentInnings.currentStriker?.id,
      nonStrikerId: currentInnings.currentNonStriker?.id,
      bowlerId: currentInnings.currentBowler?.id,
      runsOffBat: 0,
      extraRuns: 0,
      extraType: 'NONE',
      isWicket: true,
      wicketType: wicketForm.wicketType,
      dismissedPlayerId: wicketForm.dismissedPlayerId || currentInnings.currentStriker?.id,
      fielderId: wicketForm.fielderId || null,
      newBatterId: wicketForm.newBatterId || null,
    };

    const description = `WICKET (${wicketForm.wicketType})`;

    if (!navigator.onLine || !isOnline) {
      const queueItem = {
        id: clientEventId,
        clientEventId,
        inningsId: currentInnings.id,
        payload,
        description,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      saveOfflineQueue([...offlineQueue, queueItem]);
      setShowWicketModal(false);
      showToast(`📶 Wicket saved locally in offline queue!`);
      setProcessing(false);
      return;
    }

    try {
      await api.post(`/innings/${currentInnings.id}/deliveries`, payload);
      setShowWicketModal(false);
      await loadData();
    } catch (err) {
      if (!err.response) {
        const queueItem = {
          id: clientEventId,
          clientEventId,
          inningsId: currentInnings.id,
          payload,
          description,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };
        saveOfflineQueue([...offlineQueue, queueItem]);
        setShowWicketModal(false);
        showToast(`📶 Connection lost: Wicket saved to offline queue!`);
      } else {
        setError(err.response?.data?.message || 'Failed to submit wicket delivery');
      }
    } finally {
      setProcessing(false);
    }
  };

  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const handleUndo = async () => {
    if (!currentInnings || processing) return;
    setShowUndoConfirm(true);
  };

  const confirmUndo = async () => {
    setShowUndoConfirm(false);
    setProcessing(true);
    setError(null);
    try {
      await api.post(`/innings/${currentInnings.id}/undo`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to undo delivery');
    } finally {
      setProcessing(false);
    }
  };



  if (loading) {
    return <Spinner />;
  }

  if (!match || !currentInnings) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10 text-center space-y-4">
        <p className="text-xl">Match or Innings not active.</p>
        <button
          onClick={() => navigate('/create-match')}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl"
        >
          Setup Match & Innings
        </button>
      </div>
    );
  }

  const battingTeamPlayers = match.teamA?.name === currentInnings.battingTeamName ? match.teamA?.players : match.teamB?.players;
  const activeBatterIds = [currentInnings.currentStriker?.id, currentInnings.currentNonStriker?.id];
  const availableBatters = battingTeamPlayers?.filter(p => !activeBatterIds.includes(p.id)) || [];

  const pendingCount = offlineQueue.filter((i) => i.status === 'PENDING' || i.status === 'SYNCING').length;
  const failedCount = offlineQueue.filter((i) => i.status === 'FAILED' || i.status === 'CONFLICT').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Toast Notification Banner */}
        {toastMessage && (
            <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
          )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">AUTHORITATIVE SCORER CONSOLE</span>
              {/* Network Status Badge */}
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                isSyncing
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-spin' : isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                {isSyncing ? '🔄 Syncing...' : isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              {match.teamA?.name} vs {match.teamB?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-cyan-400">
                {currentInnings.totalRuns}/{currentInnings.totalWickets}
              </div>
              <div className="text-xs text-slate-400 font-mono">({currentInnings.totalOversDisplay} Overs)</div>
            </div>
            <button
              onClick={handleUndo}
              disabled={processing}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              ↩ UNDO BALL
            </button>
            {showUndoConfirm && (
              <ConfirmationDialog
                title="Undo Delivery"
                description="Are you sure you want to undo the last delivery?"
                onConfirm={confirmUndo}
                onCancel={() => setShowUndoConfirm(false)}
              />
            )}
          </div>
        </div>

        {/* Phase 11: Persistent Offline Sync Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📶</span>
              <h3 className="text-base font-bold text-white">Offline Scoring & Event Queue</h3>
              <span className="text-xs text-slate-400 font-mono">({offlineQueue.length} Queue Items)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={syncQueue}
                disabled={isSyncing || pendingCount === 0}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold rounded-xl transition shadow-lg flex items-center gap-1.5"
              >
                <span>🔄</span> Sync Now ({pendingCount})
              </button>
              {failedCount > 0 && (
                <button
                  onClick={discardFailedQueue}
                  className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl"
                >
                  Discard Failed ({failedCount})
                </button>
              )}
              {offlineQueue.length > 0 && (
                <button
                  onClick={clearCompletedQueue}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Clear Queue
                </button>
              )}
            </div>
          </div>

          {syncStatusText && (
            <div className="text-xs font-mono text-cyan-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {syncStatusText}
            </div>
          )}

          {/* Queue List Preview */}
          {offlineQueue.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {offlineQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      item.status === 'SYNCED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.status === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-slate-200 font-semibold">{item.description}</span>
                    <span className="text-slate-500 text-[10px] font-mono">({item.clientEventId})</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{new Date(item.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-3 font-mono">
              All scoring events are synchronized with the server.
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Active Crease Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs uppercase font-mono text-slate-400">Striker (On Strike)</div>
            <div className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              🏏 {currentInnings.currentStriker?.name || 'Not set'}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs uppercase font-mono text-slate-400">Non-Striker</div>
            <div className="text-lg font-bold text-slate-200">
              🏏 {currentInnings.currentNonStriker?.name || 'Not set'}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-xs uppercase font-mono text-slate-400">Bowler</div>
            <div className="text-lg font-bold text-emerald-400">
              ⚾ {currentInnings.currentBowler?.name || 'Not set'}
            </div>
          </div>
        </div>

        {/* Quick Scoring Grid */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Score Delivery</h3>

          {/* Runs Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Runs Off Bat</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 6].map((runs) => (
                <button
                  key={runs}
                  disabled={processing}
                  onClick={() => handleScoreBall(runs)}
                  className={`py-4 rounded-2xl font-black text-xl transition transform active:scale-95 shadow-lg ${
                    runs === 0
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : runs === 4
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                      : runs === 6
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20'
                  }`}
                >
                  {runs === 0 ? '0 (Dot)' : runs}
                </button>
              ))}
            </div>
          </div>

          {/* Extras Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Extras</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                disabled={processing}
                onClick={() => handleScoreBall(0, 1, 'WIDE')}
                className="py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-sm"
              >
                WIDE (+1)
              </button>
              <button
                disabled={processing}
                onClick={() => handleScoreBall(0, 1, 'NO_BALL')}
                className="py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-sm"
              >
                NO BALL (+1)
              </button>
              <button
                disabled={processing}
                onClick={() => handleScoreBall(0, 1, 'BYE')}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                BYE (+1)
              </button>
              <button
                disabled={processing}
                onClick={() => handleScoreBall(0, 1, 'LEG_BYE')}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                LEG BYE (+1)
              </button>
            </div>
          </div>

          {/* Wicket Action Trigger */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowWicketModal(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-lg shadow-xl shadow-rose-600/20 transition transform active:scale-98"
            >
              🚨 RECORD WICKET / DISMISSAL
            </button>
          </div>
        </div>

        {/* Wicket Modal */}
        {showWicketModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🔴 Record Wicket</span>
              </h3>

              <form onSubmit={handleWicketSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Dismissal Type</label>
                  <select
                    value={wicketForm.wicketType}
                    onChange={(e) => setWicketForm({ ...wicketForm, wicketType: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="BOWLED">Bowled</option>
                    <option value="CAUGHT">Caught</option>
                    <option value="LBW">LBW</option>
                    <option value="RUN_OUT">Run Out</option>
                    <option value="STUMPED">Stumped</option>
                    <option value="HIT_WICKET">Hit Wicket</option>
                    <option value="RETIRED_HURT">Retired Hurt</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Dismissed Player</label>
                  <select
                    value={wicketForm.dismissedPlayerId}
                    onChange={(e) => setWicketForm({ ...wicketForm, dismissedPlayerId: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value={currentInnings.currentStriker?.id}>
                      {currentInnings.currentStriker?.name} (Striker)
                    </option>
                    <option value={currentInnings.currentNonStriker?.id}>
                      {currentInnings.currentNonStriker?.name} (Non-Striker)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">New Batter Coming In</label>
                  {availableBatters.length > 0 ? (
                    <select
                      value={wicketForm.newBatterId}
                      onChange={(e) => setWicketForm({ ...wicketForm, newBatterId: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    >
                      <option value="">-- Select Next Batter --</option>
                      {availableBatters.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role || 'Batter'})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      placeholder="Enter Player ID of Next Batter"
                      value={wicketForm.newBatterId}
                      onChange={(e) => setWicketForm({ ...wicketForm, newBatterId: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWicketModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-xs font-bold"
                  >
                    Confirm Wicket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScorerDashboard;
