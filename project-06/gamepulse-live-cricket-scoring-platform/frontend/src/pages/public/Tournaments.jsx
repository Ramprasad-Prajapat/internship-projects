import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../../services/api';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tournaments');
      setTournaments(res.data);
      if (res.data.length > 0) {
        selectTournament(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch tournaments', err);
    } finally {
      setLoading(false);
    }
  };

  const selectTournament = async (t) => {
    setSelectedTournament(t);
    try {
      const res = await api.get(`/tournaments/${t.id}/standings`);
      setStandings(res.data.teams || res.data || []);
    } catch (err) {
      console.error('Failed to fetch standings', err);
      setStandings([]);
    }
  };

  const handleExportCSV = (tournamentId) => {
    window.open(`${API_BASE_URL}/exports/tournaments/${tournamentId}/standings`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid text-[#1E293B] p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#1E293B] pb-6">
          <div>
            <h1 className="text-4xl font-black text-[#1E293B] font-heading flex items-center gap-3 tracking-tight">
              🏆 Tournaments & Standings
            </h1>
            <p className="text-slate-600 text-sm font-semibold mt-1">Official league tables, team standings, and Net Run Rates (NRR)</p>
          </div>

          {selectedTournament && (
            <button
              onClick={() => handleExportCSV(selectedTournament.id)}
              className="px-5 py-2.5 bg-[#34D399] text-[#1E293B] text-xs font-extrabold rounded-full pop-button font-heading flex items-center gap-2"
            >
              <span>📥</span> Export Standings CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-10 text-center pop-shadow-lg">
            <p className="text-xl font-bold font-heading text-[#1E293B]">No tournaments created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tournament List */}
            <div className="space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-heading mb-2">All Leagues</h2>
              {tournaments.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTournament(t)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border-2 border-[#1E293B] ${
                    selectedTournament?.id === t.id
                      ? 'bg-[#8B5CF6] text-white pop-shadow-md'
                      : 'bg-white text-[#1E293B] hover:bg-[#FBBF24]/20 pop-shadow-sm'
                  }`}
                >
                  <div className="font-extrabold text-base font-heading">{t.name}</div>
                  <div className="text-xs mt-1 flex items-center justify-between opacity-90 font-medium">
                    <span>Format: {t.format}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FBBF24] text-[#1E293B] text-[10px] font-extrabold border border-[#1E293B]">{t.status}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Standings Table */}
            <div className="lg:col-span-3 bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-6">
              {selectedTournament && (
                <>
                  <div className="pb-4 border-b-2 border-[#1E293B] flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-[#1E293B] font-heading">{selectedTournament.name} Standings</h2>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">{selectedTournament.description || 'Official League Points Table'}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#1E293B]">
                      <thead className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] bg-[#FFFDF5] border-b-2 border-[#1E293B] font-heading">
                        <tr>
                          <th className="py-3 px-4">Pos</th>
                          <th className="py-3 px-4">Team</th>
                          <th className="py-3 px-4 text-center">P</th>
                          <th className="py-3 px-4 text-center">W</th>
                          <th className="py-3 px-4 text-center">L</th>
                          <th className="py-3 px-4 text-center">T</th>
                          <th className="py-3 px-4 text-center">NR</th>
                          <th className="py-3 px-4 text-center">Pts</th>
                          <th className="py-3 px-4 text-right">NRR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-[#1E293B]/20">
                        {standings.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="py-8 text-center text-slate-500 font-bold">
                              No standings entries recorded for this tournament.
                            </td>
                          </tr>
                        ) : (
                          standings.map((st, index) => (
                            <tr key={st.id || index} className="hover:bg-[#F1F5F9] transition font-medium">
                              <td className="py-3.5 px-4 font-black font-heading text-[#8B5CF6]">
                                <span className="w-7 h-7 rounded-full bg-[#FBBF24] border border-[#1E293B] text-[#1E293B] inline-flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-[#1E293B] font-heading">{st.teamName || st.team?.name || 'Team'}</td>
                              <td className="py-3.5 px-4 text-center font-bold">{st.played ?? 0}</td>
                              <td className="py-3.5 px-4 text-center font-extrabold text-[#34D399]">{st.won ?? 0}</td>
                              <td className="py-3.5 px-4 text-center font-extrabold text-[#F472B6]">{st.lost ?? 0}</td>
                              <td className="py-3.5 px-4 text-center font-bold">{st.tied ?? 0}</td>
                              <td className="py-3.5 px-4 text-center font-bold">{st.noResult ?? 0}</td>
                              <td className="py-3.5 px-4 text-center font-black text-[#1E293B]">
                                <span className="px-3 py-1 bg-[#8B5CF6] text-white rounded-full border border-[#1E293B] pop-shadow-sm text-xs">
                                  {st.points ?? 0}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right font-extrabold text-[#8B5CF6]">
                                {(st.nrr ?? st.netRunRate ?? 0.0) >= 0 ? `+${(st.nrr ?? st.netRunRate ?? 0.0).toFixed(3)}` : (st.nrr ?? st.netRunRate ?? 0.0).toFixed(3)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
