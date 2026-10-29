import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../../services/api';
import Pagination from '../../components/common/Pagination';

const PAGE_SIZE = 20;

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(''); // live, upcoming, completed
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const executeSearch = async (searchPage = 0) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await search(query, filter, searchPage, PAGE_SIZE);
      setResults(res.data);
      const tp =
        res.data.playersPage?.totalPages ??
        res.data.teamsPage?.totalPages ??
        res.data.matchesPage?.totalPages ??
        res.data.tournamentsPage?.totalPages ??
        0;
      setTotalPages(tp);
      setPage(searchPage);
    } catch (err) {
      console.error('Search failed', err);
      setError('Search failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await executeSearch(0);
  };

  const handlePageChange = async (newPage) => {
    await executeSearch(newPage);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] bg-dot-grid text-[#1E293B] p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] border-2 border-[#1E293B] text-white flex items-center justify-center mx-auto pop-shadow-sm font-heading font-black text-xl">
            🔍
          </div>
          <h1 className="text-4xl font-black text-[#1E293B] font-heading tracking-tight">
            Global Search
          </h1>
          <p className="text-slate-600 text-sm font-semibold">
            Discover players, teams, matches, venues and tournaments instantly
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-3 pop-shadow-xl flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by player, team, tournament or venue..."
              className="flex-1 w-full bg-[#FFFDF5] border-2 border-[#1E293B] rounded-2xl px-5 py-3.5 text-[#1E293B] text-sm font-semibold focus:outline-none focus:shadow-[4px_4px_0px_0px_#8B5CF6]"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#FFFDF5] border-2 border-[#1E293B] text-[#1E293B] font-bold text-xs rounded-2xl px-4 py-3.5 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="live">Live Matches</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#8B5CF6] text-white font-extrabold text-xs rounded-full pop-button font-heading tracking-wider"
            >
              {loading ? 'Searching...' : 'Search ➔'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-[#F472B6]/20 border-2 border-[#1E293B] rounded-2xl text-[#1E293B] font-bold text-xs">
            ⚠️ {error}
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Matches */}
            {results.matchesPage?.content?.length > 0 && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#8B5CF6] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>🏏</span> Matches ({results.matchesPage.totalElements})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.matchesPage.content.map((m) => (
                    <Link
                      key={m.id}
                      to={`/scoreboard/${m.id}`}
                      className="block p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] hover:bg-[#FBBF24]/20 pop-shadow-sm transition-all"
                    >
                      <div className="font-extrabold text-[#1E293B] text-base font-heading">
                        {m.teamAName} vs {m.teamBName}
                      </div>
                      <div className="text-xs text-slate-600 font-semibold mt-1 flex items-center justify-between">
                        <span>Venue: {m.venue || 'Main Stadium'}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[10px] font-extrabold border border-[#1E293B]">{m.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            {results.playersPage?.content?.length > 0 && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#34D399] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>👤</span> Players ({results.playersPage.totalElements})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {results.playersPage.content.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] pop-shadow-sm">
                      <div className="font-extrabold text-[#1E293B] text-sm font-heading">{p.name}</div>
                      <div className="text-xs text-slate-600 font-semibold mt-0.5">{p.role || 'Squad Member'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teams */}
            {results.teamsPage?.content?.length > 0 && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#F472B6] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>🛡️</span> Teams ({results.teamsPage.totalElements})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {results.teamsPage.content.map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] pop-shadow-sm">
                      <div className="font-extrabold text-[#1E293B] text-sm font-heading">{t.name}</div>
                      <div className="text-xs text-slate-600 font-bold mt-0.5">{t.shortName || 'FC'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tournaments */}
            {results.tournamentsPage?.content?.length > 0 && (
              <div className="bg-white border-2 border-[#1E293B] rounded-3xl p-6 pop-shadow-xl space-y-4">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#FBBF24] font-heading flex items-center gap-2 border-b-2 border-[#1E293B] pb-3">
                  <span>🏆</span> Tournaments ({results.tournamentsPage.totalElements})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.tournamentsPage.content.map((t) => (
                    <Link
                      key={t.id}
                      to="/tournaments"
                      className="block p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] hover:bg-[#FBBF24]/20 pop-shadow-sm transition-all"
                    >
                      <div className="font-extrabold text-[#1E293B] text-base font-heading">{t.name}</div>
                      <div className="text-xs text-slate-600 font-semibold mt-1">{t.format} • {t.status}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
