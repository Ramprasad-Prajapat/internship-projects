// FaceTrack AI — DataTable.
// columns: [{ key, label, align?, sortable?, render?(row), sortValue?(row) }].
// Client-side sort on header click; optional built-in pagination via `pageSize`.

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  emptyMessage = 'No records found.',
  emptyIcon,
  initialSort = null,
  pageSize,
}) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = col.sortValue || ((r) => r[col.key]);
    const arr = [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return va - vb;
      return String(va).localeCompare(String(vb), undefined, { numeric: true });
    });
    return sort.dir === 'desc' ? arr.reverse() : arr;
  }, [rows, sort, columns]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const paged = pageSize ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted;

  const toggleSort = (key) =>
    setSort((s) => (s && s.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));

  const keyFn = typeof rowKey === 'function' ? rowKey : (r) => r[rowKey];

  if (!rows.length) return <EmptyState icon={emptyIcon} message={emptyMessage} />;

  return (
    <>
      <div className="ft-table-wrap">
        <table className="ft-table">
          <thead>
            <tr>
              {columns.map((c) => {
                const sortable = c.sortable !== false;
                return (
                  <th
                    key={c.key}
                    style={{ textAlign: c.align || 'left' }}
                    className={sortable ? 'ft-th-sortable' : undefined}
                    onClick={sortable ? () => toggleSort(c.key) : undefined}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {c.label}
                      {sort?.key === c.key ? (sort.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={keyFn(r)}>
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align || 'left' }}>
                    {c.render ? c.render(r) : r[c.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageSize && pageCount > 1 ? (
        <div className="ft-pager">
          <span className="ft-pager-info">
            Page {safePage + 1} of {pageCount} · {sorted.length} records
          </span>
          <div className="ft-pager-btns">
            <button
              className="ft-btn ft-btn--subtle ft-btn--sm"
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((pp) => Math.max(0, pp - 1))}
            >
              Prev
            </button>
            <button
              className="ft-btn ft-btn--subtle ft-btn--sm"
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((pp) => Math.min(pageCount - 1, pp + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
