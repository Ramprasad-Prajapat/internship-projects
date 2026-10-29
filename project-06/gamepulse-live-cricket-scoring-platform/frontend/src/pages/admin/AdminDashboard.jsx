import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [backups, setBackups] = useState([]);
  const [backupActionStatus, setBackupActionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes, healthRes, metricsRes, backupsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: null })),
        api.get('/admin/audit-logs').catch(() => ({ data: [] })),
        api.get('/health').catch((err) => ({ data: err.response?.data || { status: 'DOWN', database: { status: 'DISCONNECTED' } } })),
        api.get('/metrics').catch(() => ({ data: null })),
        api.get('/admin/backups').catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data);
      setLogs(logsRes.data);
      setHealth(healthRes.data);
      setMetrics(metricsRes.data);
      setBackups(backupsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin console', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setBackupActionStatus('Creating backup...');
      await api.post('/admin/backups/create');
      setBackupActionStatus('Backup created successfully!');
      fetchAdminData();
    } catch (err) {
      console.error('Backup creation failed', err);
      setBackupActionStatus('Backup creation failed.');
    }
  };

  const handleVerifyBackup = async (id) => {
    try {
      setBackupActionStatus(`Verifying backup ${id}...`);
      await api.post(`/admin/backups/${id}/verify`);
      setBackupActionStatus(`Backup ${id} verified.`);
      fetchAdminData();
    } catch (err) {
      console.error('Backup verification failed', err);
      setBackupActionStatus('Verification failed.');
    }
  };

  const handleRestoreBackup = async (id) => {
    if (!window.confirm(`⚠️ Are you sure you want to restore database from backup ${id}? This will overwrite existing data!`)) return;
    try {
      setBackupActionStatus(`Restoring database from ${id}...`);
      await api.post(`/admin/backups/${id}/restore`);
      setBackupActionStatus(`Database successfully restored from ${id}!`);
      fetchAdminData();
    } catch (err) {
      console.error('Backup restore failed', err);
      setBackupActionStatus('Restore failed.');
    }
  };

  const handleRetentionCleanup = async () => {
    try {
      setBackupActionStatus('Applying retention cleanup...');
      const res = await api.post('/admin/backups/retention?limit=10');
      setBackupActionStatus(`Cleanup complete. Retained ${res.data.retainedCount} backups (deleted ${res.data.deletedCount}).`);
      fetchAdminData();
    } catch (err) {
      console.error('Retention cleanup failed', err);
      setBackupActionStatus('Retention cleanup failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            ⚙️ Admin Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">Platform management, audit trails, system health, and metrics</p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition border border-slate-700"
        >
          🔄 Refresh Status
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading admin metrics...</div>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
              <div className="text-3xl font-extrabold text-cyan-400 mt-2">{stats?.totalUsers ?? 0}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Matches</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-2">{stats?.totalMatches ?? 0}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teams</div>
              <div className="text-3xl font-extrabold text-indigo-400 mt-2">{stats?.totalTeams ?? 0}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Players</div>
              <div className="text-3xl font-extrabold text-amber-400 mt-2">{stats?.totalPlayers ?? 0}</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tournaments</div>
              <div className="text-3xl font-extrabold text-purple-400 mt-2">{stats?.totalTournaments ?? 0}</div>
            </div>
          </div>

          {/* System Health & Observability Metrics */}
          {health && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2"><span>🖥️</span> Infrastructure Observability & Metrics</span>
                <span className={`text-xs px-3 py-1 rounded-full font-mono font-bold ${health.status === 'UP' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                  {health.status === 'UP' ? 'HEALTHY' : 'UNHEALTHY'}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-medium">Database Connection</div>
                  <div className="text-base font-bold text-cyan-400 mt-1 flex items-center justify-between">
                    <span>{typeof health.database === 'object' ? health.database.status : health.database}</span>
                    {typeof health.database === 'object' && health.database.pingLatencyMs != null && (
                      <span className="text-xs font-mono text-slate-400">({health.database.pingLatencyMs}ms)</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-medium">JVM Memory Used</div>
                  <div className="text-base font-bold text-indigo-400 mt-1">
                    {health.jvmMemory?.usedMemoryMB ?? 0} MB <span className="text-xs font-normal text-slate-500">/ {health.jvmMemory?.totalMemoryMB ?? 0} MB</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-medium">Active Threads</div>
                  <div className="text-base font-bold text-amber-400 mt-1">
                    {health.threads?.threadCount ?? 'N/A'} <span className="text-xs font-normal text-slate-500">(Peak: {health.threads?.peakThreadCount ?? 'N/A'})</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-medium">Avg API Latency</div>
                  <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                    {metrics?.averageLatencyMs ?? 0} ms
                  </div>
                </div>
              </div>

              {metrics && (
                <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400">Total HTTP Requests:</span>{' '}
                    <strong className="text-white font-mono">{metrics.totalRequests ?? 0}</strong>
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400">Total Error Responses:</span>{' '}
                    <strong className="text-rose-400 font-mono">{metrics.totalErrors ?? 0}</strong> (4xx: {metrics.total4xxErrors ?? 0}, 5xx: {metrics.total5xxErrors ?? 0})
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400">Uptime:</span>{' '}
                    <strong className="text-cyan-400 font-mono">{metrics.uptimeSeconds ?? 0}s</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Database Backup & Disaster Recovery */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🗄️</span> Database Backup & Disaster Recovery
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Create, verify, restore, and prune database snapshots</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateBackup}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition border border-emerald-500/30 flex items-center gap-1.5"
                >
                  <span>⚡</span> Create Backup
                </button>
                <button
                  onClick={handleRetentionCleanup}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition border border-slate-700 flex items-center gap-1.5"
                >
                  <span>🧹</span> Cleanup Policy
                </button>
              </div>
            </div>

            {backupActionStatus && (
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-xs font-mono text-cyan-300">
                {backupActionStatus}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Backup ID</th>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Records</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Checksum</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {backups.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">
                        No backup archives generated yet. Click "Create Backup" above.
                      </td>
                    </tr>
                  ) : (
                    backups.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30 transition text-xs">
                        <td className="py-3 px-4 font-mono text-white font-semibold">{b.id}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{b.fileName}</td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{(b.fileSizeBytes / 1024).toFixed(1)} KB</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{b.recordCount ?? 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${b.status === 'VERIFIED' || b.status === 'VALIDATED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : b.status === 'RESTORED' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 max-w-[120px] truncate" title={b.checksum}>
                          {b.checksum ? b.checksum.substring(0, 10) + '...' : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleVerifyBackup(b.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold text-[11px]"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleRestoreBackup(b.id)}
                            className="px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded font-semibold text-[11px]"
                          >
                            Restore
                          </button>
                          <a
                            href={`/api/admin/backups/${b.id}/download`}
                            download
                            className="px-2 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 rounded font-semibold text-[11px] inline-block"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> System Audit Log Trail
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Entity ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 text-xs font-mono text-slate-400">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">{log.performedBy || log.actor || 'System'}</td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{log.action}</td>
                        <td className="py-3 px-4 text-slate-300">{log.entityName}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{log.entityId}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
