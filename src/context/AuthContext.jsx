import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/users.js';

// createContext gives us a "box" that any descendant component can read
// from via useContext, without threading `user` as a prop through every
// layer of the component tree (avoids "prop drilling").
const AuthContext = createContext(null);

const STORAGE_KEY = 'oha_demo_session';

export function AuthProvider({ children }) {
  // `user` is null when logged out, or the logged-in user object.
  const [user, setUser] = useState(null);
  // `loading` is true only during the initial localStorage check on page
  // load, so we don't flash the login screen before we've checked for an
  // existing session (same UX contract the real PHP-session app has).
  const [loading, setLoading] = useState(true);

  // Runs once on mount. Reads any previously-saved session out of
  // localStorage so a page refresh doesn't log the user out — the brief
  // explicitly allows this as the persistence mechanism for the demo.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // Corrupted/unavailable storage — just treat as logged out.
    }
    setLoading(false);
  }, []);

  // Simulated login. Returns a Promise so callers can `await` it and show
  // a loading spinner, matching how a real fetch()-based login would behave.
  function login(username, password) {
    return new Promise((resolve, reject) => {
      // setTimeout mimics network latency — makes the loading state on the
      // login button actually visible/demonstrable instead of resolving
      // instantly, which would look broken/too-fast to a stakeholder.
      setTimeout(() => {
        const match = DEMO_USERS.find(
          (u) => u.username === username && u.password === password
        );
        if (!match) {
          reject(new Error('Invalid username or password.'));
          return;
        }
        // Strip the password before storing — even in a mock, never persist
        // credentials into localStorage in plaintext for longer than needed.
        const { password: _pw, ...safeUser } = match;
        setUser(safeUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
        resolve(safeUser);
      }, 550);
    });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  // The value object passed to every consumer of useAuth().
  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook wrapping useContext — the standard pattern so consumers write
// `const { user } = useAuth()` instead of importing AuthContext everywhere.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
