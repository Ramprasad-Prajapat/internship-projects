import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Leaderboards = () => {
  const [leaderboards, setLeaderboards] = useState({
    topRunScorers: [],
    topWicketTakers: [],
    bestStrikeRates: [],
    bestEconomies: [],
    mostSixes: [],
    mostFours: []
  });
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [activeCategory, setActiveCategory] = useState('runs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    fetchLeaderboards();
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      const res = await api.get('/tournaments');
      setTournaments(res.data || []);
    } catch (err) {
      console.error('Failed to load tournaments', err);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedTournament ? `/leaderboards?tournamentId=${selectedTournament}` : '/leaderboards';
      const res = await api.get(url);
      setLeaderboards(res.data || {});
    } catch (err) {
      console.error('Failed to fetch leaderboards', err);
      setError('Unable to load leaderboard data. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const openPlayerStats = async (playerId) => {
    if (!playerId) return;
    try {
      setPlayerLoading(true);
      setPlayerModalOpen(true);
      const url = selectedTournament ? `/players/${playerId}/stats?tournamentId=${selectedTournament}` : `/players/${playerId}/stats`;
      const res = await api.get(url);
      setSelectedPlayer(res.data);
    } catch (err) {
      console.error('Failed to fetch player stats', err);
      setSelectedPlayer(null);
    } finally {
      setPlayerLoading(false);
    }
  };

  const topRunScorers = leaderboards.topRunScorers || leaderboards.topScorers || [];
  const topWicketTakers = leaderboards.topWicketTakers || [];
  const bestStrikeRates = leaderboards.bestStrikeRates || [];
  const bestEconomies = leaderboards.bestEconomies || [];
  const mostSixes = leaderboards.mostSixes || [];
  const mostFours = leaderboards.mostFours || [];

  return (
    <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid text-[#1E293B] p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Tournament Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1E293B] pb-6">
          <div>
            <h1 className="text-4xl font-black text-[#1E293B] font-heading flex items-center gap-3 tracking-tight">
              🔥 Player Leaderboards
            </h1>
            <p className="text-slate-600 text-sm font-semibold mt-1">Official player rankings, top run scorers, and leading wicket takers</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-[#1E293B] pop-shadow-sm">
            <label className="text-xs font-extrabold text-[#1E293B] uppercase font-heading">Tournament:</label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] text-xs font-bold rounded-xl px-3.5 py-1.5 focus:outline-none"
            >
              <option value="">All Tournaments (Career)</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pb-4">
          {[
            { id: 'runs', label: '🏏 Top Run Scorers' },
            { id: 'wickets', label: '🎯 Leading Wicket Takers' },
            { id: 'sr', label: '⚡ Best Strike Rates' },
            { id: 'econ', label: '📉 Best Economies' },
            { id: 'boundary', label: '💥 Boundary Kings (6s & 4s)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border-2 border-[#1E293B] ${
                activeCategory === tab.id
                  ? 'bg-[#8B5CF6] text-white pop-shadow-sm'
                  : 'bg-white text-[#1E293B] hover:bg-[#FBBF24]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="bg-[#F472B6]/20 border-2 border-[#1E293B] rounded-3xl p-8 text-center text-[#1E293B] font-bold">
            <p>{error}</p>
            <button
              onClick={fetchLeaderboards}
              className="mt-4 px-5 py-2 bg-[#8B5CF6] text-white rounded-full text-xs font-extrabold border-2 border-[#1E293B] pop-button"
            >
              Retry Loading
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <div className="font-bold text-[#1E293B]">Loading leaderboard statistics...</div>
          </div>
        ) : (
          <div>
            {activeCategory === 'runs' && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-2xl font-black text-[#1E293B] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>🏏</span> Top Run Scorers
                </h2>
                <div className="divide-y-2 divide-[#1E293B]/20">
                  {topRunScorers.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-bold">No batting statistics recorded yet.</div>
                  ) : (
                    topRunScorers.map((player, idx) => (
                      <div
                        key={player.playerId || player.id || idx}
                        onClick={() => openPlayerStats(player.playerId || player.id)}
                        className="py-4 flex items-center justify-between hover:bg-[#FFFDF5] px-4 rounded-2xl cursor-pointer transition border border-transparent hover:border-[#1E293B]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] font-black font-heading flex items-center justify-center text-xs pop-shadow-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-extrabold text-[#1E293B] text-base font-heading hover:text-[#8B5CF6] transition">{player.playerName || player.name}</div>
                            <div className="text-xs text-slate-600 font-semibold">{player.teamName || 'Squad Player'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#8B5CF6] text-lg font-heading">{player.runs || 0} Runs</div>
                          <div className="text-[11px] text-slate-500 font-bold">Innings: {player.innings || 0} | SR: {(player.strikeRate || 0).toFixed(1)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeCategory === 'wickets' && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-2xl font-black text-[#1E293B] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>🎯</span> Leading Wicket Takers
                </h2>
                <div className="divide-y-2 divide-[#1E293B]/20">
                  {topWicketTakers.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-bold">No bowling statistics recorded yet.</div>
                  ) : (
                    topWicketTakers.map((player, idx) => (
                      <div
                        key={player.playerId || player.id || idx}
                        onClick={() => openPlayerStats(player.playerId || player.id)}
                        className="py-4 flex items-center justify-between hover:bg-[#FFFDF5] px-4 rounded-2xl cursor-pointer transition border border-transparent hover:border-[#1E293B]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#34D399] border-2 border-[#1E293B] text-[#1E293B] font-black font-heading flex items-center justify-center text-xs pop-shadow-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-extrabold text-[#1E293B] text-base font-heading hover:text-[#34D399] transition">{player.playerName || player.name}</div>
                            <div className="text-xs text-slate-600 font-semibold">{player.teamName || 'Squad Player'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#34D399] text-lg font-heading">{player.wickets || 0} Wickets</div>
                          <div className="text-[11px] text-slate-500 font-bold">Overs: {player.oversBowled || 0} | Econ: {(player.economy || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeCategory === 'sr' && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-2xl font-black text-[#1E293B] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>⚡</span> Highest Strike Rates
                </h2>
                <div className="divide-y-2 divide-[#1E293B]/20">
                  {bestStrikeRates.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-bold">No qualifying strike rate statistics yet.</div>
                  ) : (
                    bestStrikeRates.map((player, idx) => (
                      <div
                        key={player.playerId || player.id || idx}
                        onClick={() => openPlayerStats(player.playerId || player.id)}
                        className="py-4 flex items-center justify-between hover:bg-[#FFFDF5] px-4 rounded-2xl cursor-pointer transition border border-transparent hover:border-[#1E293B]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#F472B6] border-2 border-[#1E293B] text-[#1E293B] font-black font-heading flex items-center justify-center text-xs pop-shadow-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-extrabold text-[#1E293B] text-base font-heading">{player.playerName || player.name}</div>
                            <div className="text-xs text-slate-600 font-semibold">{player.teamName || 'Squad Player'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#F472B6] text-lg font-heading">SR: {(player.strikeRate || 0).toFixed(1)}</div>
                          <div className="text-[11px] text-slate-500 font-bold">{player.runs || 0} Runs ({player.ballsFaced || 0} balls)</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeCategory === 'econ' && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-2xl font-black text-[#1E293B] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>📉</span> Best Economy Rates
                </h2>
                <div className="divide-y-2 divide-[#1E293B]/20">
                  {bestEconomies.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-bold">No qualifying economy statistics yet.</div>
                  ) : (
                    bestEconomies.map((player, idx) => (
                      <div
                        key={player.playerId || player.id || idx}
                        onClick={() => openPlayerStats(player.playerId || player.id)}
                        className="py-4 flex items-center justify-between hover:bg-[#FFFDF5] px-4 rounded-2xl cursor-pointer transition border border-transparent hover:border-[#1E293B]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white border-2 border-[#1E293B] font-black font-heading flex items-center justify-center text-xs pop-shadow-sm">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-extrabold text-[#1E293B] text-base font-heading">{player.playerName || player.name}</div>
                            <div className="text-xs text-slate-600 font-semibold">{player.teamName || 'Squad Player'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#8B5CF6] text-lg font-heading">Econ: {(player.economy || 0).toFixed(2)}</div>
                          <div className="text-[11px] text-slate-500 font-bold">{player.wickets || 0} Wkts / {player.runsConceded || 0} Runs</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeCategory === 'boundary' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                  <h3 className="text-xl font-black text-[#1E293B] font-heading border-b-2 border-[#1E293B] pb-3 flex items-center gap-2">🚀 Most Sixes</h3>
                  <div className="divide-y-2 divide-[#1E293B]/20">
                    {mostSixes.length === 0 ? (
                      <div className="py-6 text-center text-slate-500 font-bold">No sixes recorded yet.</div>
                    ) : (
                      mostSixes.map((player, idx) => (
                        <div key={player.playerId || idx} className="py-3 flex items-center justify-between font-bold">
                          <div className="text-[#1E293B] font-heading">{idx + 1}. {player.playerName}</div>
                          <div className="font-black text-[#8B5CF6] text-base font-heading">{player.sixes} Sixes</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                  <h3 className="text-xl font-black text-[#1E293B] font-heading border-b-2 border-[#1E293B] pb-3 flex items-center gap-2">⚡ Most Fours</h3>
                  <div className="divide-y-2 divide-[#1E293B]/20">
                    {mostFours.length === 0 ? (
                      <div className="py-6 text-center text-slate-500 font-bold">No fours recorded yet.</div>
                    ) : (
                      mostFours.map((player, idx) => (
                        <div key={player.playerId || idx} className="py-3 flex items-center justify-between font-bold">
                          <div className="text-[#1E293B] font-heading">{idx + 1}. {player.playerName}</div>
                          <div className="font-black text-[#34D399] text-base font-heading">{player.fours} Fours</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Player Career Stats Modal */}
        {playerModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#1E293B]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[#1E293B] rounded-3xl max-w-2xl w-full p-6 pop-shadow-xl relative space-y-5">
              <button
                onClick={() => setPlayerModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F1F5F9] border-2 border-[#1E293B] text-[#1E293B] font-black text-sm hover:bg-[#F472B6]"
              >
                ✕
              </button>

              {playerLoading ? (
                <div className="py-16 text-center text-slate-500 font-bold">Loading player statistics...</div>
              ) : selectedPlayer ? (
                <div>
                  <div className="mb-6 border-b-2 border-[#1E293B] pb-4">
                    <div className="text-xs font-black text-[#8B5CF6] uppercase tracking-wider font-heading">{selectedPlayer.role}</div>
                    <h2 className="text-3xl font-black text-[#1E293B] font-heading mt-1">{selectedPlayer.playerName}</h2>
                    <div className="text-sm font-semibold text-slate-600">{selectedPlayer.teamName}</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Matches</div>
                      <div className="text-2xl font-black text-[#1E293B] font-heading mt-1">{selectedPlayer.matches || 0}</div>
                    </div>
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Runs</div>
                      <div className="text-2xl font-black text-[#8B5CF6] font-heading mt-1">{selectedPlayer.runs || 0}</div>
                    </div>
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Bat Average</div>
                      <div className="text-2xl font-black text-[#1E293B] font-heading mt-1">{(selectedPlayer.average || 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Strike Rate</div>
                      <div className="text-2xl font-black text-[#FBBF24] font-heading mt-1">{(selectedPlayer.strikeRate || 0).toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Wickets</div>
                      <div className="text-2xl font-black text-[#34D399] font-heading mt-1">{selectedPlayer.wickets || 0}</div>
                    </div>
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Economy</div>
                      <div className="text-2xl font-black text-[#8B5CF6] font-heading mt-1">{(selectedPlayer.economy || 0).toFixed(2)}</div>
                    </div>
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">Best Bowling</div>
                      <div className="text-2xl font-black text-[#1E293B] font-heading mt-1">{selectedPlayer.bestBowling || 'N/A'}</div>
                    </div>
                    <div className="bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl p-3.5 text-center pop-shadow-sm">
                      <div className="text-[10px] font-extrabold text-slate-500 uppercase font-heading">High Score</div>
                      <div className="text-2xl font-black text-[#1E293B] font-heading mt-1">
                        {selectedPlayer.highestScore}{selectedPlayer.highestScoreNotOut ? '*' : ''}
                      </div>
                    </div>
                  </div>

                  {selectedPlayer.recentForm && selectedPlayer.recentForm.length > 0 && (
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-600 uppercase font-heading mb-2">Recent Form (Last 5 Innings)</h4>
                      <div className="flex gap-2">
                        {selectedPlayer.recentForm.map((score, i) => (
                          <span key={i} className="px-3.5 py-1.5 bg-[#FFFDF5] text-[#1E293B] font-extrabold text-xs rounded-xl border-2 border-[#1E293B] pop-shadow-sm">
                            {score}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 font-bold">Player details unavailable.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboards;
