import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../../services/api';
import wsService from '../../services/websocket';
import { saveMatchCache, getMatchCache } from '../../services/matchCache';

const Scoreboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scorecard, setScorecard] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('LIVE');
  const [wsConnected, setWsConnected] = useState(false);

  // Network & Cache State (Phase 13 & 14)
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineCached, setIsOfflineCached] = useState(false);
  const [cacheTimestamp, setCacheTimestamp] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Share Experience State (Phase 13 & 14)
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);
  const [shareSummaryText, setShareSummaryText] = useState('');

  // Phase 9 & 10: Match Pulse & Fan Polls
  const [matchPulse, setMatchPulse] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loadingPulse, setLoadingPulse] = useState(false);
  const [pulseError, setPulseError] = useState(null);
  const [votedPolls, setVotedPolls] = useState({});

  // Phase 10: AI summary
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // 1. Network listeners & Reconnection Refresh
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      refreshAllData();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [id]);

  // 2. Keyboard Access for Share Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showShareModal) {
        setShowShareModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShareModal]);

  // 3. Fetch or Load Cache on mount
  useEffect(() => {
    refreshAllData();

    // WebSocket live updates
    wsService.subscribeToMatch(id, (event) => {
      setWsConnected(true);
      if (event.scorecard) {
        setScorecard(event.scorecard);
        saveMatchCache(id, { scorecard: event.scorecard, commentary, analytics, matchPulse });
      }
      if (event.eventType === 'POLL_VOTED' || event.eventType === 'POLL_CREATED') {
        fetchFanEngagement();
      }
      fetchCommentary();
    });

    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchScorecard();
        fetchCommentary();
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      wsService.unsubscribe(`/topic/match/${id}`);
    };
  }, [id]);

  // 4. Dynamic Document Title & OpenGraph Social Metadata (Phase 14)
  useEffect(() => {
    if (!scorecard) return;

    const teamA = scorecard.teamAName || 'Team A';
    const teamB = scorecard.teamBName || 'Team B';
    const status = scorecard.status || 'SCHEDULED';
    const result = scorecard.resultSummary;

    const currentInnings = scorecard.inningsList && scorecard.inningsList.length > 0
      ? scorecard.inningsList[scorecard.inningsList.length - 1]
      : null;

    let pageTitle = `${teamA} vs ${teamB} — Scorecard | GamePulse Live`;
    let metaDesc = `Follow ${teamA} vs ${teamB} live scores, ball-by-ball commentary, and match analytics on GamePulse Live.`;

    if (status === 'LIVE' && currentInnings) {
      pageTitle = `${teamA} vs ${teamB} — LIVE (${currentInnings.totalRuns}/${currentInnings.totalWickets} in ${currentInnings.totalOversDisplay} ov) | GamePulse Live`;
      metaDesc = `LIVE Score: ${currentInnings.battingTeamName} ${currentInnings.totalRuns}/${currentInnings.totalWickets} (${currentInnings.totalOversDisplay} ov). Follow live ball-by-ball updates!`;
    } else if (status === 'COMPLETED' && result) {
      pageTitle = `${teamA} vs ${teamB} — ${result} | GamePulse Live`;
      metaDesc = `${teamA} vs ${teamB} match completed. ${result}. View full scorecard and analytics.`;
    }

    document.title = pageTitle;

    const setMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const shareUrl = getShareUrl();
    setMeta('name', 'description', metaDesc);
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', metaDesc);
    setMeta('property', 'og:url', shareUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', metaDesc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', shareUrl);
  }, [scorecard, id]);

  const refreshAllData = async () => {
    setLoading(true);
    setFetchError(null);

    if (navigator.onLine) {
      try {
        await Promise.all([fetchScorecard(), fetchCommentary()]);
        setIsOfflineCached(false);
      } catch (err) {
        console.error('API call failed online, attempting offline spectator cache', err);
        loadOfflineCache();
      }
    } else {
      loadOfflineCache();
    }
  };

  const loadOfflineCache = () => {
    const cached = getMatchCache(id);
    if (cached) {
      setScorecard(cached.scorecard);
      setCommentary(cached.commentary || []);
      if (cached.analytics) setAnalytics(cached.analytics);
      if (cached.matchPulse) setMatchPulse(cached.matchPulse);
      setIsOfflineCached(true);
      setCacheTimestamp(cached.cachedAt || cached.lastUpdated);
      setFetchError(null);
    } else {
      setScorecard(null);
      setIsOfflineCached(false);
      setFetchError(navigator.onLine ? 'Match not found or is no longer available.' : "You're offline and this match hasn't been cached yet.");
    }
    setLoading(false);
  };

  const fetchScorecard = async () => {
    try {
      const res = await api.get(`/matches/${id}/scorecard`);
      setScorecard(res.data);
      setFetchError(null);
      saveMatchCache(id, { scorecard: res.data, commentary, analytics, matchPulse });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setScorecard(null);
        setFetchError('Match not found or is no longer available.');
      } else if (!navigator.onLine) {
        loadOfflineCache();
      } else {
        setFetchError('Failed to fetch match scorecard.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentary = async () => {
    if (!navigator.onLine) return;
    try {
      const res = await api.get(`/matches/${id}/commentary`);
      setCommentary(res.data || []);
      saveMatchCache(id, { scorecard, commentary: res.data, analytics, matchPulse });
    } catch (err) {
      console.error('Failed to load commentary', err);
    }
  };

  const fetchAnalytics = async () => {
    if (!navigator.onLine) return;
    try {
      setLoadingAnalytics(true);
      const res = await api.get(`/matches/${id}/analytics`);
      setAnalytics(res.data);
      saveMatchCache(id, { scorecard, commentary, analytics: res.data, matchPulse });
    } catch (err) {
      console.error('Failed to fetch match analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchFanEngagement = async () => {
    if (!navigator.onLine) return;
    try {
      setLoadingPulse(true);
      setPulseError(null);
      const [pulseRes, pollsRes] = await Promise.all([
        api.get(`/matches/${id}/pulse`),
        api.get(`/matches/${id}/polls`),
      ]);
      setMatchPulse(pulseRes.data);
      setPolls(pollsRes.data);
      saveMatchCache(id, { scorecard, commentary, analytics, matchPulse: pulseRes.data });
    } catch (err) {
      console.error('Failed to fetch fan engagement data', err);
      setPulseError('Failed to load match pulse & polls.');
    } finally {
      setLoadingPulse(false);
    }

  };

  const fetchAiSummary = async () => {
    if (!navigator.onLine) return;
    try {
      setLoadingAi(true);
      const res = await api.get(`/matches/${id}/ai-summary`);
      setAiSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch AI summary', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleExportSummary = () => {
    window.open(`${API_BASE_URL}/exports/matches/${id}/summary`, '_blank');
  };

  const handleVote = async (pollId, optionIndex) => {
    if (!navigator.onLine) {
      alert('Voting requires an active network connection.');
      return;
    }
    try {
      const res = await api.post(`/polls/${pollId}/vote`, { optionIndex });
      setPolls((prevPolls) =>
        prevPolls.map((p) => (p.id === pollId ? res.data : p))
      );
      setVotedPolls((prev) => ({ ...prev, [pollId]: optionIndex }));
    } catch (err) {
      console.error('Failed to register vote', err);
      alert('Could not submit vote. Please try again.');
    }
  };

  // Phase 13 & 14 Share Match Action
  const getShareUrl = () => `${window.location.origin}/scoreboard/${id}`;

  const buildShareSummary = () => {
    if (!scorecard) return `GamePulse Live Scorecard: ${getShareUrl()}`;
    const teamA = scorecard.teamAName || 'Team A';
    const teamB = scorecard.teamBName || 'Team B';
    const status = scorecard.status || 'SCHEDULED';
    const result = scorecard.resultSummary;

    const currentInn = scorecard.inningsList && scorecard.inningsList.length > 0
      ? scorecard.inningsList[scorecard.inningsList.length - 1]
      : null;

    let scoreStr = currentInn
      ? `${currentInn.battingTeamName} ${currentInn.totalRuns}/${currentInn.totalWickets} (${currentInn.totalOversDisplay} ov)`
      : 'Scheduled';

    if (status === 'COMPLETED' && result) {
      return `🏆 ${teamA} vs ${teamB} — ${result}\nFinal Score: ${scoreStr}\nView Full Scorecard: ${getShareUrl()}`;
    }
    if (status === 'LIVE') {
      return `⚡ ${teamA} vs ${teamB} (LIVE)\nCurrent Score: ${scoreStr}\nFollow Live Scorecard: ${getShareUrl()}`;
    }
    return `🏏 ${teamA} vs ${teamB}\nStatus: ${status}\nScorecard: ${getShareUrl()}`;
  };

  const handleShareMatch = async () => {
    const shareUrl = getShareUrl();
    const shareText = buildShareSummary();
    setShareSummaryText(shareText);

    if (navigator.share) {
      try {
        await navigator.share({
          title: scorecard ? `${scorecard.teamAName} vs ${scorecard.teamBName}` : 'GamePulse Live Scorecard',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyShareUrlToClipboard = async () => {
    const shareUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccessToast(true);
      setTimeout(() => setShareSuccessToast(false), 3000);
    } catch (_err) {
      alert(`Match Link: ${shareUrl}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid flex flex-col items-center justify-center space-y-4 p-6">
        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#1E293B] text-sm font-extrabold font-heading">Loading GamePulse Match Data...</p>
      </div>
    );
  }

  if (fetchError || !scorecard) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid text-[#1E293B] p-6 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="p-8 max-w-md w-full rounded-3xl bg-white border-2 border-[#1E293B] pop-shadow-xl space-y-4">
          <div className="text-4xl">{isOnline ? '🏏' : '📶'}</div>
          <h2 className="text-2xl font-black text-[#1E293B] font-heading">
            {fetchError || 'Match not found.'}
          </h2>
          <p className="text-xs text-slate-600 font-semibold">
            {!isOnline
              ? 'Connect to the internet to fetch live scores or view other matches.'
              : 'Please check the match ID or return to the live match list.'}
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={refreshAllData}
              className="flex-1 py-3 rounded-full bg-[#F1F5F9] hover:bg-[#FBBF24] text-[#1E293B] text-xs font-extrabold transition border-2 border-[#1E293B] pop-shadow-sm"
            >
              🔄 Retry
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 rounded-full bg-[#8B5CF6] text-white text-xs font-extrabold transition pop-button"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentInnings = scorecard.inningsList && scorecard.inningsList.length > 0
    ? scorecard.inningsList[scorecard.inningsList.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid text-[#1E293B] p-4 md:p-8 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Phase 13 Offline Banner */}
        {(!isOnline || isOfflineCached) && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between gap-4 text-xs font-semibold shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>
                📶 Offline Mode — Showing cached match data.
                {cacheTimestamp && (
                  <span className="text-[11px] font-mono text-amber-400/80 ml-2">
                    (Last updated: {new Date(cacheTimestamp).toLocaleTimeString()})
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={refreshAllData}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-[11px] font-bold border border-amber-500/40"
            >
              Try Reconnect
            </button>
          </div>
        )}

        {/* Live Status Header */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{scorecard.venue || 'Stadium'}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {scorecard.teamAName} vs {scorecard.teamBName}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleShareMatch}
                aria-label="Share match scorecard link and text summary"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-600 text-white text-xs font-semibold transition border border-cyan-500/30 flex items-center gap-1.5 shadow-md shadow-cyan-500/10"
              >
                <span>🔗</span> Share Match
              </button>

              <button
                onClick={handleExportSummary}
                aria-label="Export match summary report"
                className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold transition border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>📥</span> Export Summary
              </button>

              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {scorecard.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {wsConnected ? '⚡ Live WebSocket' : isOnline ? '🔄 Auto Sync' : '📶 Cached'}
              </span>
            </div>
          </div>

          {/* Current Score Big Display */}
          {currentInnings ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {currentInnings.battingTeamName} Innings ({currentInnings.inningsNumber === 1 ? '1st' : '2nd'})
                </div>
                <div className="text-5xl font-black text-white tracking-tight flex items-baseline gap-3">
                  {currentInnings.totalRuns}/{currentInnings.totalWickets}
                  <span className="text-2xl text-cyan-400 font-normal">({currentInnings.totalOversDisplay} ov)</span>
                </div>
                {currentInnings.targetRuns && (
                  <div className="text-xs text-emerald-400 font-medium">
                    Target: {currentInnings.targetRuns} runs (Need {Math.max(0, currentInnings.targetRuns - currentInnings.totalRuns)} from {120 - currentInnings.legalBallCount} balls)
                  </div>
                )}
              </div>

              {/* Run Rates */}
              <div className="flex gap-6 justify-start md:justify-center border-y md:border-y-0 md:border-x border-slate-800 py-3 md:py-0 px-0 md:px-6">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Current RR</div>
                  <div className="text-xl font-bold text-slate-200">
                    {currentInnings.legalBallCount > 0
                      ? ((currentInnings.totalRuns * 6) / currentInnings.legalBallCount).toFixed(2)
                      : '0.00'}
                  </div>
                </div>
                {currentInnings.targetRuns && (
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Req RR</div>
                    <div className="text-xl font-bold text-cyan-400">
                      {Math.max(0, 120 - currentInnings.legalBallCount) > 0
                        ? (((currentInnings.targetRuns - currentInnings.totalRuns) * 6) / (120 - currentInnings.legalBallCount)).toFixed(2)
                        : '0.00'}
                    </div>
                  </div>
                )}
              </div>

              {/* Result summary or toss info */}
              <div className="text-right space-y-1">
                {scorecard.resultSummary ? (
                  <div className="text-sm font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/30">
                    🏆 {scorecard.resultSummary}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-medium">
                    Recent Extras: {currentInnings.extras?.total || 0} (W {currentInnings.extras?.wides}, NB {currentInnings.extras?.noBalls})
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-center py-4">Innings has not started yet.</div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-2 max-w-2xl overflow-x-auto">
          {['LIVE', 'SCORECARD', 'ANALYTICS', 'COMMENTARY', 'AI SUMMARY', 'FAN PULSE'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'ANALYTICS' && !analytics) fetchAnalytics();
                if (tab === 'FAN PULSE' && !matchPulse) fetchFanEngagement();
                if (tab === 'AI SUMMARY' && !aiSummary) fetchAiSummary();
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: LIVE CREASE SNAPSHOT */}
        {activeTab === 'LIVE' && currentInnings && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>🏏 Batters On Crease</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 text-xs uppercase font-mono">
                      <th className="pb-3">Batter</th>
                      <th className="pb-3 text-right">R</th>
                      <th className="pb-3 text-right">B</th>
                      <th className="pb-3 text-right">4s</th>
                      <th className="pb-3 text-right">6s</th>
                      <th className="pb-3 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {currentInnings.battingTable
                      ?.filter((b) => !b.isOut)
                      .map((b) => {
                        const isStriker = currentInnings.currentStriker?.id === b.playerId;
                        return (
                          <tr key={b.playerId} className={isStriker ? 'bg-cyan-500/5 text-cyan-300 font-semibold' : 'text-slate-200'}>
                            <td className="py-3 flex items-center gap-2">
                              {b.playerName} {isStriker && <span className="text-xs text-cyan-400">⚡*</span>}
                            </td>
                            <td className="py-3 text-right font-bold">{b.runs}</td>
                            <td className="py-3 text-right text-slate-400">{b.ballsFaced}</td>
                            <td className="py-3 text-right text-slate-400">{b.fours}</td>
                            <td className="py-3 text-right text-slate-400">{b.sixes}</td>
                            <td className="py-3 text-right text-slate-300 font-mono">{b.strikeRate}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">⚾ Current Bowler</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 text-xs uppercase font-mono">
                      <th className="pb-3">Bowler</th>
                      <th className="pb-3 text-right">O</th>
                      <th className="pb-3 text-right">M</th>
                      <th className="pb-3 text-right">R</th>
                      <th className="pb-3 text-right">W</th>
                      <th className="pb-3 text-right">Econ</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium text-slate-200">
                    {currentInnings.bowlingTable
                      ?.filter((b) => currentInnings.currentBowler?.id === b.playerId)
                      .map((b) => (
                        <tr key={b.playerId}>
                          <td className="py-3 font-semibold text-cyan-300">{b.playerName} *</td>
                          <td className="py-3 text-right">{b.oversDisplay}</td>
                          <td className="py-3 text-right text-slate-400">{b.maidens}</td>
                          <td className="py-3 text-right">{b.runsConceded}</td>
                          <td className="py-3 text-right font-bold text-emerald-400">{b.wickets}</td>
                          <td className="py-3 text-right font-mono">{b.economy}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {currentInnings.recentDeliveries && currentInnings.recentDeliveries.length > 0 && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                <h4 className="text-xs uppercase font-mono text-slate-400 tracking-wider">Recent Balls</h4>
                <div className="flex flex-wrap gap-2">
                  {currentInnings.recentDeliveries.map((del, idx) => (
                    <span
                      key={idx}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-md ${
                        del.isWicket
                          ? 'bg-rose-500 text-white shadow-rose-500/20'
                          : del.runsOffBat === 6
                          ? 'bg-purple-600 text-white shadow-purple-500/20'
                          : del.runsOffBat === 4
                          ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                          : del.extraType !== 'NONE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {del.isWicket ? 'W' : del.totalRuns}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: FULL SCORECARD */}
        {activeTab === 'SCORECARD' && (
          <div className="space-y-8">
            {scorecard.inningsList?.map((inn) => (
              <div key={inn.id} className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-white">
                    {inn.battingTeamName} Innings ({inn.totalRuns}/{inn.totalWickets} in {inn.totalOversDisplay} ov)
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Innings {inn.inningsNumber}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Batting</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm divide-y divide-slate-800">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase font-mono">
                          <th className="pb-3">Batter</th>
                          <th className="pb-3">Dismissal</th>
                          <th className="pb-3 text-right">R</th>
                          <th className="pb-3 text-right">B</th>
                          <th className="pb-3 text-right">4s</th>
                          <th className="pb-3 text-right">6s</th>
                          <th className="pb-3 text-right">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 font-medium">
                        {inn.battingTable?.map((b) => (
                          <tr key={b.playerId} className="hover:bg-slate-800/30">
                            <td className="py-3 font-semibold text-white">{b.playerName}</td>
                            <td className="py-3 text-xs text-slate-400">{b.dismissalText}</td>
                            <td className="py-3 text-right font-bold text-cyan-400">{b.runs}</td>
                            <td className="py-3 text-right text-slate-400">{b.ballsFaced}</td>
                            <td className="py-3 text-right text-slate-400">{b.fours}</td>
                            <td className="py-3 text-right text-slate-400">{b.sixes}</td>
                            <td className="py-3 text-right font-mono text-slate-300">{b.strikeRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Bowling</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm divide-y divide-slate-800">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase font-mono">
                          <th className="pb-3">Bowler</th>
                          <th className="pb-3 text-right">O</th>
                          <th className="pb-3 text-right">M</th>
                          <th className="pb-3 text-right">R</th>
                          <th className="pb-3 text-right">W</th>
                          <th className="pb-3 text-right">Econ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 font-medium">
                        {inn.bowlingTable?.map((b) => (
                          <tr key={b.playerId} className="hover:bg-slate-800/30">
                            <td className="py-3 font-semibold text-white">{b.playerName}</td>
                            <td className="py-3 text-right text-slate-300">{b.oversDisplay}</td>
                            <td className="py-3 text-right text-slate-400">{b.maidens}</td>
                            <td className="py-3 text-right text-slate-300">{b.runsConceded}</td>
                            <td className="py-3 text-right font-bold text-emerald-400">{b.wickets}</td>
                            <td className="py-3 text-right font-mono text-slate-300">{b.economy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: MATCH ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>📊</span> Match Performance Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-1">Cumulative worm graph, over progression & phase breakdown</p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition"
              >
                🔄 Refresh Analytics
              </button>
            </div>

            {loadingAnalytics ? (
              <div className="py-16 text-center text-slate-400">Loading match analytics engine...</div>
            ) : analytics ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Dot Ball %</div>
                    <div className="text-3xl font-extrabold text-amber-400 mt-2">
                      {(analytics.statsPercentages?.dotBallPercentage || 0).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Boundary %</div>
                    <div className="text-3xl font-extrabold text-cyan-400 mt-2">
                      {(analytics.statsPercentages?.boundaryPercentage || 0).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Strike Rotation %</div>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-2">
                      {(analytics.statsPercentages?.strikeRotationPercentage || 0).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {analytics.phaseAnalysis && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Innings Phase Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['powerplay', 'middleOvers', 'deathOvers'].map((phaseKey) => {
                        const phase = analytics.phaseAnalysis[phaseKey];
                        if (!phase) return null;
                        return (
                          <div key={phaseKey} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2">
                            <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{phase.phaseName}</div>
                            <div className="flex justify-between items-baseline pt-1">
                              <span className="text-2xl font-black text-white">{phase.runsScored || 0} Runs</span>
                              <span className="text-xs font-semibold text-rose-400">{phase.wicketsLost || 0} Wkts</span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono">Run Rate: {(phase.runRate || 0).toFixed(2)} rpo</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-8">No analytics data available for this match.</div>
            )}
          </div>
        )}

        {/* Tab 4: COMMENTARY FEED */}
        {activeTab === 'COMMENTARY' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white">Ball-by-Ball Live Commentary</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {commentary.map((del) => (
                <div key={del.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-4 items-start">
                  <div
                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                      del.isWicket
                        ? 'bg-rose-500 text-white'
                        : del.runsOffBat === 6
                        ? 'bg-purple-600 text-white'
                        : del.runsOffBat === 4
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {del.isWicket ? 'W' : del.totalRuns}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Over {del.overNumber}.{del.ballNumber}</span>
                      <span>{del.inningsScoreDisplay}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium">{del.commentary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: AI TACTICAL SUMMARY */}
        {activeTab === 'AI SUMMARY' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🤖</span> AI Tactical Match Breakdown
              </h3>
              <button
                onClick={fetchAiSummary}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700"
              >
                🔄 Refresh AI
              </button>
            </div>

            {loadingAi ? (
              <div className="py-10 text-center text-slate-400">Generating AI match insights...</div>
            ) : aiSummary ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/30">
                  <div className="text-xs uppercase font-mono text-cyan-400 font-semibold">Match Headline</div>
                  <div className="text-lg font-extrabold text-white mt-1">{aiSummary.headline}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs uppercase font-mono text-amber-400 font-semibold">Key Turning Point</div>
                    <div className="text-sm text-slate-200 mt-1">{aiSummary.turningPoint}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs uppercase font-mono text-emerald-400 font-semibold">Winning Factor</div>
                    <div className="text-sm text-slate-200 mt-1">{aiSummary.winningFactor}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-6">AI analysis ready upon request.</div>
            )}
          </div>
        )}

        {/* Tab 6: FAN PULSE */}
        {activeTab === 'FAN PULSE' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🗳️</span> Match Pulse & Win Probability
                </h3>
                <p className="text-xs text-slate-400 mt-1">Live win prediction engine, momentum & interactive fan polls</p>
              </div>
              <button
                onClick={fetchFanEngagement}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 transition"
              >
                🔄 Refresh Pulse
              </button>
            </div>

            {loadingPulse ? (
              <div className="py-16 text-center text-slate-400">Computing live match pulse & fetching fan polls...</div>
            ) : pulseError ? (
              <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-3">
                <div className="text-rose-400 text-sm font-semibold">{pulseError}</div>
                <button
                  onClick={fetchFanEngagement}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {matchPulse && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400 font-bold uppercase">{scorecard.teamAName}: {matchPulse.teamAWinProbability}%</span>
                      <span className="text-indigo-400 font-bold uppercase">{scorecard.teamBName}: {matchPulse.teamBWinProbability}%</span>
                    </div>

                    <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${matchPulse.teamAWinProbability}%` }}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full transition-all duration-500"
                      ></div>
                      <div
                        style={{ width: `${matchPulse.teamBWinProbability}%` }}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full transition-all duration-500"
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <div>
                        Match Momentum: <span className="text-emerald-400 font-bold">{matchPulse.matchMomentum || 'BALANCED'}</span>
                      </div>
                      <div>
                        Status: <span className="text-cyan-300 font-semibold">{matchPulse.currentStatusText || scorecard.status}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Active Fan Polls</h4>

                  {polls && polls.length > 0 ? (
                    polls.map((poll) => {
                      const totalVotes = (poll.votes || []).reduce((a, b) => a + b, 0);
                      const hasVoted = votedPolls[poll.id] !== undefined;

                      return (
                        <div key={poll.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-white text-base">{poll.question}</h5>
                            <span className="text-[11px] font-mono text-slate-400">{totalVotes} Total Votes</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {poll.options?.map((optionText, optIdx) => {
                              const voteCount = poll.votes?.[optIdx] || 0;
                              const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                              const isSelected = votedPolls[poll.id] === optIdx;

                              return (
                                <button
                                  key={optIdx}
                                  disabled={hasVoted || !poll.active}
                                  onClick={() => handleVote(poll.id, optIdx)}
                                  className={`p-4 rounded-xl font-bold border transition text-left relative overflow-hidden ${
                                    isSelected
                                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                      : hasVoted
                                      ? 'bg-slate-900 border-slate-800 text-slate-300 cursor-default'
                                      : 'bg-slate-900 border-slate-800 hover:border-cyan-500 text-white'
                                  }`}
                                >
                                  {hasVoted && (
                                    <div
                                      style={{ width: `${pct}%` }}
                                      className="absolute inset-0 bg-cyan-500/10 pointer-events-none transition-all duration-500"
                                    ></div>
                                  )}
                                  <div className="relative z-10 flex justify-between items-center">
                                    <span>{optionText}</span>
                                    {hasVoted && (
                                      <span className="text-xs font-mono text-cyan-400">
                                        {pct}% ({voteCount})
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                      <div className="text-2xl">🗳️</div>
                      <div className="text-sm font-semibold">No fan polls are currently available for this match.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phase 13 & 14 Accessible Share Match Modal */}
      {showShareModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 id="share-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>🔗 Share Match Scorecard</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                aria-label="Close share dialog"
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Share Summary Preview Card */}
              {shareSummaryText && (
                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">Share Preview</div>
                  <p className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                    {shareSummaryText}
                  </p>
                </div>
              )}

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-400 truncate">{getShareUrl()}</span>
                <button
                  onClick={copyShareUrlToClipboard}
                  aria-label="Copy share link to clipboard"
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs flex-shrink-0 transition"
                >
                  Copy
                </button>
              </div>

              {shareSuccessToast && (
                <div
                  aria-live="polite"
                  className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center rounded-xl text-xs font-bold animate-fade-in"
                >
                  ✓ Match link copied to clipboard!
                </div>
              )}

              {/* Social Share Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareSummaryText || getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share match on WhatsApp"
                  className="p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-bold text-xs text-center flex flex-col items-center gap-1"
                >
                  <span>💬</span> WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareSummaryText || getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share match on Twitter or X"
                  className="p-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 font-bold text-xs text-center flex flex-col items-center gap-1"
                >
                  <span>𝕏</span> Twitter / X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share match on Facebook"
                  className="p-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 font-bold text-xs text-center flex flex-col items-center gap-1"
                >
                  <span>📘</span> Facebook
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
