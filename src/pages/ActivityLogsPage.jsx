import { Search, ShieldCheck } from 'lucide-react';
import { MOCK_LOGS, LOG_MODULES, LOG_ACTIONS } from '../data/logs.js';
import { useTableControls, useSimulatedFetch } from '../hooks/useTableControls.js';
import { Pagination, SkeletonRows, EmptyState } from '../components/ui/Feedback.jsx';

export default function ActivityLogsPage() {
  const { loading } = useSimulatedFetch(null, 500);
  const table = useTableControls({ items: MOCK_LOGS, searchFields: ['user', 'target', 'action'], pageSize: 8 });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Activity Logs</h1>
          <p>Administrative audit trail — accountability and traceability only</p>
        </div>
      </div>

      <div className="immutable-banner">
        <ShieldCheck size={16} />
        These entries are append-only and permanent. No log entry can be edited or deleted, by any role, including Administrator.
      </div>

      <div className="table-toolbar">
        <div className="search-input">
          <Search size={16} />
          <input placeholder="Search by user or target..." value={table.query} onChange={(e) => table.setQuery(e.target.value)} />
        </div>
        <div className="table-filters">
          <select className="select-input" value={table.filters.module || 'All'} onChange={(e) => table.setFilter('module', e.target.value)}>
            <option value="All">All Modules</option>
            {LOG_MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="select-input" value={table.filters.action || 'All'} onChange={(e) => table.setFilter('action', e.target.value)}>
            <option value="All">All Actions</option>
            {LOG_ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Module</th><th>Target</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows rows={7} cols={8} />
            ) : table.items.length === 0 ? (
              <tr><td colSpan={8}><EmptyState title="No log entries found" message="Try a different search or filter." /></td></tr>
            ) : (
              table.items.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td>{log.user}</td>
                  <td>{log.role ? <span className={`badge badge--${log.role}`}>{log.role}</span> : '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{log.action.replace('_', ' ')}</td>
                  <td>{log.module}</td>
                  <td>{log.target}</td>
                  <td style={{ maxWidth: 220, fontSize: 12.5, color: 'var(--text-muted)' }}>{log.reason || '—'}</td>
                  {/* Status is only ever populated for login/login_failed rows — every
                      other action type is logged only after it completes successfully,
                      so there's nothing meaningful to show. Blank, not "N/A" clutter. */}
                  <td>{log.status ? <span className={`badge ${log.status === 'Success' ? 'badge--success' : 'badge--failed'}`}>{log.status}</span> : ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && <Pagination page={table.page} totalPages={table.totalPages} onChange={table.setPage} totalItems={table.totalItems} pageSize={table.pageSize} />}
      </div>
    </div>
  );
}
