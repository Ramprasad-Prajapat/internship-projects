import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateMatch = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quick setup state
  const [teamAName, setTeamAName] = useState('India');
  const [teamBName, setTeamBName] = useState('Australia');
  const [venue, setVenue] = useState('Wankhede Stadium, Mumbai');
  const [totalOvers, setTotalOvers] = useState(20);

  // Match Created
  const [createdMatch, setCreatedMatch] = useState(null);
  const [tossWinnerId, setTossWinnerId] = useState('');
  const [tossDecision, setTossDecision] = useState('BAT');

  // Player Selection for Start Innings
  const [strikerId, setStrikerId] = useState('');
  const [nonStrikerId, setNonStrikerId] = useState('');
  const [bowlerId, setBowlerId] = useState('');

  // Rosters for selection dropdowns
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);

  const handleCreateQuickMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Team A
      const tARes = await api.post('/teams', { name: teamAName, shortName: teamAName.substring(0, 3).toUpperCase() });
      const teamA = tARes.data;

      // 2. Create Team B
      const tBRes = await api.post('/teams', { name: teamBName, shortName: teamBName.substring(0, 3).toUpperCase() });
      const teamB = tBRes.data;

      // 3. Add default players to Team A
      const pA1 = await api.post(`/teams/${teamA.id}/players`, { name: 'Rohit Sharma', role: 'BATTER' });
      const pA2 = await api.post(`/teams/${teamA.id}/players`, { name: 'Shubman Gill', role: 'BATTER' });
      const pA3 = await api.post(`/teams/${teamA.id}/players`, { name: 'Virat Kohli', role: 'BATTER' });

      // 4. Add default players to Team B
      const pB1 = await api.post(`/teams/${teamB.id}/players`, { name: 'Mitchell Starc', role: 'BOWLER' });
      const pB2 = await api.post(`/teams/${teamB.id}/players`, { name: 'Pat Cummins', role: 'BOWLER' });

      setTeamAPlayers([pA1.data, pA2.data, pA3.data]);
      setTeamBPlayers([pB1.data, pB2.data]);

      // 5. Create Match
      const mRes = await api.post('/matches', {
        teamAId: teamA.id,
        teamBId: teamB.id,
        venue,
        format: 'T20',
        totalOvers,
      });

      setCreatedMatch(mRes.data);
      setTossWinnerId(teamA.id);
      setStrikerId(pA1.data.id);
      setNonStrikerId(pA2.data.id);
      setBowlerId(pB1.data.id);

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup quick match');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordToss = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post(`/matches/${createdMatch.id}/toss`, {
        tossWinnerId,
        tossDecision,
      });
      setCreatedMatch(res.data);

      // Determine batting and bowling rosters
      const isTeamABatting = 
        (String(tossWinnerId) === String(createdMatch.teamA?.id) && tossDecision === 'BAT') ||
        (String(tossWinnerId) === String(createdMatch.teamB?.id) && tossDecision === 'BOWL');

      const batPlayers = isTeamABatting ? teamAPlayers : teamBPlayers;
      const bowlPlayers = isTeamABatting ? teamBPlayers : teamAPlayers;

      if (batPlayers.length > 0) setStrikerId(batPlayers[0].id);
      if (batPlayers.length > 1) setNonStrikerId(batPlayers[1].id);
      if (bowlPlayers.length > 0) setBowlerId(bowlPlayers[0].id);

      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record toss');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInnings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post(`/matches/${createdMatch.id}/start`, {
        strikerId,
        nonStrikerId,
        bowlerId,
      });
      navigate(`/scorer/${createdMatch.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start innings');
    } finally {
      setLoading(false);
    }
  };

  // Compute dynamic lists for dropdown rendering
  const isTeamABatting = createdMatch && (
    (String(tossWinnerId) === String(createdMatch.teamA?.id) && tossDecision === 'BAT') ||
    (String(tossWinnerId) === String(createdMatch.teamB?.id) && tossDecision === 'BOWL')
  );
  const battingRoster = isTeamABatting ? teamAPlayers : teamBPlayers;
  const bowlingRoster = isTeamABatting ? teamBPlayers : teamAPlayers;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">MATCH SETUP WIZARD</span>
            <h1 className="text-2xl font-bold text-white">Create New Match</h1>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === s ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Step 1: Match Details */}
        {step === 1 && (
          <form onSubmit={handleCreateQuickMatch} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Team A Name</label>
              <input
                type="text"
                required
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Team B Name</label>
              <input
                type="text"
                required
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Venue</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Total Overs</label>
              <input
                type="number"
                required
                value={totalOvers}
                onChange={(e) => setTotalOvers(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition"
            >
              {loading ? 'Creating Match & Rosters...' : 'Next: Toss Setup ➡️'}
            </button>
          </form>
        )}

        {/* Step 2: Toss Record */}
        {step === 2 && createdMatch && (
          <form onSubmit={handleRecordToss} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Toss Winner</label>
              <select
                value={tossWinnerId}
                onChange={(e) => setTossWinnerId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                <option value={createdMatch.teamA?.id}>{createdMatch.teamA?.name}</option>
                <option value={createdMatch.teamB?.id}>{createdMatch.teamB?.name}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Decision</label>
              <select
                value={tossDecision}
                onChange={(e) => setTossDecision(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                <option value="BAT">Elected to BAT first</option>
                <option value="BOWL">Elected to BOWL first</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition"
            >
              {loading ? 'Recording Toss...' : 'Next: Select Opening Players ➡️'}
            </button>
          </form>
        )}

        {/* Step 3: Start Innings */}
        {step === 3 && createdMatch && (
          <form onSubmit={handleStartInnings} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Opening Striker</label>
              <select
                value={strikerId}
                onChange={(e) => setStrikerId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                {battingRoster.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Non-Striker</label>
              <select
                value={nonStrikerId}
                onChange={(e) => setNonStrikerId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                {battingRoster.map((p) => (
                  <option key={p.id} value={p.id} disabled={String(p.id) === String(strikerId)}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Opening Bowler</label>
              <select
                value={bowlerId}
                onChange={(e) => setBowlerId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              >
                {bowlingRoster.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
            >
              {loading ? 'Starting Innings...' : '⚡ START LIVE SCORING CONSOLE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateMatch;
