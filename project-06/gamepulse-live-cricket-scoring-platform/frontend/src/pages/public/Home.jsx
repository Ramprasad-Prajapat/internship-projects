import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getCachedMatchesIndex } from '../../services/matchCache';

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedMatches, setCachedMatches] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchMatches();
    };
    const handleOffline = () => {
      setIsOnline(false);
      loadCachedIndex();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      fetchMatches();
    } else {
      loadCachedIndex();
    }

    const interval = setInterval(() => {
      if (navigator.onLine) fetchMatches();
    }, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
      setIsOnline(true);
    } catch (err) {
      console.error('Failed to fetch matches', err);
      if (!navigator.onLine) {
        loadCachedIndex();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCachedIndex = () => {
    setIsOnline(false);
    const index = getCachedMatchesIndex();
    setCachedMatches(index);
    setLoading(false);
  };

  const filteredMatches = matches.filter((m) => {
    if (filter === 'LIVE') return m.status === 'LIVE' || m.status === 'TOSS' || m.status === 'INNINGS_BREAK';
    if (filter === 'COMPLETED') return m.status === 'COMPLETED';
    if (filter === 'SCHEDULED') return m.status === 'SCHEDULED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid text-[#1E293B] p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Offline Banner */}
        {!isOnline && (
          <div className="p-4 rounded-3xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-between gap-4 text-xs font-bold pop-shadow">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1E293B] animate-ping"></span>
              <span>📶 You are offline. Matches cached locally are available below for spectator view.</span>
            </div>
            <button
              onClick={fetchMatches}
              className="px-3.5 py-1.5 bg-[#FFFDF5] text-[#1E293B] rounded-full text-xs font-extrabold border-2 border-[#1E293B] pop-shadow-sm hover:scale-105 transition-all"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Playful Geometric Hero Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border-2 border-[#1E293B] p-8 md:p-14 pop-shadow-xl">
          {/* Confetti Background Shapes */}
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] pointer-events-none opacity-80"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-2xl bg-[#F472B6] border-2 border-[#1E293B] rotate-45 pointer-events-none pop-shadow-sm hidden md:block"></div>
          <div className="absolute bottom-6 right-12 w-28 h-28 rounded-full bg-[#34D399] border-2 border-[#1E293B] pointer-events-none pop-shadow-sm hidden md:block"></div>

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B5CF6] text-white text-xs font-extrabold border-2 border-[#1E293B] pop-shadow-sm">
              <span>⚡ REAL-TIME CRICKET ENGINE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1E293B] font-heading leading-tight tracking-tight">
              Live Scores. <br />
              <span className="text-[#8B5CF6] underline decoration-[#FBBF24] decoration-wavy decoration-4">Zero Latency.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-semibold leading-relaxed max-w-xl">
              Authoritative server-side scoring, instant WebSocket updates, ball-by-ball precision analytics, and local spectator caching.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#matches"
                className="px-6 py-3.5 rounded-full bg-[#8B5CF6] text-white text-xs sm:text-sm font-extrabold pop-button tracking-wide font-heading flex items-center gap-2"
              >
                <span>View Live Matches ➔</span>
              </a>
              <Link
                to="/tournaments"
                className="px-6 py-3.5 rounded-full bg-[#FFFDF5] text-[#1E293B] text-xs sm:text-sm font-extrabold border-2 border-[#1E293B] pop-shadow-sm hover:bg-[#FBBF24] transition-all font-heading"
              >
                🏆 Tournaments
              </Link>
            </div>
          </div>
        </div>

        {/* Match Filter Tabs */}
        <div id="matches" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1E293B] pb-6">
          <div>
            <h2 className="text-3xl font-black text-[#1E293B] font-heading tracking-tight flex items-center gap-3">
              Cricket Matches
              <span className="text-xs px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] font-bold pop-shadow-sm">
                {isOnline ? filteredMatches.length : cachedMatches.length} Available
              </span>
            </h2>
          </div>

          {isOnline && (
            <div className="flex flex-wrap bg-[#FFFDF5] p-1.5 rounded-full border-2 border-[#1E293B] gap-1.5 pop-shadow-sm">
              {['ALL', 'LIVE', 'SCHEDULED', 'COMPLETED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border-2 ${
                    filter === tab
                      ? 'bg-[#8B5CF6] text-white border-[#1E293B] pop-shadow-sm'
                      : 'border-transparent text-[#1E293B] hover:bg-[#F472B6]/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Match List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isOnline ? (
          filteredMatches.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-[#1E293B] pop-shadow-lg space-y-3">
              <span className="text-4xl block">🏏</span>
              <p className="text-[#1E293B] text-xl font-bold font-heading">No matches found in this category.</p>
              <p className="text-slate-500 text-xs font-semibold">Create a match from the Scorer Dashboard to start scoring live!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="group relative rounded-3xl bg-white border-2 border-[#1E293B] p-6 pop-shadow hover:-translate-y-1 hover:rotate-[-0.5deg] hover:pop-shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#1E293B] bg-[#F1F5F9] px-2.5 py-1 rounded-full border border-[#1E293B]">
                        {match.format || 'T20'} • {match.venue || 'Stadium'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border-2 border-[#1E293B] pop-shadow-sm ${
                          match.status === 'LIVE'
                            ? 'bg-[#34D399] text-[#1E293B] animate-pulse'
                            : match.status === 'COMPLETED'
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#FBBF24] text-[#1E293B]'
                        }`}
                      >
                        {match.status}
                      </span>
                    </div>

                    <div className="space-y-3 py-2">
                      <div className="flex items-center justify-between bg-[#FFFDF5] p-3 rounded-2xl border-2 border-[#1E293B]">
                        <span className="font-extrabold text-base text-[#1E293B] font-heading">
                          {match.teamA?.name || 'Team A'}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#8B5CF6] text-white border border-[#1E293B]">
                          {match.teamA?.shortName}
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#F472B6] border-2 border-[#1E293B] flex items-center justify-center font-black text-xs text-[#1E293B] mx-auto pop-shadow-sm">
                        VS
                      </div>

                      <div className="flex items-center justify-between bg-[#FFFDF5] p-3 rounded-2xl border-2 border-[#1E293B]">
                        <span className="font-extrabold text-base text-[#1E293B] font-heading">
                          {match.teamB?.name || 'Team B'}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FBBF24] text-[#1E293B] border border-[#1E293B]">
                          {match.teamB?.shortName}
                        </span>
                      </div>
                    </div>

                    {match.resultSummary ? (
                      <div className="p-3 rounded-2xl bg-[#FBBF24]/30 border-2 border-[#1E293B] text-xs text-[#1E293B] font-extrabold flex items-center gap-2">
                        <span>🏆</span> {match.resultSummary}
                      </div>
                    ) : match.tossWinner ? (
                      <div className="text-xs text-slate-600 font-bold italic bg-[#F1F5F9] p-2.5 rounded-xl border border-[#1E293B]">
                        🪙 Toss won by {match.tossWinner.name} ({match.tossDecision})
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-[#1E293B] flex items-center justify-between gap-3">
                    <Link
                      to={`/scoreboard/${match.id}`}
                      className="w-full text-center py-3 px-4 rounded-full bg-[#8B5CF6] text-white text-xs font-extrabold pop-button font-heading"
                    >
                      View Scorecard 📊
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Offline Cached Matches View */
          cachedMatches.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-[#1E293B] pop-shadow-lg space-y-3">
              <span className="text-4xl block">🔕</span>
              <p className="text-[#1E293B] text-xl font-bold font-heading">No cached matches available offline.</p>
              <p className="text-slate-500 text-xs font-semibold">When online, visiting match scorecards will automatically cache them for offline spectator access.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#1E293B] uppercase tracking-wider font-heading">Cached Spectator Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cachedMatches.map((cm) => (
                  <div key={cm.matchId} className="p-6 rounded-3xl bg-white border-2 border-[#1E293B] pop-shadow space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Match #{cm.matchId}</span>
                        <span className="bg-[#FBBF24] text-[#1E293B] font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-[#1E293B]">Cached</span>
                      </div>
                      <h4 className="font-extrabold text-[#1E293B] text-lg mt-2 font-heading">{cm.matchTitle}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">
                        Last synced: {new Date(cm.cachedAt).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to={`/scoreboard/${cm.matchId}`}
                      className="w-full text-center py-3 bg-[#FBBF24] text-[#1E293B] rounded-full text-xs font-extrabold pop-button font-heading"
                    >
                      View Offline Scorecard 📶
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
