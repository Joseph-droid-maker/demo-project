import { useState, useEffect, useMemo } from 'react';

// Simulates the "fetch data on mount" pattern every page in a real app
// does against an API. Returns `loading` for a short window so skeleton
// states are actually visible/demonstrable, then flips to the given data.
// delay is configurable per-call so different pages can vary latency
// slightly (feels more organic than every page loading in perfect unison).
export function useSimulatedFetch(data, delay = 500) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), delay);
    // Cleanup: cancel the timeout if the component unmounts before it
    // fires, to avoid a "set state on unmounted component" warning.
    return () => clearTimeout(t);
  }, [delay]);

  return { data, loading };
}

// Generic table-controls hook: search + arbitrary filters + sort + pagination.
//
// Concepts: useMemo to avoid re-filtering/re-sorting the full dataset on
// every render (only recomputes when its dependency array changes) —
// matters here because filtering happens on every keystroke in the search
// box, and without memoization we'd re-run the full pipeline needlessly
// whenever an unrelated piece of state (e.g. a modal open/close) changes.
//
// searchFields: array of object keys to match the search query against.
// filterFn: optional (item, filters) => boolean for filter-dropdown logic.
export function useTableControls({ items, searchFields = [], pageSize = 8 }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = items;

    // Text search across the configured fields, case-insensitive.
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => String(item[field] ?? '').toLowerCase().includes(q))
      );
    }

    // Dropdown filters: { categoryFilterKey: 'value' }. 'All' / '' / undefined
    // means "no constraint on this field" — skipped rather than matched literally.
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'All') {
        result = result.filter((item) => String(item[key]) === String(val));
      }
    });

    // Sort, if a sort key is active.
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, filters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Clamp page into valid range if filtering shrank the result set below
  // the current page number (e.g. user was on page 3, then searched and
  // now there's only 1 page of results).
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  // Any change to search/filter should reset back to page 1 — otherwise a
  // user could end up "stuck" on page 4 of a filtered set that only has 1 page.
  function setFilter(key, val) {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  }
  function setQueryAndReset(q) {
    setQuery(q);
    setPage(1);
  }

  return {
    query, setQuery: setQueryAndReset,
    filters, setFilter,
    sortKey, sortDir, toggleSort,
    page: safePage, setPage, totalPages,
    items: paged,
    totalItems: filtered.length,
    pageSize,
  };
}
