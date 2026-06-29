import { useState, useEffect, useCallback } from 'react';

// ── useDarkMode: toggle dark class on <html> ──────────────────────────────────
export const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggle = useCallback(() => setDark((prev) => !prev), []);

  return { dark, toggle };
};

// ── useDebounce: delay value updates for search inputs ────────────────────────
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// ── usePagination: page navigation helpers ────────────────────────────────────
export const usePagination = (totalPages = 1, initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const goTo = useCallback((p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  }, [totalPages]);

  return { page, setPage, goTo, canPrev: page > 1, canNext: page < totalPages };
};
