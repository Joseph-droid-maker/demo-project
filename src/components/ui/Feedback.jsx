import { Inbox, ChevronLeft, ChevronRight } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Icon size={26} /></div>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}

// A skeleton "loading" placeholder. width/height accept any valid CSS
// dimension string ('100%', '40px', etc.) so callers can shape it to
// whatever it's standing in for (a table row, a KPI number, etc.)
export function Skeleton({ width = '100%', height = '16px', style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

// A small helper used by pages to render N skeleton rows while a simulated
// fetch is "in flight" (see the useSimulatedFetch hook).
export function SkeletonRows({ rows = 5, cols = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c}><Skeleton height="14px" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Pagination: classic derived-state pattern — this component owns no state
// of its own, it just renders based on (page, totalPages) and calls
// onChange with the new page number. Keeping pagination state in the
// PARENT (not here) means the parent can reset it when filters change.
export function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  // Show at most 5 page number buttons, centered around the current page,
  // clamped to valid bounds — avoids rendering 50 buttons for large datasets.
  const pages = [];
  let from = Math.max(1, page - 2);
  let to = Math.min(totalPages, from + 4);
  from = Math.max(1, to - 4);
  for (let p = from; p <= to; p++) pages.push(p);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="pagination-controls">
        <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={15} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        <button className="page-btn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
